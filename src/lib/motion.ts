/**
 * Shared motion helpers (docs/motion.md): the circle reveal and the motion check for
 * JS-driven animation. CSS-only motion (page change, stagger) lives in motion.css.
 */

/** True when animations may run: no reduced-motion preference and no `data-motion="reduced"`. Same rule as the CSS. */
export function motionAllowed(): boolean {
  if (typeof document === "undefined") return false;
  if (document.documentElement.dataset.motion === "reduced") return false;
  return !(typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
}

/** A token like `--uwu-duration-count` in ms (fallback when the CSS isn't loaded, e.g. in tests). */
export function tokenMs(name: string, fallback: number): number {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const ms = raw.endsWith("ms") ? parseFloat(raw) : raw.endsWith("s") ? parseFloat(raw) * 1000 : NaN;
  return Number.isFinite(ms) ? ms : fallback;
}

let revealing = 0; // overlapping reveals share the backdrop class

export type RevealOrigin = Element | { x: number; y: number } | null | undefined;

/**
 * Uncovers `target` with a growing circle from `origin` (an element's centre, a point, or
 * the first `[data-uwu-reveal-origin]`, else the target's centre). The page behind shows
 * `--uwu-reveal-backdrop` while it runs. Does nothing under reduced motion. Never blocks input.
 */
export function revealFrom(target: HTMLElement, origin?: RevealOrigin): Animation | undefined {
  if (!motionAllowed() || typeof target.animate !== "function") return undefined;
  const from = origin ?? document.querySelector("[data-uwu-reveal-origin]");
  const box = target.getBoundingClientRect();
  let x = box.width / 2;
  let y = box.height / 2;
  if (from instanceof Element) {
    const o = from.getBoundingClientRect();
    x = o.left + o.width / 2 - box.left;
    y = o.top + o.height / 2 - box.top;
  } else if (from) {
    x = from.x - box.left;
    y = from.y - box.top;
  }
  // Radius to the farthest corner, so the circle ends exactly when everything is uncovered.
  const r = Math.ceil(Math.hypot(Math.max(x, box.width - x), Math.max(y, box.height - y)));
  const root = document.documentElement;
  revealing++;
  root.classList.add("uwu-revealing");
  const animation = target.animate(
    [{ clipPath: `circle(0px at ${x}px ${y}px)` }, { clipPath: `circle(${r}px at ${x}px ${y}px)` }],
    { duration: tokenMs("--uwu-duration-reveal", 480), easing: "cubic-bezier(0.2, 0.9, 0.3, 1)" },
  );
  const done = () => {
    if (--revealing === 0) root.classList.remove("uwu-revealing");
  };
  animation.finished.then(done, done);
  return animation;
}
