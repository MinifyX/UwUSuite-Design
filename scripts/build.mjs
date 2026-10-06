// Builds the package into dist/: JavaScript and type declarations from src/ (tsc), the CSS as is.
//
//   pnpm build

import { execFileSync } from "node:child_process";
import { cpSync, readFileSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");

rmSync(dist, { recursive: true, force: true });
execFileSync(
  process.execPath,
  [join(root, "node_modules/typescript/bin/tsc"), "-p", join(root, "tsconfig.build.json")],
  {
    stdio: "inherit",
  },
);
cpSync(join(root, "src/css"), join(dist, "css"), { recursive: true });

// Every entry point has to load in plain Node, not only through a bundler: apps run their tests
// in vitest/Node against this package.
const { exports } = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
for (const [name, target] of Object.entries(exports)) {
  if (typeof target !== "object") continue;
  execFileSync(
    process.execPath,
    ["--input-type=module", "-e", `await import(${JSON.stringify(join(root, target.default))})`],
    {
      cwd: root,
      stdio: "inherit",
    },
  );
  console.log(`node loads ${name}`);
}
console.log("built dist/");
