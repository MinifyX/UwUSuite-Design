import { render } from "@testing-library/react";
import { execFileSync } from "node:child_process";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { Icon, ICON_SIZES } from "../src/icons/Icon";
import { Android, SUITE_ICON_NODES } from "../src/icons/suite";
import { ICONS } from "../src/icons/vocabulary";
import { ROOT } from "./tokens";

describe("icons", () => {
  it.each(Object.entries(ICON_SIZES))("size %s draws %o", (size, spec) => {
    const { container } = render(<Icon icon={Android} size={size as keyof typeof ICON_SIZES} />);
    const svg = container.querySelector("svg")!;
    expect(svg.getAttribute("width")).toBe(String(spec.px));
    expect(svg.getAttribute("stroke-width")).toBe(String(spec.stroke));
    expect(svg.getAttribute("aria-hidden")).toBe("true");
  });

  it("names an icon that stands alone", () => {
    const { getByRole } = render(<Icon icon={ICONS.settings} label="Einstellungen" />);
    expect(getByRole("img", { name: "Einstellungen" })).toBeTruthy();
  });

  it("maps every meaning to a drawable icon", () => {
    for (const [meaning, Glyph] of Object.entries(ICONS)) {
      const { container, unmount } = render(<Glyph />);
      expect(
        container.querySelector("svg path, svg circle, svg rect, svg ellipse, svg line, svg polyline"),
        meaning,
      ).toBeTruthy();
      unmount();
    }
  });

  it("uses each icon for one meaning only", () => {
    const glyphs = Object.values(ICONS);
    expect(new Set(glyphs).size).toBe(glyphs.length);
  });

  it("keeps the suite icons within the rules", () => {
    expect(Object.keys(SUITE_ICON_NODES).length).toBeGreaterThan(0);
    const output = execFileSync(process.execPath, [join(ROOT, "scripts/check-icons.mjs")], { encoding: "utf8" });
    expect(output).toContain("follow the icon rules");
  });
});
