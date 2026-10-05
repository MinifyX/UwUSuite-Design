// Builds the styleguide and puts it into the website, which serves it at /design/:
//
//   node scripts/publish-styleguide.mjs ../UwUSuite-Website
//
// Then build and deploy the website as usual (its scripts/deploy.sh).

import { execFileSync } from "node:child_process";
import { cpSync, existsSync, rmSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const website = resolve(process.argv[2] ?? join(root, "../UwUSuite-Website"));
if (!existsSync(join(website, "scripts/build.mjs"))) throw new Error(`${website} is not the UwUSuite website`);

execFileSync("pnpm", ["run", "build:styleguide"], { cwd: root, stdio: "inherit" });
const target = join(website, "src/design");
rmSync(target, { recursive: true, force: true });
cpSync(join(root, "dist-styleguide"), target, { recursive: true });
console.log(`styleguide copied to ${target}`);
