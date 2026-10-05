import { describe, expect, it } from "vitest";
import { applyAppearance, bootScript, resolveAppearance } from "../src/lib/appearance";

const system = { dark: true, contrast: false, reducedMotion: true };

describe("appearance", () => {
  it("follows the system where asked", () => {
    expect(resolveAppearance({ theme: "system" }, system)).toEqual({
      theme: "dark",
      contrast: "normal",
      motion: "reduced",
    });
  });

  it("lets the settings win over the system", () => {
    expect(resolveAppearance({ theme: "light", contrast: "high", motion: "on" }, system)).toEqual({
      theme: "light",
      contrast: "high",
      motion: "full",
    });
  });

  it("writes data attributes on <html>", () => {
    applyAppearance({ theme: "dark", contrast: "high", motion: "reduced" });
    const { dataset } = document.documentElement;
    expect([dataset.theme, dataset.contrast, dataset.motion]).toEqual(["dark", "high", "reduced"]);
  });

  it("has a boot script that sets the theme before the first paint", () => {
    window.matchMedia = ((query: string) => ({ matches: query.includes("dark") })) as typeof window.matchMedia;
    localStorage.setItem("app.settings", JSON.stringify({ theme: "system", motion: "off" }));
    document.documentElement.removeAttribute("data-theme");
    new Function(bootScript("app.settings"))();
    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(document.documentElement.dataset.motion).toBe("reduced");
  });

  it("survives broken settings", () => {
    localStorage.setItem("broken", "{");
    expect(() => new Function(bootScript("broken"))()).not.toThrow();
  });
});
