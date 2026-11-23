// @vitest-environment node
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { copyFileSync, existsSync, mkdtempSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
// @ts-expect-error plain ESM module without types
import { readParquetTable, readParquetGraph } from "../parquet-plugin.mjs";

// Directory with the Parquet package (default: the site data).
const DATA_DIR = resolve(process.env.HORIZON_DATA_DIR ?? "src/data");
// Optional directory with JSON from the SAME ETL run, for the equivalence run.
const REF_DIR = process.env.HORIZON_REF_DIR;

const have = (name: string) => existsSync(join(DATA_DIR, name));
const hasData = have("research_groups_canonical.parquet") && have("campuses_canonical.parquet");

describe.skipIf(!hasData)("parquet import contract", () => {
    it("reads a table as an array of plain objects with numeric ids (no BigInt)", async () => {
        const rows = await readParquetTable(join(DATA_DIR, "campuses_canonical.parquet"));
        expect(Array.isArray(rows)).toBe(true);
        expect(rows.length).toBeGreaterThan(0);
        for (const row of rows) {
            expect(typeof row).toBe("object");
            for (const v of Object.values(row)) expect(typeof v).not.toBe("bigint");
        }
    });

    it("revives JSON columns listed in the sidecar into objects and lists", async () => {
        const rows = await readParquetTable(join(DATA_DIR, "research_groups_canonical.parquet"));
        const withMembers = rows.find((r: any) => Array.isArray(r.members) && r.members.length > 0);
        expect(withMembers).toBeDefined();
        expect(Array.isArray(withMembers.knowledge_areas)).toBe(true);
    });

    it("restricts to the requested columns", async () => {
        const rows = await readParquetTable(join(DATA_DIR, "campuses_canonical.parquet"), { columns: ["id"] });
        expect(rows.length).toBeGreaterThan(0);
        expect(Object.keys(rows[0])).toEqual(["id"]);
    });

    it("fails with the file name when a requested column does not exist", async () => {
        const file = join(DATA_DIR, "campuses_canonical.parquet");
        await expect(readParquetTable(file, { columns: ["nao_existe"] })).rejects.toThrow(/campuses_canonical\.parquet.*nao_existe/);
    });

    it("fails with the file name when the file is missing", async () => {
        await expect(readParquetTable(join(DATA_DIR, "nao_existe.parquet"))).rejects.toThrow(/nao_existe\.parquet.*ausente/);
    });

    describe("broken files", () => {
        let dir: string;
        beforeAll(() => {
            dir = mkdtempSync(join(tmpdir(), "parquet-contract-"));
            copyFileSync(join(DATA_DIR, "campuses_canonical.parquet"), join(dir, "sem_sidecar.parquet"));
            writeFileSync(join(dir, "vazio.parquet"), "");
            writeFileSync(join(dir, "vazio.cols.json"), "{}");
            writeFileSync(join(dir, "lixo.parquet"), "isto nao e parquet");
            writeFileSync(join(dir, "lixo.cols.json"), "{}");
        });
        afterAll(() => rmSync(dir, { recursive: true, force: true }));

        it("rejects a missing sidecar naming the file", async () => {
            await expect(readParquetTable(join(dir, "sem_sidecar.parquet"))).rejects.toThrow(/sem_sidecar\.parquet.*sidecar ausente/);
        });
        it("rejects an empty file naming the file", async () => {
            await expect(readParquetTable(join(dir, "vazio.parquet"))).rejects.toThrow(/vazio\.parquet.*vazio/);
        });
        it("rejects a corrupted file naming the file", async () => {
            await expect(readParquetTable(join(dir, "lixo.parquet"))).rejects.toThrow(/lixo\.parquet.*corrompido/);
        });
    });
});

describe.skipIf(!hasData || !have("students_relationship_graph.meta.json"))("graph import", () => {
    it("reassembles a node-link object", async () => {
        const graph = await readParquetGraph(DATA_DIR, "students_relationship_graph");
        expect(graph).toHaveProperty("metadata");
        expect(graph).toHaveProperty("graph_stats");
        expect(Array.isArray(graph.graph.nodes)).toBe(true);
        expect(Array.isArray(graph.graph.edges)).toBe(true);
        expect(graph.graph.nodes.length).toBeGreaterThan(0);
    });
});

describe.skipIf(!hasData)("plugin query imports", () => {
    it("imports a .parquet through the Vite plugin", async () => {
        const path = join(DATA_DIR, "campuses_canonical.parquet");
        const mod = await import(/* @vite-ignore */ path);
        expect(Array.isArray(mod.default)).toBe(true);
        expect(mod.default.length).toBeGreaterThan(0);
    });

    it("imports only the requested columns with ?columns=", async () => {
        const path = join(DATA_DIR, "campuses_canonical.parquet") + "?columns=id";
        const mod = await import(/* @vite-ignore */ path);
        expect(Object.keys(mod.default[0])).toEqual(["id"]);
    });
});

describe.skipIf(!hasData)("normalized names in the committed Parquet", () => {
    it("every table is already normalized (dry run changes nothing)", async () => {
        // @ts-expect-error plain ESM module without types
        const { normalizeParquetFile, datasetOf } = await import("../scripts/normalize-parquet.mjs");
        // @ts-expect-error plain ESM module without types
        const { EXCLUDE_DATASETS } = await import("../scripts/normalize-names.mjs");
        const files = readdirSync(DATA_DIR).filter((f) => f.endsWith(".parquet") && !EXCLUDE_DATASETS.has(datasetOf(f)));
        expect(files.length).toBeGreaterThan(0);
        const changed: string[] = [];
        for (const f of files) {
            if ((await normalizeParquetFile(join(DATA_DIR, f), { dryRun: true })) > 0) changed.push(f);
        }
        expect(changed).toEqual([]);
    }, 300_000);

    it("researcher names are Title Case with acronyms kept", async () => {
        const rows = await readParquetTable(join(DATA_DIR, "researchers_canonical.parquet"), { columns: ["name"] });
        const names = rows.map((r: any) => r.name).filter((n: unknown): n is string => typeof n === "string" && n.length > 0);
        expect(names.length).toBeGreaterThan(0);
        for (const n of names) {
            expect(n).toBe(n.trim());
            // No fully upper-case multi-word names left (e.g. "MARIA DA SILVA").
            expect(/\s/.test(n) && n === n.toUpperCase() && /[A-Z]{4,}/.test(n)).toBe(false);
        }
    });

    it("short_name values are trimmed but keep their case", async () => {
        const rows = await readParquetTable(join(DATA_DIR, "research_groups_canonical.parquet"), { columns: ["short_name"] });
        const values = rows.map((r: any) => r.short_name).filter((v: unknown): v is string => typeof v === "string");
        for (const v of values) expect(v).toBe(v.trim());
        expect(values.some((v: string) => v.length > 1 && v === v.toUpperCase())).toBe(true);
    });
});

describe.skipIf(!hasData || !REF_DIR)("equivalence with the JSON of the same ETL run", () => {
    it("every table and graph equals its JSON reference (scripts/verify-data.mjs)", () => {
        const result = spawnSync(
            process.execPath,
            ["--max-old-space-size=12288", "scripts/verify-data.mjs", "--dir", DATA_DIR, "--reference", REF_DIR as string],
            { encoding: "utf8" },
        );
        expect(result.stderr + result.stdout).toContain("OK");
        expect(result.status).toBe(0);
    }, 900_000);
});
