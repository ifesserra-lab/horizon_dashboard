// @vitest-environment node
// Name normalization applied to the Parquet package (spec FR-008, T033).
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { mkdtempSync, rmSync, writeFileSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { parquetWriteBuffer } from "hyparquet-writer";
import { readParquetTable } from "../src/lib/parquet-reader.mjs";
import {
  normalizeParquetFile,
  readRawParquet,
  writeRawParquet,
  datasetOf,
} from "../scripts/normalize-parquet.mjs";
import {
  EXCLUDE_DATASETS,
  transformJsonText,
  normalizeJsonColumnText,
} from "../scripts/normalize-names.mjs";

let dir: string;

function writeTable(name: string, jsonColumns: string[]) {
  const people = [
    { id: 1n, name: "MARIA DA SILVA", short_name: " IFES ", program: "BOLSA PIBIC NO IFES", active: true, score: 1.5, tags: '{"name":"JOÃO DE SOUZA","code":"ABC"}', names: '["ANA E PAULO"]' },
    { id: 2n, name: "Carlos de Oliveira", short_name: null, program: null, active: null, score: null, tags: null, names: '[]' },
    { id: 9007199254740993n, name: null, short_name: "PJ", program: "projeto COVID-19 e SCADA", active: false, score: -2, tags: '{"title":"ANÁLISE DE DADOS","items":[{"nome":"PEDRO ALVES"}]}', names: '["José"]' },
  ];
  const col = (k: keyof (typeof people)[0]) => people.map((p) => p[k]);
  const buf = parquetWriteBuffer({
    columnData: [
      { name: "id", data: col("id"), type: "INT64" },
      { name: "name", data: col("name"), type: "STRING" },
      { name: "short_name", data: col("short_name"), type: "STRING" },
      { name: "program", data: col("program"), type: "STRING" },
      { name: "active", data: col("active"), type: "BOOLEAN" },
      { name: "score", data: col("score"), type: "DOUBLE" },
      { name: "tags", data: col("tags"), type: "STRING" },
      { name: "names", data: col("names"), type: "STRING" },
    ],
  });
  const path = join(dir, `${name}.parquet`);
  writeFileSync(path, new Uint8Array(buf));
  writeFileSync(join(dir, `${name}.cols.json`), JSON.stringify({ json_columns: jsonColumns }));
  return path;
}

beforeAll(() => {
  dir = mkdtempSync(join(tmpdir(), "normalize-parquet-"));
});
afterAll(() => rmSync(dir, { recursive: true, force: true }));

describe("ida e volta do Parquet", () => {
  it("preserva inteiros grandes, nulos, booleanos, doubles e colunas JSON", async () => {
    const path = writeTable("roundtrip", ["tags", "names"]);
    const before = await readRawParquet(path);
    writeRawParquet(path, before);
    const after = await readRawParquet(path);
    expect(after.metadata.schema).toEqual(before.metadata.schema);
    expect(after.columns).toEqual(before.columns);
    expect(after.columns[0].data[2]).toBe(9007199254740993n);
    expect(after.metadata.row_groups[0].columns[0].meta_data.codec).toBe("ZSTD");

    const rows = await readParquetTable(path);
    expect(rows[1]).toMatchObject({ id: 2, short_name: null, active: null, score: null, tags: null });
    expect(rows[0].tags).toEqual({ name: "JOÃO DE SOUZA", code: "ABC" });
  });
});

describe("normalização de nomes no Parquet", () => {
  let rows: Record<string, unknown>[];
  let changed: number;
  let path: string;

  beforeAll(async () => {
    path = writeTable("people", ["tags", "names"]);
    changed = await normalizeParquetFile(path);
    rows = await readParquetTable(path);
  });

  it("aplica Title Case nas colunas de nome", () => {
    expect(rows[0].name).toBe("Maria da Silva");
    expect(rows[1].name).toBe("Carlos de Oliveira"); // misto: intocado
    expect(rows[2].name).toBeNull();
  });

  it("só apara short_name e não mexe em colunas que não são de nome", () => {
    expect(rows[0].short_name).toBe("IFES");
    expect(rows[0].program).toBe("BOLSA PIBIC NO IFES");
    expect(rows[2].program).toBe("projeto COVID-19 e SCADA");
  });

  it("normaliza chaves de nome/título dentro das colunas JSON e mantém siglas", () => {
    expect(rows[0].tags).toEqual({ name: "João de Souza", code: "ABC" });
    expect(rows[2].tags).toEqual({ title: "Análise de Dados", items: [{ nome: "Pedro Alves" }] });
    // lista de nomes numa coluna JSON é julgada pelo nome da coluna
    expect(rows[0].names).toEqual(["Ana e Paulo"]);
    expect(rows[2].names).toEqual(["José"]);
  });

  it("preserva tipos e é idempotente", async () => {
    expect(changed).toBe(5);
    expect(rows[2].id).toBe(9007199254740993);
    const bytes = readFileSync(path);
    expect(await normalizeParquetFile(path)).toBe(0);
    expect(readFileSync(path).equals(bytes)).toBe(true);
  });
});

describe("regras compartilhadas com normalize-names", () => {
  it("mantém siglas da lista de exceção", () => {
    expect(normalizeJsonColumnText("title", '"PROJETO PIBIC-JR NO IFES"')).toBe('"Projeto PIBIC-JR no IFES"');
    expect(normalizeJsonColumnText("name", '"COPPE/UFRJ E SETEC/MEC"')).toBe('"COPPE/UFRJ e SETEC/MEC"');
  });

  it("JSON comum continua igual (sem chave inicial)", () => {
    expect(transformJsonText('["MARIA DA SILVA"]')).toBe('["MARIA DA SILVA"]');
    expect(transformJsonText('{"name": "MARIA DA SILVA", "x": 0.0}')).toBe('{"name": "Maria da Silva", "x": 0.0}');
  });

  it("exclui os mesmos conjuntos de auditoria, inclusive partes de grafo", () => {
    expect(datasetOf("advisorships_tracking.parquet")).toBe("advisorships_tracking");
    expect(datasetOf("people_relationship_graph.nodes.parquet")).toBe("people_relationship_graph");
    for (const n of ["attribute_assertions_canonical", "source_records_canonical", "advisorships_tracking", "ingestion_runs_canonical"]) {
      expect(EXCLUDE_DATASETS.has(n)).toBe(true);
    }
  });
});
