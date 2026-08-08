#!/bin/sh
set -eu
cd "$(dirname "$0")/.."
export PAGES_BUILD=1
# Prerender fills `.output/public` even if the final nitro step flops on SPA + github_pages.
set +e
npx vite build
code=$?
set -e
if [ ! -f .output/public/index.html ]; then
  echo "build-pages: missing .output/public/index.html (exit $code)"
  exit 1
fi
node scripts/prepare-pages.mjs
echo "build-pages: OK"
