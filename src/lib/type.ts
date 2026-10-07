import { useEffect, useState } from "react";
import type { FontChoice } from "./fonts.js";

/**
 * Type sizes per platform and the system's text size (docs/typography.md).
 *
 * Every size token is `points × optical × scale`:
 *
 * - **points:** the platform's own scale, in the system font's points (`TEXT_POINTS`, `ROLE_POINTS`):
 *   macOS after the HIG (body 13), iOS and iPadOS after Dynamic Type at its default "Large" (body
 *   17), Android after Material 3 (body large 16), Windows and Linux the suite's desktop scale (body
 *   14, Fluent's).
 * - **optical:** the system font's x-height over the interface font's (`opticalFactor`). UwU Sans
 *   is smaller on the line than SF Pro or Roboto, so 13 pt of SF are about 13.8 px of UwU Sans; the
 *   text then looks as large as the system's.
 * - **scale:** the system's text size (Dynamic Type) times the app's own setting
 *   (Darstellung → Textgröße, `TEXT_SIZE_CHOICES`).
 *
 * The CSS lives in tokens.css (`<html data-type>`, `--uwu-type-optical`, `--uwu-type-scale`);
 * `applyType` and `useTypeScale` set them. Without them an app keeps the desktop scale.
 */

/** Which scale applies. `desktop` is Windows and Linux. */
export type TypePlatform = "desktop" | "macos" | "ios" | "android";
export const TYPE_PLATFORMS = ["desktop", "macos", "ios", "android"] as const satisfies readonly TypePlatform[];

/** The suite's size tokens (`--uwu-text-*`, Tailwind `text-*`), from small to large. */
export const TEXT_TOKENS = ["badge", "caption", "meta", "body", "reading", "section", "title", "large"] as const;
export type TextToken = (typeof TEXT_TOKENS)[number];

/** The platform roles (`--uwu-type-*`), named after Apple's text styles; Android maps onto them. */
export const TYPE_ROLES = [
  "caption2",
  "caption1",
  "footnote",
  "subheadline",
  "callout",
  "body",
  "headline",
  "title3",
  "title2",
  "title1",
  "large-title",
] as const;
export type TypeRole = (typeof TYPE_ROLES)[number];

/** The size tokens in each platform's points, before the optical factor and the text size. */
export const TEXT_POINTS: Record<TypePlatform, Record<TextToken, number>> = {
  // Windows and Linux: the suite's desktop scale (body 14 like Fluent), unchanged since 1.0.
  desktop: { badge: 11, caption: 12, meta: 13, body: 14, reading: 16, section: 18, title: 22, large: 28 },
  // macOS HIG: caption 10, subheadline 11, callout 12, body 13, title3 15, title2 17, title1 22, large 26.
  macos: { badge: 10, caption: 11, meta: 12, body: 13, reading: 15, section: 17, title: 22, large: 26 },
  // iOS and iPadOS, Dynamic Type "Large": caption2 11, footnote 13, subheadline 15, body 17, title3 20, title1 28, large 34.
  ios: { badge: 11, caption: 13, meta: 15, body: 17, reading: 17, section: 20, title: 28, large: 34 },
  // Material 3: label small 11, body small 12, body medium 14, body large 16, title large 22, headline small 24, headline large 32.
  android: { badge: 11, caption: 12, meta: 14, body: 16, reading: 16, section: 22, title: 24, large: 32 },
};

/** The roles in each platform's points. Android: the nearest Material 3 role (docs/typography.md). */
export const ROLE_POINTS: Record<TypePlatform, Record<TypeRole, number>> = {
  desktop: {
    caption2: 11,
    caption1: 12,
    footnote: 12,
    subheadline: 13,
    callout: 13,
    body: 14,
    headline: 14,
    title3: 16,
    title2: 18,
    title1: 22,
    "large-title": 28,
  },
  macos: {
    caption2: 10,
    caption1: 10,
    footnote: 10,
    subheadline: 11,
    callout: 12,
    body: 13,
    headline: 13,
    title3: 15,
    title2: 17,
    title1: 22,
    "large-title": 26,
  },
  ios: {
    caption2: 11,
    caption1: 12,
    footnote: 13,
    subheadline: 15,
    callout: 16,
    body: 17,
    headline: 17,
    title3: 20,
    title2: 22,
    title1: 28,
    "large-title": 34,
  },
  android: {
    caption2: 11, // label small
    caption1: 12, // label medium
    footnote: 12, // body small
    subheadline: 14, // label large
    callout: 14, // body medium
    body: 16, // body large
    headline: 16, // title medium
    title3: 18, // between title medium and title large (steppers)
    title2: 22, // title large
    title1: 24, // headline small
    "large-title": 32, // headline large
  },
};

/** The system font's x-height per em, which the interface font is matched to. */
export const SYSTEM_X_HEIGHT: Record<TypePlatform, number> = {
  desktop: 0.496, // the desktop scale was set with UwU Sans; Segoe UI is 0.500
  macos: 0.526, // SF Pro
  ios: 0.526, // SF Pro
  android: 0.528, // Roboto
};

/** Each picker font's x-height per em (measured from the shipped files). The system font is the reference. */
export const FONT_X_HEIGHT: Record<Exclude<FontChoice, "system">, number> = {
  uwu: 0.496,
  manrope: 0.54,
  rubik: 0.52,
  dmsans: 0.504,
};

/** How much larger the interface font is set so it looks as large as the system font. */
export function opticalFactor(platform: TypePlatform, font: FontChoice = "uwu"): number {
  if (font === "system") return 1;
  return Math.round((SYSTEM_X_HEIGHT[platform] / FONT_X_HEIGHT[font]) * 1000) / 1000;
}

/** Darstellung → Textgröße. "system" follows the system alone; the others scale on top of it. */
export const TEXT_SIZE_CHOICES = ["smaller", "system", "larger", "largest"] as const;
export type TextSizeChoice = (typeof TEXT_SIZE_CHOICES)[number];

export const TEXT_SIZE_FACTORS: Record<TextSizeChoice, number> = {
  smaller: 0.9,
  system: 1,
  larger: 1.15,
  largest: 1.3,
};

/** What the setting is called, as a segmented control's options. */
export const TEXT_SIZE_LABELS: Record<"de" | "en", Record<TextSizeChoice, string>> = {
  de: { smaller: "Kleiner", system: "System", larger: "Größer", largest: "Sehr groß" },
  en: { smaller: "Smaller", system: "System", larger: "Larger", largest: "Largest" },
};

export function isTextSizeChoice(value: unknown): value is TextSizeChoice {
  return (TEXT_SIZE_CHOICES as readonly unknown[]).includes(value);
}

/** The system's body size at its default text size: what `-apple-system-body` gives with no change. */
export const SYSTEM_BODY_DEFAULT: Partial<Record<TypePlatform, number>> = { ios: 17, macos: 13 };

/** The scale never goes past these, whatever the system reports. */
export const MIN_TYPE_SCALE = 0.75;
export const MAX_TYPE_SCALE = 3.2;

const clampScale = (value: number) => Math.min(MAX_TYPE_SCALE, Math.max(MIN_TYPE_SCALE, value));

/**
 * The system's text size as a factor, from the body size the engine reports (`measureSystemBody`).
 * iOS: Dynamic Type, xSmall 14 → 0.82 … AX5 53 → 3.12. macOS: 1 unless the system enlarges body
 * text. Elsewhere (and when nothing could be measured) 1.
 */
export function systemTextScale(platform: TypePlatform, bodyPx: number | null | undefined): number {
  const base = SYSTEM_BODY_DEFAULT[platform];
  if (!base || !bodyPx || !Number.isFinite(bodyPx) || bodyPx < 8 || bodyPx > 80) return 1;
  return Math.round(clampScale(bodyPx / base) * 1000) / 1000;
}

export interface TypeSettings {
  platform: TypePlatform;
  font?: FontChoice;
  textSize?: TextSizeChoice;
  /** The system's text size from `systemTextScale`. */
  systemScale?: number;
  /**
   * Whether the engine already enlarges text by the system's size itself. Android's WebView does:
   * it applies the system font size as text zoom to every font size, so the page must not again.
   */
  engineScales?: boolean;
}

export interface ResolvedType {
  platform: TypePlatform;
  optical: number;
  /** `--uwu-type-scale`: the system's size (unless the engine applies it) times the app's setting. */
  scale: number;
}

export function resolveType({
  platform,
  font = "uwu",
  textSize = "system",
  systemScale = 1,
  engineScales = false,
}: TypeSettings): ResolvedType {
  const system = engineScales ? 1 : systemScale;
  return {
    platform,
    optical: opticalFactor(platform, font),
    scale: Math.round(clampScale(system * TEXT_SIZE_FACTORS[textSize]) * 1000) / 1000,
  };
}

/** A token's size in CSS pixels, as tokens.css computes it. */
export function tokenSize(token: TextToken, { platform, optical, scale }: ResolvedType): number {
  return TEXT_POINTS[platform][token] * optical * scale;
}

/** A role's size in CSS pixels, as tokens.css computes it. */
export function roleSize(role: TypeRole, { platform, optical, scale }: ResolvedType): number {
  return ROLE_POINTS[platform][role] * optical * scale;
}

export interface TypePlatformSignals {
  userAgent: string;
  maxTouchPoints?: number;
  /**
   * The platform the app was built for, when the page can't tell: an iPhone/iPad app running on a
   * Mac ("Designed for iPad") says "Macintosh" without touch, but macOS shows it at 77 %, so it needs
   * the iOS sizes. Tauri apps pass `TAURI_ENV_PLATFORM` from their build.
   */
  build?: string;
}

export function detectTypePlatform({ userAgent, maxTouchPoints = 0, build }: TypePlatformSignals): TypePlatform {
  if (build === "ios") return "ios";
  if (build === "android") return "android";
  if (/Android/i.test(userAgent)) return "android";
  if (/iPhone|iPad|iPod/i.test(userAgent)) return "ios";
  if (/Macintosh|Mac OS X/i.test(userAgent)) return maxTouchPoints > 1 ? "ios" : "macos";
  return "desktop";
}

/** The platform of this page from `navigator`; `desktop` outside a browser. */
export function currentTypePlatform(build?: string): TypePlatform {
  if (typeof navigator === "undefined") return "desktop";
  return detectTypePlatform({ userAgent: navigator.userAgent, maxTouchPoints: navigator.maxTouchPoints ?? 0, build });
}

/** Writes the scale onto <html>: `data-type`, `--uwu-type-optical`, `--uwu-type-scale`. */
export function applyType({ platform, optical, scale }: ResolvedType, root: HTMLElement = document.documentElement) {
  root.dataset.type = platform;
  root.style.setProperty("--uwu-type-optical", String(optical));
  root.style.setProperty("--uwu-type-scale", String(scale));
}

function probe(style: Partial<CSSStyleDeclaration>, read: (element: HTMLElement) => number): number | null {
  if (typeof document === "undefined" || !document.body) return null;
  const element = document.createElement("span");
  element.setAttribute("aria-hidden", "true");
  element.textContent = "x";
  Object.assign(element.style, {
    position: "absolute",
    visibility: "hidden",
    pointerEvents: "none",
    left: "-9999px",
    top: "0",
    whiteSpace: "nowrap",
    ...style,
  });
  document.body.appendChild(element);
  try {
    const value = read(element);
    return Number.isFinite(value) && value > 0 ? value : null;
  } finally {
    element.remove();
  }
}

/**
 * The body size of the system's text style in WebKit (`font: -apple-system-body`): Dynamic Type on
 * iOS and iPadOS, the system's body size on macOS. `null` where the engine doesn't know the style.
 */
export function measureSystemBody(): number | null {
  // A 1 px sentinel: where the engine doesn't know the keyword it drops the declaration, and the
  // probe stays at 1 px. (CSS.supports isn't asked: engines disagree on system font keywords.)
  return probe({ fontSize: "1px" }, (element) => {
    element.style.font = "-apple-system-body";
    const size = parseFloat(getComputedStyle(element).fontSize);
    return size > 1 ? size : Number.NaN;
  });
}

/**
 * How much the engine enlarges a 100 px font on its own: Android's WebView applies the system font
 * size as text zoom. 1 where nothing is enlarged.
 */
export function measureEngineTextZoom(): number {
  const height = probe(
    { fontSize: "100px", lineHeight: "1", fontFamily: "monospace" },
    (element) => element.getBoundingClientRect().height,
  );
  if (!height) return 1;
  const zoom = Math.round((height / 100) * 100) / 100;
  return zoom >= 0.5 && zoom <= 4 ? zoom : 1;
}

/** What the system says right now: its text size, and whether the engine applies it itself. */
export function readSystemType(platform: TypePlatform): { systemScale: number; engineScales: boolean } {
  if (platform === "android") {
    const zoom = measureEngineTextZoom();
    return { systemScale: zoom, engineScales: true };
  }
  if (platform === "ios" || platform === "macos") {
    return { systemScale: systemTextScale(platform, measureSystemBody()), engineScales: false };
  }
  return { systemScale: 1, engineScales: false };
}

export interface UseTypeScaleOptions {
  /** Leave it out to detect it from the page (`currentTypePlatform`). */
  platform?: TypePlatform;
  font?: FontChoice;
  textSize?: TextSizeChoice;
}

/**
 * Keeps <html> on the platform's scale and the system's text size. It reads the system again when
 * the app comes back to the front (the person changed the text size in the system settings) and
 * when the window changes size.
 */
export function useTypeScale({ platform, font = "uwu", textSize = "system" }: UseTypeScaleOptions = {}) {
  const target = platform ?? currentTypePlatform();
  const [system, setSystem] = useState(() => readSystemType(target));

  useEffect(() => {
    const read = () => {
      const next = readSystemType(target);
      setSystem((current) =>
        current.systemScale === next.systemScale && current.engineScales === next.engineScales ? current : next,
      );
    };
    read();
    const onVisible = () => {
      if (document.visibilityState === "visible") read();
    };
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", read);
    window.addEventListener("resize", read);
    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", read);
      window.removeEventListener("resize", read);
    };
  }, [target]);

  const resolved = resolveType({ platform: target, font, textSize, ...system });
  useEffect(() => {
    applyType(resolved);
  }, [resolved.platform, resolved.optical, resolved.scale]); // eslint-disable-line react-hooks/exhaustive-deps
  return { ...resolved, systemScale: system.systemScale };
}
