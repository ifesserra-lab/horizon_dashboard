// Shared Parquet decoding for the build plugin, the data scripts and the
// /download page. Every data problem fails with a message that names the file
// (spec FR-010). See parquet-plugin.mjs for the import contract.
import { existsSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { parquetReadObjects, parquetMetadata } from "hyparquet";
import { compressors } from "hyparquet-compressors";

export const DATA_DIR = join(process.cwd(), "src", "data");

function fail(path, message) {
  throw new Error(`[parquet-plugin] ${path}: ${message}`);
}

function readBytes(path) {
  if (!existsSync(path)) fail(path, "arquivo ausente");
  if (statSync(path).size === 0) fail(path, "arquivo vazio");
  return readFileSync(path);
}

function toArrayBuffer(buf) {
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
}

function normalizeScalar(v) {
  // hyparquet returns BigInt for integer columns; JSON-embed as Number.
  return typeof v === "bigint" ? Number(v) : v;
}

function parseJsonColumn(v, path, column, rowIndex) {
  if (typeof v !== "string") return normalizeScalar(v);
  try {
    return JSON.parse(v);
  } catch (err) {
    fail(path, `coluna JSON "${column}" inválida na linha ${rowIndex}: ${err.message}`);
  }
}

function reviveRow(row, jsonCols, path, rowIndex) {
  const out = {};
  for (const k in row) {
    out[k] = jsonCols.has(k)
      ? parseJsonColumn(row[k], path, k, rowIndex)
      : normalizeScalar(row[k]);
  }
  return out;
}

function loadSidecarColumns(parquetPath) {
  const sidecar = parquetPath.replace(/\.parquet$/, ".cols.json");
  if (!existsSync(sidecar)) fail(parquetPath, `sidecar ausente (${sidecar})`);
  try {
    const parsed = JSON.parse(readBytes(sidecar).toString("utf8"));
    return new Set(parsed.json_columns || []);
  } catch (err) {
    if (String(err.message).startsWith("[parquet-plugin]")) throw err;
    return fail(sidecar, `sidecar inválido: ${err.message}`);
  }
}

/**
 * Reads one Parquet table into an array of plain objects.
 * @param {string} path absolute path to the .parquet file
 * @param {{columns?: string[], limit?: number}} [options] restrict to these
 * columns and/or read only the first `limit` rows
 */
export async function readParquetTable(path, { columns, limit } = {}) {
  const buf = readBytes(path);
  const arrayBuffer = toArrayBuffer(buf);

  let metadata;
  try {
    metadata = parquetMetadata(arrayBuffer);
  } catch (err) {
    fail(path, `arquivo Parquet corrompido: ${err.message}`);
  }

  if (columns && columns.length) {
    const known = new Set(metadata.schema.slice(1).map((s) => s.name));
    const unknown = columns.filter((c) => !known.has(c));
    if (unknown.length) fail(path, `coluna(s) inexistente(s): ${unknown.join(", ")}`);
  }

  const jsonCols = loadSidecarColumns(path);
  const file = {
    byteLength: arrayBuffer.byteLength,
    slice: (start, end) => arrayBuffer.slice(start, end ?? arrayBuffer.byteLength),
  };

  let rows;
  try {
    rows = await parquetReadObjects({
      file,
      compressors,
      ...(columns && columns.length ? { columns } : {}),
      ...(limit ? { rowStart: 0, rowEnd: limit } : {}),
    });
  } catch (err) {
    fail(path, `falha ao ler o Parquet: ${err.message}`);
  }
  return rows.map((row, i) => reviveRow(row, jsonCols, path, i));
}

/**
 * Reads a graph exported as <name>.nodes.parquet + <name>.edges.parquet +
 * <name>.meta.json and reassembles the node-link object.
 */
export async function readParquetGraph(dataDir, name) {
  const metaPath = join(dataDir, `${name}.meta.json`);
  const [nodes, edges] = await Promise.all([
    readParquetTable(join(dataDir, `${name}.nodes.parquet`)),
    readParquetTable(join(dataDir, `${name}.edges.parquet`)),
  ]);
  let meta;
  try {
    meta = JSON.parse(readBytes(metaPath).toString("utf8"));
  } catch (err) {
    if (String(err.message).startsWith("[parquet-plugin]")) throw err;
    fail(metaPath, `meta inválido: ${err.message}`);
  }
  return {
    metadata: meta.metadata,
    graph_stats: meta.graph_stats,
    graph: { ...(meta.graph || {}), nodes, edges },
  };
}


/**
 * Cheap description of a table for catalog pages: row count, column names,
 * size on disk and the first row(s), without decoding the whole file.
 */
export async function readParquetSummary(path, { sampleRows = 1 } = {}) {
  const buf = readBytes(path);
  const arrayBuffer = toArrayBuffer(buf);
  let metadata;
  try {
    metadata = parquetMetadata(arrayBuffer);
  } catch (err) {
    fail(path, `arquivo Parquet corrompido: ${err.message}`);
  }
  return {
    rows: Number(metadata.num_rows),
    columns: metadata.schema.slice(1).map((s) => s.name),
    sizeBytes: buf.byteLength,
    sample: sampleRows > 0 ? await readParquetTable(path, { limit: sampleRows }) : [],
  };
}
