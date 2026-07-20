// Vite plugin: load Parquet data at build time as plain JS modules, so the
// rest of the app keeps importing data synchronously (SSG embed unchanged).
//
//   import rows from "../data/initiatives_canonical.parquet";  // -> array of objects
//   import graph from "graph:people_relationship_graph";        // -> node-link object
//
// Tables: nested object/list fields are stored as JSON strings by the ETL
// Parquet export and revived here. Graphs: reassembled from the sibling
// <name>.nodes.parquet + <name>.edges.parquet + <name>.meta.json.
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { parquetReadObjects } from "hyparquet";
import { compressors } from "hyparquet-compressors";

const DATA_DIR = join(dirname(fileURLToPath(import.meta.url)), "src", "data");
const GRAPH_PREFIX = "graph:";
const VIRTUAL_GRAPH = "\0graph:";

function asyncBufferFromFile(path) {
  const buf = readFileSync(path);
  return {
    byteLength: buf.byteLength,
    slice: (start, end) =>
      buf.buffer.slice(buf.byteOffset + start, buf.byteOffset + (end ?? buf.byteLength)),
  };
}

function reviveValue(v) {
  if (typeof v === "string" && (v[0] === "[" || v[0] === "{")) {
    try {
      return JSON.parse(v);
    } catch {
      return v;
    }
  }
  // hyparquet may return BigInt for integer columns; JSON-embed as Number.
  if (typeof v === "bigint") return Number(v);
  return v;
}

function reviveRows(rows) {
  return rows.map((row) => {
    const out = {};
    for (const k in row) out[k] = reviveValue(row[k]);
    return out;
  });
}

async function readTable(path) {
  const file = asyncBufferFromFile(path);
  const rows = await parquetReadObjects({ file, compressors });
  return reviveRows(rows);
}

export default function parquetPlugin() {
  return {
    name: "horizon-parquet",
    enforce: "pre",

    resolveId(id) {
      if (id.startsWith(GRAPH_PREFIX)) return VIRTUAL_GRAPH + id.slice(GRAPH_PREFIX.length);
      return null;
    },

    async load(id) {
      if (id.startsWith(VIRTUAL_GRAPH)) {
        const name = id.slice(VIRTUAL_GRAPH.length);
        const [nodes, edges] = await Promise.all([
          readTable(join(DATA_DIR, `${name}.nodes.parquet`)),
          readTable(join(DATA_DIR, `${name}.edges.parquet`)),
        ]);
        const meta = JSON.parse(readFileSync(join(DATA_DIR, `${name}.meta.json`), "utf8"));
        const assembled = {
          metadata: meta.metadata,
          graph_stats: meta.graph_stats,
          graph: { ...(meta.graph || {}), nodes, edges },
        };
        return `export default ${JSON.stringify(assembled)};`;
      }

      if (id.endsWith(".parquet")) {
        const rows = await readTable(id);
        return `export default ${JSON.stringify(rows)};`;
      }

      return null;
    },
  };
}
