import { useEffect, useSyncExternalStore } from "react";

/**
 * Theme, contrast and motion. Every app has the same three settings (docs/color.md, motion.md):
 *
 *   Darstellung → Design:     System · Hell · Dunkel        → <html data-theme="light|dark">
 *   Darstellung → Kontrast:   System · Normal · Hoch        → <html data-contrast="normal|high">
 *   Darstellung → Animationen: System · An · Aus           → <html data-motion="full|reduced">
 *
 * "System" follows prefers-color-scheme, prefers-contrast and prefers-reduced-motion.
 */

export type ThemeSetting = "system" | "light" | "dark";
export type ContrastSetting = "system" | "normal" | "high";
export type MotionSetting = "system" | "on" | "off";

export interface Appearance {
  theme: ThemeSetting;
  contrast?: ContrastSetting;
  motion?: MotionSetting;
}

export interface ResolvedAppearance {
  theme: "light" | "dark";
  contrast: "normal" | "high";
  motion: "full" | "reduced";
}

export const QUERIES = {
  dark: "(prefers-color-scheme: dark)",
  contrast: "(prefers-contrast: more)",
  reducedMotion: "(prefers-reduced-motion: reduce)",
} as const;

function matches(query: string) {
  return typeof window !== "undefined" && typeof window.matchMedia === "function" && window.matchMedia(query).matches;
}

/** What the settings mean on this device right now. */
export function resolveAppearance(
  { theme, contrast = "system", motion = "system" }: Appearance,
  system = {
    dark: matches(QUERIES.dark),
    contrast: matches(QUERIES.contrast),
    reducedMotion: matches(QUERIES.reducedMotion),
  },
): ResolvedAppearance {
  return {
    theme: theme === "system" ? (system.dark ? "dark" : "light") : theme,
    contrast: contrast === "system" ? (system.contrast ? "high" : "normal") : contrast,
    motion: motion === "system" ? (system.reducedMotion ? "reduced" : "full") : motion === "on" ? "full" : "reduced",
  };
}

/** Writes the resolved appearance onto <html>, where the styles switch. */
export function applyAppearance(resolved: ResolvedAppearance, root: HTMLElement = document.documentElement) {
  root.dataset.theme = resolved.theme;
  root.dataset.contrast = resolved.contrast;
  root.dataset.motion = resolved.motion;
}

function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (callback) => {
      if (typeof window === "undefined" || typeof window.matchMedia !== "function") return () => {};
      const media = window.matchMedia(query);
      media.addEventListener("change", callback);
      return () => media.removeEventListener("change", callback);
    },
    () => matches(query),
    () => false,
  );
}

/** Resolves the settings against the system and keeps <html> in sync, also when the system changes. */
export function useAppearance(settings: Appearance): ResolvedAppearance {
  const dark = useMediaQuery(QUERIES.dark);
  const contrast = useMediaQuery(QUERIES.contrast);
  const reducedMotion = useMediaQuery(QUERIES.reducedMotion);
  const resolved = resolveAppearance(settings, { dark, contrast, reducedMotion });
  useEffect(() => {
    applyAppearance(resolved);
  }, [resolved.theme, resolved.contrast, resolved.motion]); // eslint-disable-line react-hooks/exhaustive-deps
  return resolved;
}

/**
 * A snippet for index.html's <head>, run before the first paint so a dark app never flashes white.
 * `key` is the localStorage key holding the app's settings JSON with `theme`, `contrast`, `motion`.
 */
export function bootScript(key: string) {
  return `(function(){try{var s=JSON.parse(localStorage.getItem(${JSON.stringify(key)})||"{}");var m=function(q){return matchMedia(q).matches};var r=document.documentElement;var t=s.theme||"system";r.dataset.theme=t==="system"?(m("${QUERIES.dark}")?"dark":"light"):t;var c=s.contrast||"system";r.dataset.contrast=c==="system"?(m("${QUERIES.contrast}")?"high":"normal"):c;var o=s.motion||"system";r.dataset.motion=o==="system"?(m("${QUERIES.reducedMotion}")?"reduced":"full"):(o==="on"?"full":"reduced")}catch(e){}})();`;
}
