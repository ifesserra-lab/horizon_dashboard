#!/usr/bin/env node
/**
 * Applies the name normalization of scripts/normalize-names.mjs to the
 * Parquet package in src/data (spec FR-008, research D5).
 *
 * For every <name>.parquet (tables and graph nodes/edges):
 *  - plain string columns: normalizeValue(column, value);
 *  - JSON columns listed in the <name>.cols.json sidecar: the JSON text is
 *    normalized key by key (normalizeJsonColumnText), preserving every other
 *    byte, exactly as normalize-names.mjs does with the JSON export.
 * Datasets in EXCLUDE_DATASETS (audit/tracking/ETL metadata) are skipped.
 *
 * A file is rewritten only when some value changed, with the original schema,
 * key/value metadata and ZSTD compression (node:zlib, Node >= 22.15). Running
 * it twice is a no-op.
 *
 * Usage (from the repo root):
 *   node scripts/normalize-parquet.mjs                 # src/data
 *   node scripts/normalize-parquet.mjs --dir <dir> [--dry-run]
 */
import { readdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { zstdCompressSync } from "node:zlib";
import { parquetMetadata, parquetReadObjects } from "hyparquet";
import { compressors as decompressors } from "hyparquet-compressors";
import { parquetWriteBuffer } from "hyparquet-writer";
import {
  EXCLUDE_DATASETS,
  normalizeValue,
  normalizeJsonColumnText,
} from "./normalize-names.mjs";

if (typeof zstdCompressSync !== "function") {
  throw new Error("normalize-parquet: node:zlib sem zstd; use Node >= 22.15");
}

function toArrayBuffer(buf) {
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
}

/** Reads a Parquet file as raw columns (BigInt and JSON text left as stored). */
export async function readRawParquet(path) {
  const file = toArrayBuffer(readFileSync(path));
  const metadata = parquetMetadata(file);
  const rows = await parquetReadObjects({ file, metadata, compressors: decompressors });
  const names = metadata.schema.slice(1).map((s) => s.name);
  const columns = names.map((name) => ({ name, data: rows.map((r) => r[name]) }));
  return { metadata, columns, numRows: rows.length };
}

/** Writes raw columns back with the original schema and ZSTD compression. */
export function writeRawParquet(path, { metadata, columns }) {
  const buffer = parquetWriteBuffer({
    columnData: columns,
    schema: metadata.schema,
    codec: "ZSTD",
    compressors: { ZSTD: (bytes) => new Uint8Array(zstdCompressSync(bytes)) },
    kvMetadata: metadata.key_value_metadata,
    rowGroupSize: Math.max(1, Number(metadata.num_rows)),
  });
  writeFileSync(path, new Uint8Array(buffer));
}

function jsonColumnsOf(parquetPath) {
  const sidecar = parquetPath.replace(/\.parquet$/, ".cols.json");
  if (!existsSync(sidecar)) throw new Error(`normalize-parquet: sidecar ausente ${sidecar}`);
  return new Set(JSON.parse(readFileSync(sidecar, "utf8")).json_columns || []);
}

/** Dataset name of a file: graph parts belong to their graph. */
export function datasetOf(fileName) {
  return fileName.replace(/\.parquet$/, "").replace(/\.(nodes|edges)$/, "");
}

/**
 * Normalizes the columns in place. Returns how many values changed.
 * @param {{name: string, data: unknown[]}[]} columns
 * @param {Set<string>} jsonColumns
 */
export function normalizeColumns(columns, jsonColumns) {
  let changed = 0;
  for (const col of columns) {
    const isJson = jsonColumns.has(col.name);
    const data = col.data;
    for (let i = 0; i < data.length; i++) {
      const v = data[i];
      if (typeof v !== "string") continue;
      const next = isJson ? normalizeJsonColumnText(col.name, v) : normalizeValue(col.name, v);
      if (next !== v) {
        data[i] = next;
        changed++;
      }
    }
  }
  return changed;
}

/** Normalizes one file; rewrites it only when something changed. */
export async function normalizeParquetFile(path, { dryRun = false } = {}) {
  const raw = await readRawParquet(path);
  const changed = normalizeColumns(raw.columns, jsonColumnsOf(path));
  if (changed && !dryRun) writeRawParquet(path, raw);
  return changed;
}

async function main() {
  const argv = process.argv.slice(2);
  let dir = "src/data";
  let dryRun = false;
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--dir") dir = argv[++i];
    else if (argv[i] === "--dry-run") dryRun = true;
    else throw new Error(`argumento desconhecido: ${argv[i]}`);
  }

  const files = readdirSync(dir).filter((f) => f.endsWith(".parquet")).sort();
  let scanned = 0;
  let skipped = 0;
  let changedFiles = 0;
  let changedValues = 0;
  for (const f of files) {
    if (EXCLUDE_DATASETS.has(datasetOf(f))) {
      skipped++;
      continue;
    }
    scanned++;
    const n = await normalizeParquetFile(join(dir, f), { dryRun });
    if (n) {
      changedFiles++;
      changedValues += n;
      console.log(`  ${relative(process.cwd(), join(dir, f))}: ${n} valores`);
    }
  }
  console.log(`Parquet analisados: ${scanned} (excluídos: ${skipped})`);
  console.log(`Arquivos ${dryRun ? "que mudariam" : "alterados"}: ${changedFiles}; valores: ${changedValues}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
}
