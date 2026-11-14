import { clsx } from "clsx";
import { useLayoutEffect, useRef } from "react";

const ACTIVE = '[aria-current="page"], [aria-current="true"], [aria-selected="true"]';

export interface NavIndicatorProps {
  /** The pill's colour. Default `bg-pink-tint`, the suite's active row. */
  className?: string;
}

/**
 * Put it inside a nav (as a child of the nav or a div, not directly in a `<ul>`). It draws the
 * active row's background as one pill that slides to the first item with `aria-current` or
 * `aria-selected="true"`; that row's own background goes transparent while it is there, so give
 * the pill the row's colour (`className`) if the row isn't the default tint. Without motion it jumps.
 */
export function NavIndicator({ className }: NavIndicatorProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const bar = ref.current;
    const nav = bar?.parentElement;
    if (!bar || !nav) return;
    nav.setAttribute("data-uwu-indicator", "");
    const sizes = typeof ResizeObserver === "function" ? new ResizeObserver(() => place()) : undefined;
    let marked: HTMLElement | null = null;

    const place = () => {
      const active = nav.querySelector<HTMLElement>(ACTIVE);
      if (active !== marked) {
        if (marked) sizes?.unobserve(marked);
        marked?.removeAttribute("data-uwu-indicated");
        if (active) sizes?.observe(active);
        active?.setAttribute("data-uwu-indicated", "");
        marked = active;
      }
      if (!active) return bar.removeAttribute("data-on");
      const n = nav.getBoundingClientRect();
      const a = active.getBoundingClientRect();
      bar.style.setProperty(
        "translate",
        `${a.left - n.left - nav.clientLeft + nav.scrollLeft}px ${a.top - n.top - nav.clientTop + nav.scrollTop}px`,
      );
      bar.style.setProperty("width", `${a.width}px`);
      bar.style.setProperty("height", `${a.height}px`);
      bar.style.setProperty("border-radius", getComputedStyle(active).borderRadius);
      bar.setAttribute("data-on", "");
    };

    place();
    // Slide only after the first placement, so it doesn't fly in from the corner.
    const frame = requestAnimationFrame(() => bar.setAttribute("data-ready", ""));
    const mutations = new MutationObserver(place);
    mutations.observe(nav, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["aria-current", "aria-selected"],
    });
    sizes?.observe(nav);
    void document.fonts?.ready.then(place); // late webfonts change the row widths
    return () => {
      cancelAnimationFrame(frame);
      mutations.disconnect();
      sizes?.disconnect();
      marked?.removeAttribute("data-uwu-indicated");
      nav.removeAttribute("data-uwu-indicator");
    };
  }, []);

  return <span ref={ref} aria-hidden="true" className={clsx("uwu-nav-indicator", className ?? "bg-pink-tint")} />;
}
