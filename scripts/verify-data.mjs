#!/usr/bin/env node
/**
 * Verifies the Parquet data layout in src/data (spec FR-002, FR-005, FR-010).
 *
 * Always checks (structure):
 *  - no versioned file reaches the GitHub limit (100 MiB);
 *  - every <name>.parquet has its <name>.cols.json sidecar;
 *  - every graph has nodes + edges + meta (and no orphan part);
 *  - every .parquet is readable with the same decoder the build uses.
 *
 * With --reference <dir> it also compares each table/graph read from Parquet
 * with the reference JSON of the same name (row by row, field by field).
 * A key that is absent in the JSON but null in Parquet counts as equal
 * (Parquet is columnar, every row has every column); the count is reported.
 *
 * Usage (from the repo root):
 *   node scripts/verify-data.mjs
 *   node --max-old-space-size=8192 scripts/verify-data.mjs --reference <dir-with-json>
 *   node scripts/verify-data.mjs --dir src/data --tables awards_canonical,languages_canonical
 *
 * Exit code 1 when any check fails.
 */
import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { readParquetTable, readParquetGraph } from "../parquet-plugin.mjs";

const LIMIT_BYTES = 100 * 1024 * 1024;
// Wrapped tables: the rows live under one key of the reference JSON object.
const WRAPPED_KEYS = {
  horizon_ids_canonical: "ids",
  horizon_id_aliases_canonical: "aliases",
  source_document_states_canonical: "documents",
};

function parseArgs(argv) {
  const args = { dir: "src/data", reference: null, tables: null, show: 3 };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--dir") args.dir = argv[++i];
    else if (a === "--reference") args.reference = argv[++i];
    else if (a === "--tables") args.tables = new Set(argv[++i].split(",").filter(Boolean));
    else if (a === "--show") args.show = Number(argv[++i]);
    else throw new Error(`argumento desconhecido: ${a}`);
  }
  return args;
}

function walk(root) {
  const out = [];
  for (const entry of readdirSync(root, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === ".git") continue;
    const full = join(root, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

// ---------------------------------------------------------------- comparison

let absentVsNull = 0;

function describe(v) {
  const s = JSON.stringify(v);
  return s === undefined ? String(v) : s.length > 80 ? `${s.slice(0, 77)}...` : s;
}

/** Returns a string describing the first difference, or null when equal. */
function firstDiff(a, b, path) {
  if (a === b) return null;
  if (a == null && b == null) return null; // null vs undefined
  if (typeof a === "number" && typeof b === "number") {
    return Object.is(a, b) || a === b ? null : `${path}: ${a} != ${b}`;
  }
  if (Array.isArray(a) || Array.isArray(b)) {
    if (!Array.isArray(a) || !Array.isArray(b)) return `${path}: tipo diferente (${describe(a)} vs ${describe(b)})`;
    if (a.length !== b.length) return `${path}: tamanho ${a.length} != ${b.length}`;
    for (let i = 0; i < a.length; i++) {
      const d = firstDiff(a[i], b[i], `${path}[${i}]`);
      if (d) return d;
    }
    return null;
  }
  if (a && b && typeof a === "object" && typeof b === "object") {
    const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
    for (const k of keys) {
      const inA = k in a;
      const inB = k in b;
      if (inA !== inB) {
        const present = inA ? a[k] : b[k];
        if (present == null) {
          absentVsNull++;
          continue;
        }
        return `${path}.${k}: ausente em ${inA ? "referência" : "Parquet"} (valor ${describe(present)})`;
      }
      const d = firstDiff(a[k], b[k], `${path}.${k}`);
      if (d) return d;
    }
    return null;
  }
  return `${path}: ${describe(a)} != ${describe(b)}`;
}

function compareRows(parquetRows, refRows, label, show) {
  const diffs = [];
  if (parquetRows.length !== refRows.length) {
    diffs.push(`${label}: ${parquetRows.length} linhas em Parquet, ${refRows.length} na referência`);
    return diffs;
  }
  for (let i = 0; i < parquetRows.length && diffs.length < show; i++) {
    const d = firstDiff(parquetRows[i], refRows[i], `${label}[${i}]`);
    if (d) diffs.push(d);
  }
  return diffs;
}

function loadReference(refDir, name) {
  const file = join(refDir, `${name}.json`);
  if (!existsSync(file)) return null;
  try {
    return JSON.parse(readFileSync(file, "utf8"));
  } catch (err) {
    throw new Error(`referência inválida ${file}: ${err.message} (rode sanitize-json na pasta de referência)`);
  }
}

// ----------------------------------------------------------------------- main

async function main() {
  const args = parseArgs(process.argv);
  const dir = args.dir;
  const failures = [];
  const notes = [];

  const files = walk(dir);
  const names = new Set(files.map((f) => relative(dir, f)));

  // 1. size limit
  for (const f of files) {
    if (statSync(f).size >= LIMIT_BYTES) {
      failures.push(`${relative(dir, f)}: ${(statSync(f).size / 1048576).toFixed(1)} MiB (limite 100 MiB)`);
    }
  }

  // 2. layout: sidecars and graph parts
  const parquets = files.filter((f) => f.endsWith(".parquet")).map((f) => relative(dir, f));
  const graphNames = new Set();
  const tableNames = [];
  for (const p of parquets) {
    const base = p.replace(/\.parquet$/, "");
    if (!names.has(`${base}.cols.json`)) failures.push(`${p}: sidecar ${base}.cols.json ausente`);
    if (base.endsWith(".nodes")) graphNames.add(base.slice(0, -6));
    else if (base.endsWith(".edges")) graphNames.add(base.slice(0, -6));
    else tableNames.push(base);
  }
  for (const g of graphNames) {
    for (const part of [`${g}.nodes.parquet`, `${g}.edges.parquet`, `${g}.meta.json`]) {
      if (!names.has(part)) failures.push(`grafo ${g}: ${part} ausente`);
    }
  }

  const wanted = (n) => !args.tables || args.tables.has(n);

  // 3. decode every table/graph; optional comparison with the reference
  let compared = 0;
  let skippedNoRef = 0;
  for (const name of tableNames.filter(wanted)) {
    let rows;
    try {
      rows = await readParquetTable(join(dir, `${name}.parquet`));
    } catch (err) {
      failures.push(err.message);
      continue;
    }
    if (!args.reference) continue;
    const ref = loadReference(args.reference, name);
    if (ref == null) {
      skippedNoRef++;
      notes.push(`${name}: sem JSON de referência`);
      continue;
    }
    const refRows = Array.isArray(ref) ? ref : ref[WRAPPED_KEYS[name]];
    if (!Array.isArray(refRows)) {
      failures.push(`${name}: não achei as linhas na referência (chave ${WRAPPED_KEYS[name] ?? "?"})`);
      continue;
    }
    const diffs = compareRows(rows, refRows, name, args.show);
    compared++;
    for (const d of diffs) failures.push(d);
  }

  for (const g of [...graphNames].filter(wanted)) {
    let graph;
    try {
      graph = await readParquetGraph(dir, g);
    } catch (err) {
      failures.push(err.message);
      continue;
    }
    if (!args.reference) continue;
    const ref = loadReference(args.reference, g);
    if (ref == null) {
      skippedNoRef++;
      notes.push(`${g}: sem JSON de referência`);
      continue;
    }
    compared++;
    const d = firstDiff(graph, ref, g);
    if (d) failures.push(d);
  }

  console.log(
    `verify-data: ${tableNames.length} tabelas, ${graphNames.size} grafos, ${files.length} arquivos em ${dir}`,
  );
  if (args.reference) {
    console.log(`  comparados com a referência: ${compared}; sem referência: ${skippedNoRef}`);
    console.log(`  chaves ausentes no JSON e nulas no Parquet (equivalentes): ${absentVsNull}`);
    for (const n of notes) console.log(`  nota: ${n}`);
  }
  if (failures.length) {
    console.error(`FALHOU (${failures.length}):`);
    for (const f of failures) console.error(`  - ${f}`);
    process.exit(1);
  }
  console.log("OK");
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
}
