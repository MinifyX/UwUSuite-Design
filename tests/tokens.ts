import { readFileSync } from "node:fs";
import { join } from "node:path";

export const ROOT = join(import.meta.dirname, "..");
export const tokensCss = readFileSync(join(ROOT, "src/css/tokens.css"), "utf8");

/** The custom properties of the block whose selector is exactly `selector`. */
export function block(selector: string): Record<string, string> {
  const start = tokensCss.indexOf(`${selector} {`);
  if (start < 0) throw new Error(`no block ${selector}`);
  const body = tokensCss.slice(start, tokensCss.indexOf("\n}", start));
  const out: Record<string, string> = {};
  for (const [, name, value] of body.matchAll(/(--[\w-]+):\s*([^;]+);/g)) out[name!] = value!.trim();
  return out;
}

export const THEMES = {
  light: block(":root"),
  dark: { ...block(":root"), ...block(':root[data-theme="dark"]') },
  "high-light": { ...block(":root"), ...block('html:root[data-contrast="high"]') },
  "high-dark": {
    ...block(":root"),
    ...block(':root[data-theme="dark"]'),
    ...block('html:root[data-contrast="high"]'),
    ...block('html:root[data-contrast="high"][data-theme="dark"]'),
  },
} as const;

export type ThemeName = keyof typeof THEMES;

function channel(value: number) {
  const c = value / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

export function luminance(hex: string) {
  const match = /^#([0-9a-f]{6})$/i.exec(hex);
  if (!match) throw new Error(`not a hex colour: ${hex}`);
  const n = parseInt(match[1]!, 16);
  return 0.2126 * channel((n >> 16) & 255) + 0.7152 * channel((n >> 8) & 255) + 0.0722 * channel(n & 255);
}

export function contrast(a: string, b: string) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
}
