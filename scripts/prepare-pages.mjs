#!/usr/bin/env node
/**
 * After `PAGES_BUILD=1 npm run build`, package static output for GitHub Pages.
 * Copies nitro/github_pages (or static) assets into `pages-dist/`.
 */
import {
  cpSync,
  existsSync,
  mkdirSync,
  writeFileSync,
  readdirSync,
  rmSync,
  readFileSync,
  renameSync,
} from "node:fs";
import { join, basename } from "node:path";

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

function walkHtml(dir, acc = []) {
  for (const name of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, name.name);
    if (name.isDirectory()) walkHtml(p, acc);
    else if (name.name.endsWith(".html")) acc.push(p);
  }
  return acc;
}

const src = findSource();
if (!src) {
  console.error("[prepare-pages] No static build output found. Tried:", candidates);
  process.exit(1);
}

if (existsSync(out)) rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
cpSync(src, out, { recursive: true });

// Custom domain + disable Jekyll
writeFileSync(join(out, "CNAME"), "konyagoarsiv.org\n");
writeFileSync(join(out, ".nojekyll"), "");

// Fix CSS hash mismatch between prerendered HTML and emitted assets
const assetsDir = join(out, "assets");
if (existsSync(assetsDir)) {
  const cssFiles = readdirSync(assetsDir).filter((f) =>
    /^styles-.*\.css$/.test(f),
  );
  if (cssFiles.length === 1) {
    const actualCss = cssFiles[0];
    const htmlFiles = walkHtml(out);
    for (const file of htmlFiles) {
      let html = readFileSync(file, "utf8");
      const next = html.replace(
        /assets\/styles-[A-Za-z0-9_-]+\.css/g,
        `assets/${actualCss}`,
      );
      if (next !== html) writeFileSync(file, next);
    }
    console.log("[prepare-pages] CSS aligned to", actualCss);
  }
}

// SPA fallback: 404.html = index.html
const indexHtml = join(out, "index.html");
const spa404 = join(out, "404.html");
if (existsSync(indexHtml)) {
  cpSync(indexHtml, spa404);
}

console.log("[prepare-pages] Ready:", out, "from", src);
