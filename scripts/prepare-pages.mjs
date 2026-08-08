#!/usr/bin/env node
/**
 * After `PAGES_BUILD=1 npm run build`, package static output for GitHub Pages.
 * Copies nitro/github_pages (or static) assets into `pages-dist/`.
 */
import { cpSync, existsSync, mkdirSync, writeFileSync, readdirSync, rmSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const out = join(root, "pages-dist");

const candidates = [
  join(root, ".output", "public"),
  join(root, "dist"),
  join(root, ".vercel", "output", "static"),
];

function findSource() {
  for (const c of candidates) {
    if (existsSync(c) && readdirSync(c).length) return c;
  }
  return null;
}

const src = findSource();
if (!src) {
  console.error("[prepare-pages] No static build output found. Tried:", candidates);
  process.exit(1);
}

if (existsSync(out)) rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
cpSync(src, out, { recursive: true });

// Custom domain
writeFileSync(join(out, "CNAME"), "konyagoarsiv.org\n");
// Disable Jekyll
writeFileSync(join(out, ".nojekyll"), "");

// SPA fallback: 404.html = index.html (GitHub Pages)
const indexHtml = join(out, "index.html");
const spa404 = join(out, "404.html");
if (existsSync(indexHtml) && !existsSync(spa404)) {
  cpSync(indexHtml, spa404);
}

console.log("[prepare-pages] Ready:", out, "from", src);
