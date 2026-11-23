#!/usr/bin/env node
/**
 * Compares two build outputs (spec FR-002 / SC-006): the same set of HTML pages
 * and identical content for a sample of pages (or all with --all).
 *
 * Usage (repo root):
 *   node scripts/compare-dist.mjs <dist-a> <dist-b> [--sample 100] [--all] [--ignore <prefix>]... [--only <prefix>]...
 *
 * --ignore skips pages whose path starts with the prefix (e.g. download/, a page
 * that changes on purpose); --only restricts the comparison to those prefixes.
 *
 * The sample is deterministic: pages are grouped by their first path segment
 * (researchers, students, projects, ...) and picked at an even stride, so each
 * route type is represented. Exit code 1 on any difference.
 */
import { createHash } from "node:crypto";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

function parseArgs(argv) {
  const args = { dirs: [], sample: 100, all: false, ignore: [], only: [] };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--sample") args.sample = Number(argv[++i]);
    else if (a === "--all") args.all = true;
    else if (a === "--ignore") args.ignore.push(argv[++i]);
    else if (a === "--only") args.only.push(argv[++i]);
    else args.dirs.push(a);
  }
  if (args.dirs.length !== 2) {
    console.error("uso: compare-dist.mjs <dist-a> <dist-b> [--sample N] [--all]");
    process.exit(2);
  }
  return args;
}

function htmlPages(root) {
  const out = [];
  const stack = [root];
  while (stack.length) {
    const dir = stack.pop();
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, e.name);
      if (e.isDirectory()) stack.push(full);
      else if (e.name.endsWith(".html")) out.push(relative(root, full));
    }
  }
  return out.sort();
}

// Asset file names carry a content hash (/_astro/_id_.Cwr3wzYR.css). The hash
// changes whenever the module graph changes, even when the page content does
// not, so it is masked before comparing.
const ASSET_HASH = /(\/_astro\/[^"'\s>]*?)\.[A-Za-z0-9_-]{8}\.(css|js|json|parquet)/g;
// Ids generated at random on every build (chart titles/descriptions).
const RANDOM_ID = /\b([a-z]+-(?:title|desc)-)[a-z0-9]{5,8}\b/g;
const read = (file) =>
  readFileSync(file, "utf8").replace(ASSET_HASH, "$1.HASH.$2").replace(RANDOM_ID, "$1ID");
const hash = (file) => createHash("sha256").update(read(file)).digest("hex");

function firstDifference(a, b) {
  const x = read(a);
  const y = read(b);
  const n = Math.min(x.length, y.length);
  let i = 0;
  while (i < n && x[i] === y[i]) i++;
  const ctx = (s) => JSON.stringify(s.slice(Math.max(0, i - 40), i + 60));
  return `offset ${i} (tamanhos ${x.length} vs ${y.length})\n      A: ${ctx(x)}\n      B: ${ctx(y)}`;
}

function pickSample(pages, total) {
  const groups = new Map();
  for (const p of pages) {
    const seg = p.split("/")[0];
    if (!groups.has(seg)) groups.set(seg, []);
    groups.get(seg).push(p);
  }
  const perGroup = Math.max(1, Math.floor(total / groups.size));
  const chosen = [];
  for (const list of groups.values()) {
    const stride = Math.max(1, Math.floor(list.length / perGroup));
    for (let i = 0; i < list.length && chosen.length < total * 2; i += stride) {
      if (chosen.filter((c) => c.startsWith(list[0].split("/")[0] + "/")).length >= perGroup) break;
      chosen.push(list[i]);
    }
  }
  return chosen;
}

const args = parseArgs(process.argv);
const [a, b] = args.dirs;
for (const d of [a, b]) {
  if (!statSync(d, { throwIfNoEntry: false })?.isDirectory()) {
    console.error(`pasta inexistente: ${d}`);
    process.exit(2);
  }
}

const skip = (p) =>
  args.ignore.some((prefix) => p.startsWith(prefix)) ||
  (args.only.length > 0 && !args.only.some((prefix) => p.startsWith(prefix)));
const pagesA = htmlPages(a).filter((p) => !skip(p));
const pagesB = htmlPages(b).filter((p) => !skip(p));
const failures = [];

const setB = new Set(pagesB);
const setA = new Set(pagesA);
const onlyA = pagesA.filter((p) => !setB.has(p));
const onlyB = pagesB.filter((p) => !setA.has(p));
if (onlyA.length || onlyB.length) {
  failures.push(`conjuntos de páginas diferentes: ${onlyA.length} só em A, ${onlyB.length} só em B`);
  for (const p of onlyA.slice(0, 5)) failures.push(`  só em A: ${p}`);
  for (const p of onlyB.slice(0, 5)) failures.push(`  só em B: ${p}`);
}

const common = pagesA.filter((p) => setB.has(p));
const toCompare = args.all ? common : pickSample(common, args.sample);
// Parquet columns come back in the column order of the export, so a record can
// serialise its keys in a different order than the JSON did. Same characters in
// a different order is reported as "reordered" and is not a content difference
// (the data itself is compared key-order-insensitively by verify-data.mjs).
const charHistogram = (file) => {
  const counts = new Map();
  for (const ch of read(file)) counts.set(ch, (counts.get(ch) ?? 0) + 1);
  return counts;
};
const sameCharacters = (fa, fb) => {
  const ca = charHistogram(fa);
  const cb = charHistogram(fb);
  if (ca.size !== cb.size) return false;
  for (const [ch, n] of ca) if (cb.get(ch) !== n) return false;
  return true;
};
let different = 0;
let reordered = 0;
for (const p of toCompare) {
  if (hash(join(a, p)) !== hash(join(b, p))) {
    if (sameCharacters(join(a, p), join(b, p))) {
      reordered++;
      continue;
    }
    different++;
    if (different <= 5) failures.push(`${p}: conteúdo diferente, primeira diferença em ${firstDifference(join(a, p), join(b, p))}`);
  }
}

console.log(
  `compare-dist: A=${pagesA.length} páginas, B=${pagesB.length} páginas, comparadas ${toCompare.length}${args.all ? " (todas)" : " (amostra)"}, idênticas ${toCompare.length - different - reordered}, só ordem de chaves ${reordered}, diferentes ${different}`,
);
if (failures.length) {
  console.error(`FALHOU:\n${failures.map((f) => `  - ${f}`).join("\n")}`);
  process.exit(1);
}
console.log("OK");
