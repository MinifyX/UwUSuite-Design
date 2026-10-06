/**
 * Which mobile design an app shows (docs/mobile.md). One webview app runs on the desktop, on
 * iPhones, iPads and Android phones; the layout follows the device, not only the width:
 *
 * - `phone-ios` / `phone-android`: narrower than 700 px with touch.
 * - `ipad`: iPadOS with touch and 700 px or more. iPadOS reports itself as a Mac ("Macintosh" with
 *   touch points), so touch decides.
 * - `desktop`: everything else, including a narrow desktop window (that keeps the desktop layout
 *   with the `phone:` variant).
 */
export type DeviceKind = "phone-ios" | "phone-android" | "ipad" | "desktop";

/** The platform a mobile component draws for. */
export type MobilePlatform = "ios" | "android" | "ipad";

/** Below this width a touch device is a phone. The same line as Tailwind's `phone:` variant. */
export const PHONE_MAX_WIDTH = 700;

export interface DeviceSignals {
  userAgent: string;
  /** The layout width in CSS pixels (`window.innerWidth`). */
  width: number;
  /** `navigator.maxTouchPoints`. */
  maxTouchPoints: number;
  /** `matchMedia("(pointer: coarse)").matches`, when known. */
  coarsePointer?: boolean;
}

export function detectDeviceKind({ userAgent, width, maxTouchPoints, coarsePointer }: DeviceSignals): DeviceKind {
  const touch = maxTouchPoints > 0 || coarsePointer === true;
  if (!touch) return "desktop";
  const android = /Android/i.test(userAgent);
  const apple = /iPhone|iPad|iPod/i.test(userAgent) || (/Macintosh/i.test(userAgent) && maxTouchPoints > 1);
  if (android) return width < PHONE_MAX_WIDTH ? "phone-android" : "desktop";
  if (apple) return width < PHONE_MAX_WIDTH ? "phone-ios" : "ipad";
  return "desktop";
}

/** The current device from `window` and `navigator`; `desktop` outside a browser. */
export function currentDeviceKind(): DeviceKind {
  if (typeof window === "undefined" || typeof navigator === "undefined") return "desktop";
  return detectDeviceKind({
    userAgent: navigator.userAgent,
    width: window.innerWidth,
    maxTouchPoints: navigator.maxTouchPoints ?? 0,
    coarsePointer: window.matchMedia?.("(pointer: coarse)").matches,
  });
}

/** The platform look for a device kind; `null` on the desktop. */
export function platformOf(kind: DeviceKind): MobilePlatform | null {
  if (kind === "phone-ios") return "ios";
  if (kind === "phone-android") return "android";
  if (kind === "ipad") return "ipad";
  return null;
}
