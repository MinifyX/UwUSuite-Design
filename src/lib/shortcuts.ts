import type { Platform } from "../components/TitleBar.js";

/**
 * Shortcuts are written once, as Tauri accelerators (`CmdOrCtrl+Shift+S`), and shown the way the
 * platform writes them: `⇧⌘S` on a Mac, `Strg+Umschalt+S` (German) or `Ctrl+Shift+S` (English)
 * elsewhere. The same string goes into the native menu, so menu and tooltip never disagree.
 * From UwUNotes 0.6.
 */

const MAC_MODIFIERS: readonly [RegExp, string][] = [
  [/^(?:ctrl|control)$/i, "⌃"],
  [/^(?:alt|option)$/i, "⌥"],
  [/^shift$/i, "⇧"],
  [/^(?:cmd|command|cmdorctrl|commandorcontrol|super|meta)$/i, "⌘"],
];

const MAC_KEY_GLYPHS: Record<string, string> = {
  Enter: "↩",
  Tab: "⇥",
  Escape: "⎋",
  Backspace: "⌫",
  Delete: "⌦",
  Space: "␣",
  PageUp: "⇞",
  PageDown: "⇟",
  Home: "↖",
  End: "↘",
  ArrowUp: "↑",
  ArrowDown: "↓",
  ArrowLeft: "←",
  ArrowRight: "→",
};

const KEY_NAMES: Record<string, string> = { Comma: ",", Period: ".", Minus: "-", Equal: "=", Plus: "+", Slash: "/" };

const OTHER_MODIFIERS: Record<"de" | "en", readonly [RegExp, string][]> = {
  de: [
    [/^(?:ctrl|control|cmdorctrl|commandorcontrol)$/i, "Strg"],
    [/^(?:alt|option)$/i, "Alt"],
    [/^shift$/i, "Umschalt"],
    [/^(?:cmd|command|super|meta)$/i, "Win"],
  ],
  en: [
    [/^(?:ctrl|control|cmdorctrl|commandorcontrol)$/i, "Ctrl"],
    [/^(?:alt|option)$/i, "Alt"],
    [/^shift$/i, "Shift"],
    [/^(?:cmd|command|super|meta)$/i, "Win"],
  ],
};

/** `KeyM` → `M`, `Digit1` → `1`, `Comma` → `,`, the rest as it is. */
function keyName(key: string) {
  const code = key.match(/^(?:Key([A-Z])|Digit(\d))$/);
  if (code) return code[1] ?? code[2];
  return KEY_NAMES[key] ?? (key.length === 1 ? key.toUpperCase() : key);
}

function split(accelerator: string) {
  // The `+` key itself: `CmdOrCtrl++`.
  const parts = accelerator.endsWith("++") ? [...accelerator.slice(0, -2).split("+"), "+"] : accelerator.split("+");
  const key = parts.pop() ?? "";
  return { modifiers: parts, key };
}

/** `CmdOrCtrl+Shift+S` → `⇧⌘S`: Apple's symbols in Apple's order (⌃⌥⇧⌘), no plus signs. */
export function macShortcut(accelerator: string): string {
  const { modifiers, key } = split(accelerator);
  const alone = MAC_MODIFIERS.find(([pattern]) => pattern.test(key));
  if (alone && modifiers.length === 0) return alone[1];
  const symbols = MAC_MODIFIERS.filter(([pattern]) => modifiers.some((part) => pattern.test(part))).map(
    ([, symbol]) => symbol,
  );
  return `${symbols.join("")}${MAC_KEY_GLYPHS[key] ?? keyName(key)}`;
}

/** An accelerator as this platform writes it: `⌘,` on a Mac, `Strg+,` or `Ctrl+,` elsewhere. */
export function shortcutText(accelerator: string, platform: Platform, lang: "de" | "en" = "de"): string {
  if (platform === "mac") return macShortcut(accelerator);
  const { modifiers, key } = split(accelerator);
  const names = OTHER_MODIFIERS[lang]
    .filter(([pattern]) => modifiers.some((part) => pattern.test(part)))
    .map(([, name]) => name);
  return [...names, keyName(key)].join("+");
}

/** A tooltip or label with its shortcut: `Einstellungen (⌘,)`. */
export function withShortcut(label: string, accelerator: string, platform: Platform, lang: "de" | "en" = "de") {
  return `${label} (${shortcutText(accelerator, platform, lang)})`;
}
