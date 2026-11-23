#!/usr/bin/env bash
# Prepares src/data from the ETL export packages (spec FR-006/FR-007/FR-008).
# Used by .github/workflows/sync-etl-data.yml and runnable locally:
#
#   scripts/sync-etl-data.sh <exports_parquet.zip> [exports_canonical.zip]
#
# Steps:
#  1. overlay the Parquet package on src/data (never wipes the folder, so files
#     that only exist in the site stay: provenance, summaries, group graphs...);
#  2. remove the JSON of every dataset the package now ships as Parquet, so the
#     old oversized JSONs never come back;
#  3. from the canonical package (optional), copy only the files the Parquet
#     package does not cover (today: research_group_relationship_graphs/ and
#     project_sigpesq_files_json/);
#  4. sanitize JSON (NaN/Infinity -> null), normalize names in Parquet and in
#     the remaining JSON, and verify the layout (no file >= 100 MiB, sidecars,
#     graph parts, every Parquet readable).
#
# Needs Node >= 22.15 (zstd in node:zlib) and `npm ci` done. Run from the repo root.
set -euo pipefail

parquet_zip="${1:?uso: scripts/sync-etl-data.sh <exports_parquet.zip> [exports_canonical.zip]}"
canonical_zip="${2:-}"
data_dir="${DATA_DIR:-src/data}" # override to dry-run on a copy

work="$(mktemp -d)"
trap 'rm -rf "$work"' EXIT

# Unpacks a zip into a directory; a zip that only wraps other zips (bundle
# inside the package) is unpacked one level further.
unpack() {
  local zip="$1" dest="$2" tmp
  tmp="$(mktemp -d -p "$work")"
  unzip -q -o "$zip" -d "$tmp"
  find "$tmp" -name '.DS_Store' -delete
  find "$tmp" -type d -name '__MACOSX' -prune -exec rm -rf {} +
  mkdir -p "$dest"
  if [[ -z "$(find "$tmp" -type f ! -name '*.zip' -print -quit)" ]] && ls "$tmp"/*.zip >/dev/null 2>&1; then
    for bundle in "$tmp"/*.zip; do unzip -q -o "$bundle" -d "$dest"; done
  else
    cp -R "$tmp"/. "$dest"/
  fi
}

pq="$work/parquet"
unpack "$parquet_zip" "$pq"
n_parquet="$(find "$pq" -maxdepth 1 -name '*.parquet' | wc -l)"
if [[ "$n_parquet" -eq 0 ]]; then
  echo "ERRO: $parquet_zip não contém arquivos .parquet" >&2
  exit 1
fi
echo "Pacote Parquet: $n_parquet arquivos .parquet"

# 1. overlay
mkdir -p "$data_dir"
cp -R "$pq"/. "$data_dir"/

# 2. JSON superseded by Parquet
removed=0
for f in "$pq"/*.parquet; do
  base="$(basename "$f" .parquet)"
  base="${base%.nodes}"
  base="${base%.edges}"
  if [[ -f "$data_dir/$base.json" ]]; then
    rm -f "$data_dir/$base.json"
    removed=$((removed + 1))
  fi
done
echo "JSON substituídos por Parquet e removidos: $removed"

# 3. canonical-only files
if [[ -n "$canonical_zip" && -f "$canonical_zip" ]]; then
  canon="$work/canonical"
  unpack "$canonical_zip" "$canon"
  copied=0
  while IFS= read -r -d '' file; do
    rel="${file#"$canon"/}"
    base="${rel%.json}"
    if [[ -e "$pq/$rel" || -e "$pq/$base.parquet" || -e "$pq/$base.nodes.parquet" ]]; then
      continue
    fi
    mkdir -p "$data_dir/$(dirname "$rel")"
    cp "$file" "$data_dir/$rel"
    copied=$((copied + 1))
  done < <(find "$canon" -type f -name '*.json' -print0)
  echo "Arquivos só do pacote canônico copiados: $copied"
else
  echo "Aviso: sem pacote canônico; grafos por grupo e arquivos de projetos ficam como estão."
fi

# Bundle leftovers are not site data.
rm -f "$data_dir/exports_canonical.zip" "$data_dir/exports_parquet.zip"

# 4. sanitize, normalize, verify
node scripts/sanitize-json.mjs "$data_dir"
node --max-old-space-size=8192 scripts/normalize-parquet.mjs --dir "$data_dir"
node scripts/normalize-names.mjs --dir "$data_dir"
node --max-old-space-size=8192 scripts/verify-data.mjs --dir "$data_dir"
