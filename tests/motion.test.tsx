import { act, render, screen, waitFor } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { StatTile } from "../src/components/Card";
import { CountUp } from "../src/components/CountUp";
import { NavIndicator } from "../src/components/NavIndicator";
import { motionAllowed, revealFrom } from "../src/lib/motion";
import { ROOT } from "./tokens";

const root = document.documentElement;
afterEach(() => {
  delete root.dataset.motion;
  root.style.removeProperty("--uwu-duration-count");
  root.removeAttribute("lang");
});

describe("motion", () => {
  it("follows data-motion", () => {
    expect(motionAllowed()).toBe(true);
    root.dataset.motion = "reduced";
    expect(motionAllowed()).toBe(false);
    expect(revealFrom(document.body)).toBeUndefined();
  });

  it("counts up to the value and gives screen readers only the final number", async () => {
    root.style.setProperty("--uwu-duration-count", "20ms");
    root.lang = "de";
    const { container } = render(<CountUp value={12480} />);
    expect(screen.getByText("12.480").className).toBe("sr-only");
    await waitFor(() => expect(container.querySelector("[aria-hidden]")?.textContent).toBe("12.480"), {
      timeout: 3000,
    });
  });

  it("shows the value at once under reduced motion, also in a StatTile", () => {
    root.dataset.motion = "reduced";
    const { container } = render(<StatTile label="Postfächer" value={42} />);
    expect(container.querySelector("[aria-hidden]")?.textContent).toBe("42");
  });

  it("puts the pill on the active row and follows aria-current", async () => {
    const { container, rerender } = render(<Nav active="a" />);
    const nav = container.querySelector("nav")!;
    const pill = container.querySelector(".uwu-nav-indicator")!;
    expect(nav.hasAttribute("data-uwu-indicator")).toBe(true);
    expect(pill.hasAttribute("data-on")).toBe(true);
    expect(nav.querySelector("[data-uwu-indicated]")?.textContent).toBe("a");
    await act(async () => rerender(<Nav active="b" />));
    expect(nav.querySelectorAll("[data-uwu-indicated]")).toHaveLength(1);
    expect(nav.querySelector("[data-uwu-indicated]")?.textContent).toBe("b");
    await act(async () => rerender(<Nav active="none" />));
    expect(pill.hasAttribute("data-on")).toBe(false);
  });

  it("keeps every new animation and transition behind no-preference and data-motion", () => {
    const css = readFileSync(join(ROOT, "src/css/motion.css"), "utf8");
    const gate = css.indexOf("@media (prefers-reduced-motion: no-preference)");
    expect(gate).toBeGreaterThan(0);
    expect(css.slice(0, gate).replace(/\/\*[\s\S]*?\*\//g, "")).not.toMatch(/\b(animation|transition)\s*:/);
    for (const [, selector] of css.slice(gate).matchAll(/([^{}]+)\{[^{}]*\b(?:animation|transition)\s*:/g))
      expect(selector).toContain(':root:not([data-motion="reduced"])');
  });
});

function Nav({ active }: { active: string }) {
  return (
    <nav>
      <NavIndicator />
      {["a", "b"].map((id) => (
        <a key={id} href={`#${id}`} aria-current={active === id ? "page" : undefined}>
          {id}
        </a>
      ))}
    </nav>
  );
}
