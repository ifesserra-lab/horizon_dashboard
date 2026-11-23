// Vite plugin: load Parquet data at build time as plain JS modules, so the
// rest of the app keeps importing data synchronously (SSG embed unchanged).
//
//   import rows from "../data/initiatives_canonical.parquet";           // -> array of objects
//   import rows from "../data/researchers_canonical.parquet?columns=id,name"; // -> only those columns
//   import graph from "graph:people_relationship_graph";                 // -> node-link object
//   import url from "../data/initiatives_canonical.parquet?url";         // -> left to Vite (asset URL)
//
// Tables: nested object/list fields are stored as JSON strings by the ETL
// Parquet export; the <name>.cols.json sidecar ({"json_columns": [...]}) lists
// exactly which columns to revive. The sidecar is REQUIRED (no heuristics).
// Graphs: reassembled from <name>.nodes.parquet + <name>.edges.parquet +
// <name>.meta.json.
//
// Every data problem (missing/empty/corrupt file, missing sidecar, unknown
// column, invalid JSON in a JSON column) fails the build with a message that
// names the offending file (spec FR-010).
//
// The reader functions are exported so scripts (verify-data, normalize) share
// exactly the same decoding as the build.
import { join } from "node:path";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import {
  readParquetTable,
  readParquetGraph,
  readParquetSummary,
} from "./src/lib/parquet-reader.mjs";

// The plugin lives at the repo root, so the data directory is resolved from it
// (not from the process cwd).
export const DATA_DIR = join(dirname(fileURLToPath(import.meta.url)), "src", "data");
const GRAPH_PREFIX = "graph:";
const VIRTUAL_GRAPH = "\0graph:";

export { readParquetTable, readParquetGraph, readParquetSummary };

// Emit the data as `JSON.parse("...")` instead of a raw object literal. A huge
// literal makes V8/Rollup build a massive AST (multiple GB for large tables),
// while JSON.parse keeps the parsed code tiny and defers object construction
// to runtime. Mirrors Vite's own handling of large JSON files.
function embedJson(value) {
  const json = JSON.stringify(value);
  return `export default /* #__PURE__ */ JSON.parse(${JSON.stringify(json)});`;
}

function splitId(id) {
  const q = id.indexOf("?");
  if (q === -1) return { path: id, params: new URLSearchParams() };
  return { path: id.slice(0, q), params: new URLSearchParams(id.slice(q + 1)) };
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
        for (const part of [`${name}.nodes.parquet`, `${name}.edges.parquet`, `${name}.meta.json`]) {
          this.addWatchFile(join(DATA_DIR, part));
        }
        return embedJson(await readParquetGraph(DATA_DIR, name));
      }

      const { path, params } = splitId(id);
      if (!path.endsWith(".parquet")) return null;
      // ?url / ?raw / ?inline are asset imports, left to Vite.
      if (params.has("url") || params.has("raw") || params.has("inline")) return null;

      const columns = params.get("columns")
        ? params.get("columns").split(",").map((c) => c.trim()).filter(Boolean)
        : undefined;
      this.addWatchFile(path);
      return embedJson(await readParquetTable(path, { columns }));
    },
  };
}
