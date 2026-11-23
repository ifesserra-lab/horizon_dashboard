#!/usr/bin/env bash
# Runs the site build and records the metrics of
# specs/001-parquet-data-build/contracts/build-metrics-contract.md.
#
# Usage (repo root):  scripts/build-metrics.sh [output-file]
#   output-file  default: build-metrics.txt (key=value lines; also printed)
#
# Extra environment:
#   BUILD_CMD   command to run (default: npm run build)
#   DIST_DIR    build output (default: dist)
set -uo pipefail

OUT="${1:-build-metrics.txt}"
BUILD_CMD="${BUILD_CMD:-npm run build}"
DIST_DIR="${DIST_DIR:-dist}"
TIME_LOG="$(mktemp)"
trap 'rm -f "$TIME_LOG"' EXIT

if [ ! -x /usr/bin/time ]; then
  echo "build-metrics: /usr/bin/time (GNU time) nao encontrado" >&2
  exit 2
fi

/usr/bin/time -v -o "$TIME_LOG" bash -c "$BUILD_CMD"
BUILD_STATUS=$?

wall_to_seconds() {
  # h:mm:ss or m:ss(.cc) -> integer seconds
  awk -F: '{ if (NF==3) s=$1*3600+$2*60+$3; else s=$1*60+$2; printf "%d", s+0.5 }' <<<"$1"
}

WALL_RAW="$(sed -n 's/.*Elapsed (wall clock) time (h:mm:ss or m:ss): //p' "$TIME_LOG")"
MAX_RSS_KB="$(sed -n 's/.*Maximum resident set size (kbytes): //p' "$TIME_LOG")"

HTML_PAGES=0; DIST_BYTES=0; GZIP_BYTES=0; LARGEST=0
if [ -d "$DIST_DIR" ]; then
  HTML_PAGES="$(find "$DIST_DIR" -name '*.html' | wc -l)"
  DIST_BYTES="$(du -sb "$DIST_DIR" | cut -f1)"
  LARGEST="$(find "$DIST_DIR" -name '*.html' -printf '%s\n' | sort -n | tail -1)"
  GZIP_BYTES="$(find "$DIST_DIR" -type f -print0 \
    | xargs -0 -P "$(nproc)" -n 200 sh -c 'for f; do gzip -1 -c "$f" | wc -c; done' _ \
    | awk '{s+=$1} END {print s+0}')"
fi

{
  echo "build_status=$BUILD_STATUS"
  echo "wall_seconds=$(wall_to_seconds "${WALL_RAW:-0:00}")"
  echo "max_rss_kb=${MAX_RSS_KB:-0}"
  echo "html_pages=$HTML_PAGES"
  echo "dist_bytes=$DIST_BYTES"
  echo "dist_gzip_bytes=$GZIP_BYTES"
  echo "largest_html_bytes=${LARGEST:-0}"
} | tee "$OUT"

exit "$BUILD_STATUS"
