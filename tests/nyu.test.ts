import { describe, expect, it } from "vitest";
import { keyScene, letterScene, MOODS, nyuSvg, serverScene, SHELLS, VIEWBOX } from "../src/nyu/svg";

describe("Nyu catalogue", () => {
  it.each(SHELLS)("draws the %s shell in every mood", (shell) => {
    for (const mood of MOODS) {
      const svg = nyuSvg({ shell, mood });
      expect(svg.startsWith("<svg")).toBe(true);
      expect(svg).toContain(`viewBox="${VIEWBOX[shell]}"`);
      expect(svg).toContain('class="nyu-edge"');
      expect(svg).not.toMatch(/undefined|NaN/);
    }
  });

  it("escapes the label", () => {
    expect(nyuSvg({ label: '"><script>' })).not.toContain("<script>");
  });

  it("hides decorative figures from screen readers", () => {
    expect(nyuSvg({ label: "" })).toContain('aria-hidden="true"');
  });

  it("draws the scenes", () => {
    for (const scene of [serverScene(), keyScene(), letterScene()]) expect(scene).toContain("nyu-scene");
  });
});
