import { describe, expect, it } from "vitest";
import { contrast, THEMES, type ThemeName } from "./tokens";

const SURFACES = ["--uwu-canvas", "--uwu-surface", "--uwu-elevated"];

/** [text, background] pairs that carry text. */
const TEXT: [string, string][] = [
  ...SURFACES.flatMap((bg) =>
    ["--uwu-ink", "--uwu-muted", "--uwu-pink-ink", "--uwu-danger-ink", "--uwu-success-ink", "--uwu-warning-ink"].map(
      (fg) => [fg, bg] as [string, string],
    ),
  ),
  ["--uwu-pink-ink", "--uwu-pink-tint"],
  ["--uwu-ink", "--uwu-pink-tint"],
  ["--uwu-on-pink", "--uwu-pink-solid"],
  ["--uwu-on-pink", "--uwu-pink-solid-hover"],
  ["--uwu-danger-ink", "--uwu-danger-tint"],
  ["--uwu-success-ink", "--uwu-success-tint"],
  ["--uwu-warning-ink", "--uwu-warning-tint"],
  ["--uwu-toast-ink", "--uwu-toast"],
  ["--uwu-toast-accent", "--uwu-toast"],
  ["--uwu-toast-danger", "--uwu-toast"],
  ["--uwu-stage-ink", "--uwu-stage"],
  ["--uwu-stage-muted", "--uwu-stage"],
  ["--uwu-canvas", "--uwu-ink"], // tooltips
  ["--uwu-pink-solid", "--uwu-surface"], // the wordmark's "UwU", link-like text
  ...["pink", "violet", "sky", "mint", "amber", "coral"].map(
    (c) => [`--uwu-avatar-${c}-ink`, `--uwu-avatar-${c}`] as [string, string],
  ),
];

/** [mark, background] pairs without text: dots, outlines, switches, focus (WCAG 1.4.11, 3:1). */
const MARKS: [string, string][] = [
  ...["--uwu-pink-solid", "--uwu-control", "--uwu-danger", "--uwu-success", "--uwu-warning"].flatMap((fg) =>
    ["--uwu-canvas", "--uwu-surface"].map((bg) => [fg, bg] as [string, string]),
  ),
  // The brand pink only needs 3:1 on cards; on the canvas it is decoration (tokens.css).
  ["--uwu-pink", "--uwu-surface"],
];

// High contrast promises 7:1 for text (WCAG AAA); everything else AA.
const TEXT_MIN: Record<ThemeName, number> = { light: 4.5, dark: 4.5, "high-light": 7, "high-dark": 7 };
// The brand pink is a mark colour by design and sits right at the 3:1 line in light mode.
const MARK_MIN = 3;

describe.each(Object.keys(THEMES) as ThemeName[])("%s theme", (name) => {
  const theme = THEMES[name] as Record<string, string>;
  const value = (token: string) => {
    const v = theme[token];
    if (!v) throw new Error(`${token} is not defined`);
    return v;
  };

  it.each(TEXT)("%s on %s is readable text", (fg, bg) => {
    // The avatar tints and the stage are not part of high contrast; they keep their AA pairs.
    const min = fg.includes("avatar") || fg.includes("stage") ? 4.5 : TEXT_MIN[name];
    expect(contrast(value(fg), value(bg))).toBeGreaterThanOrEqual(min);
  });

  it.each(MARKS)("%s on %s is visible", (fg, bg) => {
    expect(contrast(value(fg), value(bg))).toBeGreaterThanOrEqual(MARK_MIN);
  });
});

describe("two pinks", () => {
  it("white text on the brand pink fails, which is why buttons use pink-solid", () => {
    expect(contrast(THEMES.light["--uwu-on-pink"]!, THEMES.light["--uwu-pink"]!)).toBeLessThan(4.5);
    expect(contrast(THEMES.light["--uwu-on-pink"]!, THEMES.light["--uwu-pink-solid"]!)).toBeGreaterThanOrEqual(4.5);
  });
});
