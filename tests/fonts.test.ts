import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { applyUiFont, FONT_CHOICES, FONT_NAMES, FONT_STACKS, FONT_TRACKING, isFontChoice } from "../src/lib/fonts";
import { ROOT } from "./tokens";

describe("fonts", () => {
  it("ships UwU Sans as a real WOFF2", () => {
    const file = readFileSync(join(ROOT, "fonts/UwUSans[wght].woff2"));
    expect(file.subarray(0, 4).toString("latin1")).toBe("wOF2");
    expect(file.length).toBeLessThan(80_000);
  });

  it("points fonts.css at the shipped file", () => {
    const css = readFileSync(join(ROOT, "src/css/fonts.css"), "utf8");
    expect(css).toContain('url("../../fonts/UwUSans[wght].woff2")');
    expect(css).toContain("font-weight: 200 800");
  });

  it("has a stack, a name and a tracking for every choice", () => {
    for (const choice of FONT_CHOICES) {
      expect(FONT_STACKS[choice]).toMatch(/system-ui/);
      expect(FONT_TRACKING[choice]).toMatch(/em$/);
      if (choice !== "system") expect(FONT_NAMES[choice]).toBeTruthy();
    }
    expect(FONT_STACKS.uwu.startsWith('"UwU Sans"')).toBe(true);
  });

  it("puts the font on <html>", () => {
    applyUiFont("manrope");
    const root = document.documentElement;
    expect(root.style.getPropertyValue("--font-ui")).toContain("Manrope Variable");
    expect(root.style.getPropertyValue("--tracking-ui")).toBe("-0.004em");
    expect(root.dataset.font).toBe("manrope");
  });

  it("recognises choices", () => {
    expect(isFontChoice("uwu")).toBe(true);
    expect(isFontChoice("comic-sans")).toBe(false);
  });
});

describe("kaomoji", async () => {
  const { keepKaomojiTogether } = await import("../src/lib/text");
  const joined = (s: string) => s.replaceAll("⁠", "").replaceAll(" ", " ");

  it("keeps a face in one piece and on the line of the word before", () => {
    const out = keepKaomojiTogether("Zeit für einen Tee (っ˘ω˘ς)");
    expect(joined(out)).toBe("Zeit für einen Tee (っ˘ω˘ς)");
    expect(out).toContain("Tee (⁠っ");
  });

  it("leaves ordinary brackets alone", () => {
    expect(keepKaomojiTogether("Port (meist 7000) prüfen")).toBe("Port (meist 7000) prüfen");
    expect(keepKaomojiTogether("Ordner (2)")).toBe("Ordner (2)");
  });

  it("handles faces with a letter-like mouth", () => {
    expect(keepKaomojiTogether("Bye bye (｡•́︿•̀｡)")).toContain("⁠");
    expect(keepKaomojiTogether("Nix gefunden (・_・;)")).toContain("⁠");
  });
});
