// Fails the build if any non-draft content still contains "[TBD".
// Draft items ("draft": true) are skipped; the site must also exclude them at render time.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const ROOT = "content";
const problems = [];

function walk(dir) {
  for (const name of readdirSync(dir)) {
    // Dot entries are never content (same rule as lib/content/index.ts).
    if (name.startsWith(".")) continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (extname(p) === ".json") checkJson(p);
    else if (extname(p) === ".md") checkMd(p);
  }
}

function scan(value, path, file) {
  if (value && typeof value === "object") {
    if (!Array.isArray(value) && value.draft === true) return;
    for (const [k, v] of Object.entries(value)) {
      if (k.startsWith("_")) continue;
      scan(v, `${path}.${k}`, file);
    }
  } else if (typeof value === "string" && value.includes("[TBD")) {
    problems.push(`${file} ${path}: ${value}`);
  }
}

function checkJson(file) {
  scan(JSON.parse(readFileSync(file, "utf8")), "$", file);
}

function checkMd(file) {
  const text = readFileSync(file, "utf8");
  if (/^draft:\s*true/m.test(text)) return;
  text.split("\n").forEach((line, i) => {
    if (line.includes("[TBD")) problems.push(`${file}:${i + 1}: ${line.trim()}`);
  });
}

walk(ROOT);

if (problems.length) {
  console.error(`\n✗ ${problems.length} unfinished item(s). Fill them in or mark the item "draft": true.\n`);
  for (const p of problems) console.error("  " + p);
  process.exit(1);
}
console.log("✓ No [TBD] markers in published content.");
