#!/usr/bin/env node
// The suite's app icon tool (docs/app-icons.md). Run it in a Tauri app (it needs @tauri-apps/cli):
//
//   uwu-icons --brand ../../brand --name uwumirror [--out src-tauri/icons] [--tray] [--mobile]
//
// From the three brand SVGs every app has:
//
//   <name>-app-icon.svg            Nyu on the pastel tile → icon.icns (macOS Dock), Square*/StoreLogo
//                                  (Windows Store), and with --mobile Android and iOS icons
//   <name>-taskbar-icon.svg        Nyu alone, upright, no tile → icon.ico, icon.png and the desktop
//                                  PNGs (Windows taskbar, window, Linux menus)
//   <name>-taskbar-icon-small.svg  the simplified cut → the 16 and 24 px ICO frames and, with
//                                  --tray, tray.png (32 px)
//
// Missing small or taskbar files fall back to the next bigger one, with a warning.

import { execFileSync } from "node:child_process";
import { copyFileSync, cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { parseArgs } from "node:util";
import { readIco, writeIco } from "./ico.mjs";

const { values: args } = parseArgs({
  options: {
    brand: { type: "string", default: "brand" },
    name: { type: "string" },
    out: { type: "string", default: "src-tauri/icons" },
    tray: { type: "boolean", default: false },
    mobile: { type: "boolean", default: false },
    help: { type: "boolean", short: "h", default: false },
  },
});

if (args.help || !args.name) {
  console.log(
    "usage: uwu-icons --name <app> [--brand <dir>] [--out <dir>] [--tray] [--mobile]\n" +
      "  e.g. uwu-icons --brand ../../brand --name uwumail --tray",
  );
  process.exit(args.help ? 0 : 1);
}

const brand = resolve(args.brand);
const out = resolve(args.out);
const TILE_FILES = [
  "icon.icns",
  "StoreLogo.png",
  ...[30, 44, 71, 89, 107, 142, 150, 284, 310].map((n) => `Square${n}x${n}Logo.png`),
];
const DESKTOP_FILES = ["icon.ico", "icon.png", "32x32.png", "64x64.png", "128x128.png", "128x128@2x.png"];
/** ICO sizes drawn from the small cut. */
const SMALL = new Set([16, 24]);

function source(kind, fallback) {
  const file = join(brand, `${args.name}-${kind}.svg`);
  if (existsSync(file)) return file;
  if (!fallback) throw new Error(`missing ${file}`);
  console.warn(`! ${args.name}-${kind}.svg is missing, using ${fallback.split(/[\\/]/).pop()}`);
  return fallback;
}

function render(svg) {
  const dir = mkdtempSync(join(tmpdir(), "uwu-icons-"));
  execFileSync("pnpm", ["tauri", "icon", svg, "-o", dir], { stdio: "ignore", shell: process.platform === "win32" });
  return dir;
}

const appSvg = source("app-icon");
const taskbarSvg = source("taskbar-icon", appSvg);
const smallSvg = source("taskbar-icon-small", taskbarSvg);

const app = render(appSvg);
const large = taskbarSvg === appSvg ? app : render(taskbarSvg);
const small = smallSvg === taskbarSvg ? large : render(smallSvg);
try {
  mkdirSync(out, { recursive: true });
  for (const file of TILE_FILES) copyFileSync(join(app, file), join(out, file));
  for (const file of DESKTOP_FILES) copyFileSync(join(large, file), join(out, file));
  const ico = readIco(readFileSync(join(large, "icon.ico")));
  for (const [size, image] of readIco(readFileSync(join(small, "icon.ico")))) if (SMALL.has(size)) ico.set(size, image);
  writeFileSync(join(out, "icon.ico"), writeIco(ico));
  if (args.tray) copyFileSync(join(small, "32x32.png"), join(out, "tray.png"));
  if (args.mobile)
    for (const dir of ["android", "ios"])
      if (existsSync(join(app, dir))) cpSync(join(app, dir), join(out, dir), { recursive: true });
  console.log(`✓ icons written to ${out}`);
} finally {
  for (const dir of new Set([app, large, small])) rmSync(dir, { recursive: true, force: true });
}
