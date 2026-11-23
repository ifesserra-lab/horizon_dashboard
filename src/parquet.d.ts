// Data is loaded at build time by the Vite plugin in parquet-plugin.mjs.
// Tables come from ``*.parquet`` (array of row objects); node-link graphs come
// from the virtual ``graph:<name>`` id (assembled from the sibling
// <name>.nodes.parquet + <name>.edges.parquet + <name>.meta.json).
declare module "*.parquet" {
	const rows: any[];
	export default rows;
}

declare module "graph:*" {
	const graph: any;
	export default graph;
}
