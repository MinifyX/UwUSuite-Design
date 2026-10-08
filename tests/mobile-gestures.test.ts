// @vitest-environment node
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { matchesAccelerator } from "../src/lib/shortcuts";
import { detectDeviceKind, platformOf } from "../src/mobile/device";
import {
  backEdge,
  backProgress,
  backTransform,
  detentHeight,
  dragAxis,
  keyboardInset,
  visibleArea,
  PULL_ARM_DISTANCE,
  PULL_MAX,
  pullArmed,
  pullDistance,
  settleSheet,
  shouldGoBack,
  stepValue,
  swipeOffset,
  swipeRest,
  swipeSettle,
} from "../src/mobile/gestures";
import { hapticCommand } from "../src/mobile/haptics";

const UA = {
  iphone:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 26_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148",
  ipad: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Safari/605.1.15",
  android:
    "Mozilla/5.0 (Linux; Android 16; Pixel 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Mobile Safari/537.36",
  windows:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36",
};

describe("detectDeviceKind", () => {
  it.each([
    [UA.iphone, 390, 5, "phone-ios"],
    [UA.ipad, 1180, 5, "ipad"],
    [UA.ipad, 820, 5, "ipad"],
    // iPad Split View narrower than a phone line: the phone layout.
    [UA.ipad, 507, 5, "phone-ios"],
    // A Mac (same UA as the iPad) without touch.
    [UA.ipad, 1440, 0, "desktop"],
    [UA.android, 412, 5, "phone-android"],
    [UA.windows, 400, 0, "desktop"],
    // A touch laptop stays a desktop.
    [UA.windows, 1280, 10, "desktop"],
  ] as const)("%s at %i px with %i touch points is %s", (userAgent, width, maxTouchPoints, kind) => {
    expect(detectDeviceKind({ userAgent, width, maxTouchPoints })).toBe(kind);
  });

  it("maps kinds to platforms", () => {
    expect(platformOf("phone-ios")).toBe("ios");
    expect(platformOf("phone-android")).toBe("android");
    expect(platformOf("ipad")).toBe("ipad");
    expect(platformOf("desktop")).toBeNull();
  });
});

describe("drag axis", () => {
  it("stays a tap inside the slop", () => expect(dragAxis(5, 5)).toBe("pending"));
  it("needs a clear horizontal lead", () => {
    expect(dragAxis(20, 4)).toBe("horizontal");
    expect(dragAxis(20, 18)).toBe("vertical");
  });
});

describe("back gestures", () => {
  it("starts only at the left edge on iOS, at both on Android", () => {
    expect(backEdge("ios", 10, 390, 30)).toBe("left");
    expect(backEdge("ios", 380, 390, -30)).toBeNull();
    expect(backEdge("ios", 100, 390, 30)).toBeNull();
    expect(backEdge("android", 400, 412, -30)).toBe("right");
    expect(backEdge("android", 8, 412, 30)).toBe("left");
    // Moving away from the screen is no back gesture.
    expect(backEdge("android", 8, 412, -30)).toBeNull();
  });

  it("measures progress towards the far side", () => {
    expect(backProgress(195, 390, "left")).toBe(0.5);
    expect(backProgress(-206, 412, "right")).toBe(0.5);
    expect(backProgress(-50, 390, "left")).toBe(0);
    expect(backProgress(999, 390, "left")).toBe(1);
  });

  it("goes back on iOS after 110 px or a flick", () => {
    expect(shouldGoBack("ios", 100, 390)).toBe(false);
    expect(shouldGoBack("ios", 120, 390)).toBe(true);
    expect(shouldGoBack("ios", 40, 390, 0.8)).toBe(true);
    expect(shouldGoBack("ios", 20, 390, 0.8)).toBe(false);
  });

  it("goes back on Android after 28 % of the width", () => {
    expect(shouldGoBack("android", 100, 412)).toBe(false);
    expect(shouldGoBack("android", 120, 412)).toBe(true);
  });

  it("moves the pages like the prototype", () => {
    expect(backTransform("ios", 195, 390, "left")).toEqual({ page: "translateX(195px)", under: "translateX(-15%)" });
    expect(backTransform("android", -206, 412, "right").page).toBe("translateX(-20px) scale(0.93)");
  });
});

describe("swipe rows", () => {
  const widths = { leading: 76, trailing: 152 };

  it("follows the finger, 40 px past the actions at most", () => {
    expect(swipeOffset(0, -100, widths)).toBe(-100);
    expect(swipeOffset(0, -400, widths)).toBe(-192);
    expect(swipeOffset(0, 400, widths)).toBe(116);
    expect(swipeOffset(-152, 30, widths)).toBe(-122);
  });

  it("does not move towards a side without actions", () => {
    expect(swipeOffset(0, 80, { leading: 0, trailing: 152 })).toBe(0);
  });

  it("opens past 70 px, else closes", () => {
    expect(swipeSettle(-60, widths)).toBe("closed");
    expect(swipeSettle(-80, widths)).toBe("trailing");
    expect(swipeSettle(80, widths)).toBe("leading");
    expect(swipeRest("trailing", widths)).toBe(-152);
    expect(swipeRest("leading", widths)).toBe(76);
    expect(swipeRest("closed", widths)).toBe(0);
  });
});

describe("pull to refresh", () => {
  it("gets stiffer and never passes the maximum", () => {
    expect(pullDistance(-20)).toBe(0);
    expect(pullDistance(100)).toBeGreaterThan(40);
    expect(pullDistance(100)).toBeLessThan(100);
    expect(pullDistance(10_000)).toBeLessThanOrEqual(PULL_MAX);
  });

  it("arms past 66 px", () => {
    expect(pullArmed(PULL_ARM_DISTANCE)).toBe(false);
    expect(pullArmed(PULL_ARM_DISTANCE + 1)).toBe(true);
    // About 160 px of finger travel arms it.
    expect(pullArmed(pullDistance(170))).toBe(true);
    expect(pullArmed(pullDistance(150))).toBe(false);
  });
});

describe("sheets", () => {
  it("has a large and a medium height", () => {
    expect(detentHeight("large", 852, 54)).toBe(788);
    expect(detentHeight("medium", 852)).toBe(477);
  });

  it("settles between detents and closes from the lowest", () => {
    const both = ["medium", "large"] as const;
    expect(settleSheet("large", both, 50, 700)).toBe("large");
    expect(settleSheet("large", both, 300, 700)).toBe("medium");
    expect(settleSheet("medium", both, 300, 480)).toBeNull();
    expect(settleSheet("medium", both, -200, 480)).toBe("large");
    expect(settleSheet("large", ["large"], 40, 700, 1.2)).toBeNull();
  });
});

describe("keyboard and steppers", () => {
  it("reads the keyboard from the visual viewport", () => {
    expect(keyboardInset(844, 844)).toBe(0);
    expect(keyboardInset(844, 508)).toBe(336);
    expect(keyboardInset(844, 508, 20)).toBe(316);
  });

  it("finds the visible part of the page with the keyboard up", () => {
    expect(visibleArea(844, 844)).toEqual({ top: 0, height: 844, keyboard: 0 });
    // iOS scrolled the page by the keyboard to show the field at the bottom.
    expect(visibleArea(844, 508.4, 336)).toEqual({ top: 336, height: 508, keyboard: 336 });
    expect(visibleArea(844, 844, -2)).toEqual({ top: 0, height: 844, keyboard: 0 });
  });

  it("keeps steppers inside their range", () => {
    expect(stepValue(0, -1, 0, 9)).toBe(0);
    expect(stepValue(8, 1, 0, 9)).toBe(9);
    expect(stepValue(9, 1, 0, 9)).toBe(9);
  });
});

describe("iPad shortcuts", () => {
  const key = (
    k: string,
    mods: Partial<Record<"metaKey" | "ctrlKey" | "altKey" | "shiftKey", boolean>> = {},
    code?: string,
  ) => ({
    key: k,
    code,
    metaKey: false,
    ctrlKey: false,
    altKey: false,
    shiftKey: false,
    ...mods,
  });

  it("is ⌘ on Apple devices and Ctrl elsewhere", () => {
    expect(matchesAccelerator(key("f", { metaKey: true }), "CmdOrCtrl+F", true)).toBe(true);
    expect(matchesAccelerator(key("f", { ctrlKey: true }), "CmdOrCtrl+F", true)).toBe(false);
    expect(matchesAccelerator(key("f", { ctrlKey: true }), "CmdOrCtrl+F", false)).toBe(true);
  });

  it("needs the exact modifiers", () => {
    expect(matchesAccelerator(key("F", { metaKey: true, shiftKey: true }), "CmdOrCtrl+F", true)).toBe(false);
    expect(matchesAccelerator(key("n", { metaKey: true }), "CmdOrCtrl+N", true)).toBe(true);
  });

  it("matches by key code on other layouts", () => {
    expect(matchesAccelerator(key("ƒ", { metaKey: true }, "KeyF"), "CmdOrCtrl+F", true)).toBe(true);
  });
});

describe("haptics", () => {
  it("maps kinds to the Tauri plugin's commands", () => {
    expect(hapticCommand("selection")).toEqual(["plugin:haptics|selection_feedback", {}]);
    expect(hapticCommand("success")).toEqual(["plugin:haptics|notification_feedback", { type: "success" }]);
    expect(hapticCommand("medium")).toEqual(["plugin:haptics|impact_feedback", { style: "medium" }]);
  });

  // tauri-plugin-haptics has no default permission set: docs/mobile.md lists one per command.
  it("documents a permission for every command it calls", () => {
    const docs = readFileSync("docs/mobile.md", "utf8");
    expect(docs).not.toContain('"haptics:default"');
    const kinds = ["selection", "light", "medium", "heavy", "success", "warning", "error"] as const;
    for (const command of new Set(kinds.map((kind) => hapticCommand(kind)[0]))) {
      const name = command.replace("plugin:haptics|", "").replaceAll("_", "-");
      expect(docs).toContain(`"haptics:allow-${name}"`);
    }
  });
});
