/**
 * The interface font (Settings → Darstellung → Schrift). Kept on this device only.
 *
 * UwU Sans is the default everywhere. The picker may offer Manrope, Rubik, DM Sans and the system
 * font; their files come from font-picker.css. The font reaches the whole interface through
 * `--font-ui` and `--tracking-ui` on <html> (see docs/typography.md).
 */

export const FONT_CHOICES = ["uwu", "manrope", "rubik", "dmsans", "system"] as const;
export type FontChoice = (typeof FONT_CHOICES)[number];

export const SYSTEM_STACK =
  'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", "Noto Sans", Arial, sans-serif';

export const MONO_STACK =
  '"JetBrains Mono Variable", "JetBrains Mono", ui-monospace, "Cascadia Mono", Consolas, monospace';

/** The family list for each choice; web fonts fall back to the system's. */
export const FONT_STACKS: Record<FontChoice, string> = {
  uwu: `"UwU Sans", ${SYSTEM_STACK}`,
  manrope: `"Manrope Variable", ${SYSTEM_STACK}`,
  rubik: `"Rubik Variable", ${SYSTEM_STACK}`,
  dmsans: `"DM Sans Variable", ${SYSTEM_STACK}`,
  system: SYSTEM_STACK,
};

/** The names the picker shows. Font names are never translated; "system" is the app's own label. */
export const FONT_NAMES: Record<Exclude<FontChoice, "system">, string> = {
  uwu: "UwU Sans",
  manrope: "Manrope",
  rubik: "Rubik",
  dmsans: "DM Sans",
};

/**
 * A little tighter than the fonts are set, for interface text. UwU Sans (Atkinson Hyperlegible) is
 * spaced generously for reading; the others are fine as they come. Never baked into a font.
 */
export const FONT_TRACKING: Record<FontChoice, string> = {
  uwu: "-0.008em",
  manrope: "-0.004em",
  rubik: "0em",
  dmsans: "-0.004em",
  system: "0em",
};

export function isFontChoice(value: unknown): value is FontChoice {
  return (FONT_CHOICES as readonly unknown[]).includes(value);
}

/** Puts the chosen font on the whole interface at once. */
export function applyUiFont(choice: FontChoice, root: HTMLElement = document.documentElement) {
  root.style.setProperty("--font-ui", FONT_STACKS[choice]);
  root.style.setProperty("--tracking-ui", FONT_TRACKING[choice]);
  root.dataset.font = choice;
}
