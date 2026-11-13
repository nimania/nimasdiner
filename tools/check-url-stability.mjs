import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

// Compare the freshly built website with the built site from the preceding
// published revision. Existing public URLs are a compatibility contract.
const [beforeRoot, afterRoot] = process.argv.slice(2).map(p => p && path.resolve(p));
if (!beforeRoot || !afterRoot) {
  console.error("Usage: node tools/check-url-stability.mjs <before-site-dist> <after-site-dist>");
  process.exit(2);
}
for (const dir of [beforeRoot, afterRoot]) {
  assert.ok(fs.existsSync(dir) && fs.statSync(dir).isDirectory(), "Missing built site: " + dir);
}

function listHtml(dir, relative = "") {
  const paths = [];
  for (const entry of fs.readdirSync(path.join(dir, relative), { withFileTypes: true })) {
    const next = path.posix.join(relative, entry.name);
    if (entry.isDirectory()) paths.push(...listHtml(dir, next));
    else if (entry.isFile() && entry.name.endsWith(".html")) paths.push(next);
  }
  return paths;
}
const read = (root, rel) => fs.readFileSync(path.join(root, rel), "utf8");
const canon = html => {
  const tags = html.match(/<link\b[^>]*>/gi) || [];
  const tag = tags.find(t => /\brel\s*=\s*["']canonical["']/i.test(t));
  return tag?.match(/\bhref\s*=\s*["']([^"']+)["']/i)?.[1] || null;
};
const indexable = html => !/<meta\s+[^>]*name\s*=\s*["']robots["'][^>]*content\s*=\s*["'][^"']*\bnoindex\b/i.test(html)
  && !/<meta\s+[^>]*content\s*=\s*["'][^"']*\bnoindex\b[^"']*["'][^>]*name\s*=\s*["']robots["']/i.test(html);
const sitemapLocs = root => new Set([...read(root, "sitemap.xml").matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/g)].map(m => m[1].replaceAll("&amp;", "&")));

const oldPaths = listHtml(beforeRoot);
const newPaths = new Set(listHtml(afterRoot));
const oldLocs = sitemapLocs(beforeRoot);
const newLocs = sitemapLocs(afterRoot);
const problems = [];
for (const rel of oldPaths) {
  if (!newPaths.has(rel)) {
    problems.push("Removed or moved public page: /" + rel.replace(/index\.html$/, ""));
    continue;
  }
  const previous = read(beforeRoot, rel);
  const current = read(afterRoot, rel);
  const oldCanonical = canon(previous), newCanonical = canon(current);
  if (oldCanonical && oldCanonical !== newCanonical)
    problems.push("Changed canonical: /" + rel + " [" + oldCanonical + " => " + newCanonical + "]");
  if (indexable(previous) && !indexable(current))
    problems.push("New noindex on existing page: /" + rel);
}
for (const url of oldLocs) if (!newLocs.has(url))
  problems.push("Removed indexed sitemap URL: " + url);

const beforeRobots = read(beforeRoot, "robots.txt");
const afterRobots = read(afterRoot, "robots.txt");
if (beforeRobots !== afterRobots) {
  problems.push("robots.txt changed: review blocked paths and sitemap location before publishing");
}
if (problems.length) {
  console.error("URL STABILITY POLICY VIOLATION (" + problems.length + "):\n" + problems.map(p => "  - " + p).join("\n"));
  console.error("Preserve existing URLs and indexing; obtain explicit owner approval for any migration.");
  process.exit(1);
}
console.log("URL stability check passed: " + oldPaths.length + " existing HTML paths and " + oldLocs.size + " sitemap URLs preserved.");
