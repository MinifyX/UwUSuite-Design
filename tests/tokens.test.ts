import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { block, ROOT } from "./tokens";

const light = block(":root");
const tailwind = readFileSync(join(ROOT, "src/css/tailwind.css"), "utf8");
const isColour = (value: string) => /^(#|rgb)/.test(value);

describe("tokens.css", () => {
  it.each([
    ':root[data-theme="dark"]',
    'html:root[data-contrast="high"]',
    'html:root[data-contrast="high"][data-theme="dark"]',
  ])("%s only overrides tokens that exist in light", (selector) => {
    for (const name of Object.keys(block(selector))) expect(light, name).toHaveProperty(name);
  });

  it("gives every colour token a Tailwind name", () => {
    const colours = Object.entries(light)
      .filter(([, value]) => isColour(value))
      .map(([name]) => name)
      // Brand art, backdrops and stage overlays are used through CSS, not utilities.
      .filter((name) => !/tile-|backdrop|shadow|focus/.test(name));
    for (const name of colours) expect(tailwind, name).toContain(`var(${name})`);
  });

  it("keeps the space scale on the 4 px grid", () => {
    for (const [name, value] of Object.entries(light).filter(([n]) => n.startsWith("--uwu-space-")))
      expect(parseInt(value, 10) % 4, name).toBe(0);
  });

  it("keeps dark colours dark and light colours light", () => {
    expect(block(':root[data-theme="dark"]')["--uwu-canvas"]).toBe("#141016");
    expect(light["--uwu-canvas"]).toBe("#f8f4f6");
  });
});

describe("css files", () => {
  it.each(["tailwind.css", "plain.css"])("%s imports every part", (file) => {
    const css = readFileSync(join(ROOT, "src/css", file), "utf8");
    for (const part of ["tokens", "fonts", "base", "motion", "nyu", "titlebar", "mobile"])
      expect(css).toContain(`"./${part}.css"`);
  });

  it("uses no raw hex colours in components", () => {
    for (const file of [
      "Button",
      "Field",
      "Switch",
      "Segmented",
      "Pill",
      "Dialog",
      "Menu",
      "Toaster",
      "Card",
      "Status",
      "Avatar",
    ]) {
      const source = readFileSync(join(ROOT, "src/components", `${file}.tsx`), "utf8");
      expect(source, file).not.toMatch(/#[0-9a-fA-F]{3,8}\b/);
    }
  });

  it("uses no raw hex colours in the mobile components and their CSS", () => {
    const files = readdirSync(join(ROOT, "src/mobile")).map((file) => join(ROOT, "src/mobile", file));
    for (const file of [...files, join(ROOT, "src/css/mobile.css")])
      expect(readFileSync(file, "utf8"), file).not.toMatch(/#[0-9a-fA-F]{3,8}\b/);
  });
});
