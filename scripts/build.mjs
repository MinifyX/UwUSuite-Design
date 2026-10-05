// Builds the package into dist/: JavaScript and type declarations from src/ (tsc), the CSS as is.
//
//   pnpm build

import { execFileSync } from "node:child_process";
import { cpSync, rmSync } from "node:fs";
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
console.log("built dist/");
