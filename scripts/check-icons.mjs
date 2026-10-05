// Checks the suite's own icons against the rules in docs/icons.md:
// 24 × 24 grid with 2 px padding (everything inside 1…23), only stroke elements Lucide uses, no
// fill, no stroke settings of their own (those come from <Icon>), no text, unique keys.
//
//   node scripts/check-icons.mjs

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const source = readFileSync(join(root, "src/icons/suite.ts"), "utf8");
const block = source.slice(source.indexOf("SUITE_ICON_NODES = {"), source.indexOf("} satisfies"));

const ALLOWED = new Set(["path", "circle", "ellipse", "rect", "line", "polyline"]);
const FORBIDDEN_ATTRS = ["fill", "stroke", "stroke-width", "strokeWidth", "style", "transform"];
const problems = [];

const icons = [...block.matchAll(/^ {2}"?([\w-]+)"?: \[\n([\s\S]*?)^ {2}\],/gm)];
if (icons.length === 0) problems.push("no icons found in src/icons/suite.ts");

for (const [, name, body] of icons) {
  const keys = new Set();
  for (const [, element, attrs] of body.matchAll(/\["(\w+)", \{([^}]*)\}\]/g)) {
    if (!ALLOWED.has(element)) problems.push(`${name}: <${element}> is not a Lucide element`);
    for (const attr of FORBIDDEN_ATTRS)
      if (new RegExp(`(^|[\\s,])"?${attr}"?:`).test(attrs)) problems.push(`${name}: sets ${attr} itself`);
    const key = /key: "([^"]+)"/.exec(attrs)?.[1];
    if (!key) problems.push(`${name}: <${element}> has no key`);
    else if (keys.has(key)) problems.push(`${name}: key "${key}" twice`);
    else keys.add(key);
    const numbers = [];
    for (const [, value] of attrs.matchAll(/(?:cx|cy|x|y|x1|x2|y1|y2): "([-\d.]+)"/g)) numbers.push(Number(value));
    const d = /d: "([^"]+)"/.exec(attrs)?.[1];
    if (d) {
      // Absolute commands only carry coordinates we can check without a full path parser.
      for (const [, command, args] of d.matchAll(/([MLHVCSQTA])([^MLHVCSQTAZmlhvcsqtaz]*)/g)) {
        const values = args
          .trim()
          .split(/[\s,]+/)
          .filter(Boolean)
          .map(Number);
        if (command === "A") numbers.push(values[5], values[6]);
        else numbers.push(...values);
      }
    }
    for (const value of numbers)
      if (Number.isFinite(value) && (value < 1 || value > 23))
        problems.push(`${name}: ${value} lies outside the 1…23 live area`);
  }
}

if (problems.length) {
  console.error(problems.map((problem) => `✗ ${problem}`).join("\n"));
  process.exit(1);
}
console.log(`✓ ${icons.length} suite icons follow the icon rules`);
