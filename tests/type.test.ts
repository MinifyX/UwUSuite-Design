import { describe, expect, it } from "vitest";
import { FONT_CHOICES } from "../src/lib/fonts";
import {
  applyType,
  detectTypePlatform,
  opticalFactor,
  measureSystemBody,
  readSystemType,
  resolveType,
  ROLE_POINTS,
  roleSize,
  systemTextScale,
  TEXT_POINTS,
  TEXT_SIZE_CHOICES,
  TEXT_SIZE_FACTORS,
  TEXT_SIZE_LABELS,
  TEXT_TOKENS,
  tokenSize,
  TYPE_PLATFORMS,
  TYPE_ROLES,
} from "../src/lib/type";
import { block, tokensCss } from "./tokens";

const IPHONE =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 26_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148";
const MAC = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko)";
const ANDROID = "Mozilla/5.0 (Linux; Android 16; Pixel 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Mobile";
const WINDOWS = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Edg/140.0";

describe("platform scales", () => {
  it("follow the platforms' own body sizes", () => {
    expect(TEXT_POINTS.macos.body).toBe(13);
    expect(TEXT_POINTS.ios.body).toBe(17);
    expect(TEXT_POINTS.android.body).toBe(16);
    expect(TEXT_POINTS.desktop.body).toBe(14);
    expect(ROLE_POINTS.ios["large-title"]).toBe(34);
    expect(ROLE_POINTS.macos.title1).toBe(22);
    expect(ROLE_POINTS.android.title2).toBe(22);
  });

  it("grow from small to large on every platform", () => {
    for (const platform of TYPE_PLATFORMS) {
      const tokens = TEXT_TOKENS.map((token) => TEXT_POINTS[platform][token]);
      const roles = TYPE_ROLES.map((role) => ROLE_POINTS[platform][role]);
      expect(tokens, platform).toEqual([...tokens].sort((a, b) => a - b));
      expect(roles, platform).toEqual([...roles].sort((a, b) => a - b));
    }
  });

  it("keep the desktop scale of 1.x exactly, so Windows and Linux look as before", () => {
    const desktop = resolveType({ platform: "desktop" });
    expect(desktop).toEqual({ platform: "desktop", optical: 1, scale: 1 });
    expect(TEXT_TOKENS.map((token) => tokenSize(token, desktop))).toEqual([11, 12, 13, 14, 16, 18, 22, 28]);
  });

  it("are the same numbers as tokens.css", () => {
    const desktop = block(":root");
    for (const platform of TYPE_PLATFORMS) {
      const css = platform === "desktop" ? desktop : { ...desktop, ...block(`[data-type="${platform}"]`) };
      for (const token of TEXT_TOKENS)
        expect(css[`--uwu-pt-text-${token}`], `${platform} ${token}`).toBe(String(TEXT_POINTS[platform][token]));
      for (const role of TYPE_ROLES)
        expect(css[`--uwu-pt-type-${role}`], `${platform} ${role}`).toBe(String(ROLE_POINTS[platform][role]));
    }
  });

  it("computes every size from points, optical size and text size", () => {
    const sizes = block(":root,\n[data-type]");
    for (const token of TEXT_TOKENS)
      expect(sizes[`--uwu-text-${token}`]).toBe(
        `calc(var(--uwu-pt-text-${token}) * var(--uwu-type-optical) * var(--uwu-type-scale) * 1px)`,
      );
    for (const role of TYPE_ROLES)
      expect(sizes[`--uwu-type-${role}`]).toBe(
        `calc(var(--uwu-pt-type-${role}) * var(--uwu-type-optical) * var(--uwu-type-scale) * 1px)`,
      );
    expect(tokensCss).not.toMatch(/--uwu-text-\w+:\s*\d+px/);
  });
});

describe("optical size", () => {
  it("sets UwU Sans larger where the system font has a taller x-height", () => {
    expect(opticalFactor("macos")).toBeCloseTo(1.06, 2);
    expect(opticalFactor("ios")).toBeCloseTo(1.06, 2);
    expect(opticalFactor("android")).toBeCloseTo(1.065, 2);
    expect(opticalFactor("desktop")).toBe(1);
  });

  it("leaves the system font alone and keeps every factor near 1", () => {
    for (const platform of TYPE_PLATFORMS) {
      expect(opticalFactor(platform, "system")).toBe(1);
      for (const font of FONT_CHOICES) {
        const factor = opticalFactor(platform, font);
        expect(factor).toBeGreaterThan(0.9);
        expect(factor).toBeLessThan(1.1);
      }
    }
  });

  it("makes macOS body text read like 13 pt of SF Pro", () => {
    const mac = resolveType({ platform: "macos" });
    expect(tokenSize("body", mac)).toBeCloseTo(13.8, 1);
    expect(roleSize("body", resolveType({ platform: "ios" }))).toBeCloseTo(18, 0);
  });
});

describe("system text size", () => {
  it("reads Dynamic Type from the body size", () => {
    expect(systemTextScale("ios", 17)).toBe(1);
    expect(systemTextScale("ios", 14)).toBeCloseTo(0.824, 3);
    expect(systemTextScale("ios", 23)).toBeCloseTo(1.353, 3);
    expect(systemTextScale("ios", 53)).toBe(3.118);
    expect(systemTextScale("macos", 13)).toBe(1);
  });

  it("ignores what can't be a body size", () => {
    expect(systemTextScale("ios", null)).toBe(1);
    expect(systemTextScale("ios", Number.NaN)).toBe(1);
    expect(systemTextScale("ios", 2)).toBe(1);
    expect(systemTextScale("ios", 500)).toBe(1);
    expect(systemTextScale("desktop", 20)).toBe(1);
    expect(systemTextScale("android", 20)).toBe(1);
  });

  it("multiplies the system with the app's setting", () => {
    expect(resolveType({ platform: "ios", systemScale: 1.2, textSize: "larger" }).scale).toBeCloseTo(1.38, 3);
    expect(resolveType({ platform: "ios", textSize: "smaller" }).scale).toBe(0.9);
    expect(resolveType({ platform: "ios", systemScale: 3, textSize: "largest" }).scale).toBe(3.2);
  });

  it("doesn't scale twice where the engine enlarges text itself (Android)", () => {
    expect(resolveType({ platform: "android", systemScale: 1.3, engineScales: true }).scale).toBe(1);
    expect(resolveType({ platform: "android", systemScale: 1.3, engineScales: true, textSize: "larger" }).scale).toBe(
      1.15,
    );
  });

  it("has a factor and labels for every choice, with System in the middle at 1", () => {
    for (const choice of TEXT_SIZE_CHOICES) {
      expect(TEXT_SIZE_FACTORS[choice]).toBeGreaterThan(0);
      expect(TEXT_SIZE_LABELS.de[choice]).toBeTruthy();
      expect(TEXT_SIZE_LABELS.en[choice]).toBeTruthy();
    }
    expect(TEXT_SIZE_FACTORS.system).toBe(1);
  });
});

describe("detectTypePlatform", () => {
  it.each([
    [IPHONE, 5, undefined, "ios"],
    [MAC, 5, undefined, "ios"], // iPadOS says Macintosh, with touch
    [MAC, 0, undefined, "macos"],
    [MAC, 0, "ios", "ios"], // the iPhone/iPad app on a Mac, shown at 77 %
    [ANDROID, 5, undefined, "android"],
    [WINDOWS, 0, undefined, "desktop"],
    [WINDOWS, 0, "windows", "desktop"],
    ["Mozilla/5.0 (X11; Linux x86_64)", 0, "linux", "desktop"],
  ])("%s with %i touch points, built for %s → %s", (userAgent, maxTouchPoints, build, expected) => {
    expect(detectTypePlatform({ userAgent, maxTouchPoints, build })).toBe(expected);
  });
});

describe("reading the system", () => {
  it("measures nothing where the engine has no -apple-system-body, and stays at 1", () => {
    expect(measureSystemBody()).toBeNull();
    expect(readSystemType("ios")).toEqual({ systemScale: 1, engineScales: false });
    expect(readSystemType("desktop")).toEqual({ systemScale: 1, engineScales: false });
    expect(readSystemType("android").engineScales).toBe(true);
  });
});

describe("applyType", () => {
  it("writes the platform and both factors onto <html>", () => {
    const root = document.createElement("html");
    applyType(resolveType({ platform: "ios", systemScale: 1.2 }), root);
    expect(root.dataset.type).toBe("ios");
    expect(root.style.getPropertyValue("--uwu-type-optical")).toBe("1.06");
    expect(root.style.getPropertyValue("--uwu-type-scale")).toBe("1.2");
  });
});

describe("mobile.css", () => {
  it("takes every text size from the platform roles", async () => {
    const { readFileSync } = await import("node:fs");
    const { join } = await import("node:path");
    const { ROOT } = await import("./tokens");
    const css = readFileSync(join(ROOT, "src/css/mobile.css"), "utf8");
    const sizes = [...css.matchAll(/font-size:\s*([^;]+);/g)].map((match) => match[1]!);
    expect(sizes.length).toBeGreaterThan(20);
    for (const size of sizes)
      expect(size).toMatch(/^(inherit|var\(--uwu-type-[\w-]+\)|max\(16px, var\(--uwu-type-body\)\))$/);
  });
});
