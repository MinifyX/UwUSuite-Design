// Tags a release; the release workflow (.github/workflows/release.yml) builds, packs and publishes
// it to GitHub Releases with the tarball the apps install.
//
//   pnpm release

import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const run = (cmd, args) => execFileSync(cmd, args, { cwd: root, stdio: "inherit" });
const out = (cmd, args) => execFileSync(cmd, args, { cwd: root, encoding: "utf8" }).trim();

const { version } = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
const changelog = readFileSync(join(root, "CHANGELOG.md"), "utf8");
if (!changelog.includes(`\n## ${version}\n`)) throw new Error(`CHANGELOG.md has no "## ${version}" section`);
if (out("git", ["status", "--porcelain"])) throw new Error("the working tree is not clean");
if (out("git", ["rev-parse", "--abbrev-ref", "HEAD"]) !== "main") throw new Error("release from main");
if (out("git", ["tag", "--list", `v${version}`])) throw new Error(`v${version} exists already`);

for (const script of ["lint", "typecheck", "test", "build"]) run("pnpm", ["run", script]);
run("cargo", ["clippy", "--workspace", "--all-targets", "--locked", "--", "-D", "warnings"]);
run("cargo", ["test", "--workspace", "--locked"]);
run("git", ["tag", "-a", `v${version}`, "-m", `UwUSuite Design ${version}`]);
run("git", ["push", "origin", "main", `v${version}`]);
console.log(`tagged v${version}; the release workflow publishes uwusuite-design-${version}.tgz`);
