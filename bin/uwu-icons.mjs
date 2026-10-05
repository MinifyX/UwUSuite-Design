#!/usr/bin/env node
// The suite's app icon tool (docs/app-icons.md). Run it in a Tauri app (it needs @tauri-apps/cli):
//
//   uwu-icons --brand ../../brand --name uwumirror [--out src-tauri/icons] [--tray] [--mobile]
//
// From the three brand SVGs every app has:
//
//   <name>-app-icon.svg            Nyu on the pastel tile → Square*/StoreLogo (Windows Store), with
//                                  --mobile Android and iOS icons, and, set into Apple's icon grid
//                                  (mac-icon.mjs), icon.icns for the macOS Dock
//   <name>-taskbar-icon.svg        Nyu alone, upright, no tile → icon.ico, icon.png and the desktop
//                                  PNGs (Windows taskbar, window, Linux menus)
//   <name>-taskbar-icon-small.svg  the simplified cut → the 16 and 24 px ICO frames and, with
//                                  --tray, tray.png (32 px) for Windows and Linux
//   <name>-symbol-mono.svg         outlines in currentColor → with --tray tray-template.png (36 px,
//                                  outlines 1.5 times as thick), the macOS menu bar icon. A
//                                  hand-drawn <name>-tray-template.svg (black on transparent) wins.
//
// Missing small or taskbar files fall back to the next bigger one, with a warning.

import { execFileSync } from "node:child_process";
import { copyFileSync, cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { parseArgs } from "node:util";
import { checkIcns, ICNS_SIZES, writeIcns } from "./icns.mjs";
import { readIco, writeIco } from "./ico.mjs";
import { macMasterSvg, TRAY_TEMPLATE_SIZE, trayTemplateSvg } from "./mac-icon.mjs";

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

/** Tauri's icon set for one SVG, or only the PNGs of `sizes`, in a temporary folder. */
function render(svg, sizes) {
  const dir = mkdtempSync(join(tmpdir(), "uwu-icons-"));
  const png = sizes ? ["-p", sizes.join(",")] : [];
  execFileSync("pnpm", ["tauri", "icon", svg, "-o", dir, ...png], {
    stdio: "ignore",
    shell: process.platform === "win32",
  });
  return dir;
}

/** Renders an SVG string through a temporary file. */
function renderString(svg, sizes) {
  const dir = mkdtempSync(join(tmpdir(), "uwu-icons-src-"));
  try {
    const file = join(dir, "source.svg");
    writeFileSync(file, svg);
    return render(file, sizes);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

const appSvg = source("app-icon");
const taskbarSvg = source("taskbar-icon", appSvg);
const smallSvg = source("taskbar-icon-small", taskbarSvg);

const app = render(appSvg);
const large = taskbarSvg === appSvg ? app : render(taskbarSvg);
const small = smallSvg === taskbarSvg ? large : render(smallSvg);
const mac = renderString(macMasterSvg(readFileSync(appSvg, "utf8")), ICNS_SIZES);
const templateFile = join(brand, `${args.name}-tray-template.svg`);
const monoFile = join(brand, `${args.name}-symbol-mono.svg`);
let template;
if (args.tray && existsSync(templateFile)) template = render(templateFile, [TRAY_TEMPLATE_SIZE]);
else if (args.tray && existsSync(monoFile))
  template = renderString(trayTemplateSvg(readFileSync(monoFile, "utf8")), [TRAY_TEMPLATE_SIZE]);
else if (args.tray) console.warn(`! ${args.name}-symbol-mono.svg is missing, so there is no macOS tray-template.png`);
try {
  mkdirSync(out, { recursive: true });
  for (const file of TILE_FILES) copyFileSync(join(app, file), join(out, file));
  for (const file of DESKTOP_FILES) copyFileSync(join(large, file), join(out, file));
  const ico = readIco(readFileSync(join(large, "icon.ico")));
  for (const [size, image] of readIco(readFileSync(join(small, "icon.ico")))) if (SMALL.has(size)) ico.set(size, image);
  writeFileSync(join(out, "icon.ico"), writeIco(ico));
  const icns = writeIcns(new Map(ICNS_SIZES.map((size) => [size, readFileSync(join(mac, `${size}x${size}.png`))])));
  checkIcns(icns);
  writeFileSync(join(out, "icon.icns"), icns);
  mkdirSync(join(out, "macos"), { recursive: true });
  copyFileSync(join(mac, "1024x1024.png"), join(out, "macos", "icon-1024.png"));
  if (args.tray) copyFileSync(join(small, "32x32.png"), join(out, "tray.png"));
  if (template)
    copyFileSync(join(template, `${TRAY_TEMPLATE_SIZE}x${TRAY_TEMPLATE_SIZE}.png`), join(out, "tray-template.png"));
  if (args.mobile)
    for (const dir of ["android", "ios"])
      if (existsSync(join(app, dir))) cpSync(join(app, dir), join(out, dir), { recursive: true });
  console.log(`✓ icons written to ${out}`);
} finally {
  for (const dir of new Set([app, large, small, mac, template])) if (dir) rmSync(dir, { recursive: true, force: true });
}
