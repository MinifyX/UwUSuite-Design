import { useMemo } from "react";

/**
 * Haptic feedback for the mobile apps (docs/mobile.md):
 *
 * - `selection`: a stepper step, a switch, a chosen tab, a pull that arms.
 * - `light` / `medium`: a long press that opens a menu, a swipe that commits.
 * - `success` / `warning` / `error`: copied, saved, failed.
 *
 * Inside a Tauri mobile app with `tauri-plugin-haptics` (permissions: see docs/mobile.md) it uses the
 * plugin, which reaches the Taptic Engine on iOS. Without the plugin, Android falls back to
 * `navigator.vibrate`. The desktop and iOS Safari do nothing. It never throws.
 */
export type HapticKind = "selection" | "light" | "medium" | "heavy" | "success" | "warning" | "error";

type Invoke = (cmd: string, args?: Record<string, unknown>) => Promise<unknown>;

/** Tauri's IPC without importing @tauri-apps/api, so the main entry stays free of it. */
function tauriInvoke(): Invoke | null {
  const internals = (globalThis as { __TAURI_INTERNALS__?: { invoke?: Invoke } }).__TAURI_INTERNALS__;
  return typeof internals?.invoke === "function" ? internals.invoke : null;
}

const VIBRATE_MS: Record<HapticKind, number | number[]> = {
  selection: 8,
  light: 10,
  medium: 14,
  heavy: 22,
  success: [10, 40, 14],
  warning: [16, 60, 16],
  error: [20, 50, 20, 50, 20],
};

/** The plugin command and arguments for a kind. */
export function hapticCommand(kind: HapticKind): [string, Record<string, unknown>] {
  if (kind === "selection") return ["plugin:haptics|selection_feedback", {}];
  if (kind === "success" || kind === "warning" || kind === "error")
    return ["plugin:haptics|notification_feedback", { type: kind }];
  return ["plugin:haptics|impact_feedback", { style: kind }];
}

let pluginMissing = false;
let hapticsOn = true;

/** The app's "Haptisches Feedback" setting; the components' own ticks follow it too. */
export function setHapticsEnabled(enabled: boolean): void {
  hapticsOn = enabled;
}

function vibrate(kind: HapticKind) {
  try {
    if (typeof navigator !== "undefined" && /Android/i.test(navigator.userAgent)) navigator.vibrate?.(VIBRATE_MS[kind]);
  } catch {
    // Some webviews throw without a user gesture; feedback is never worth an error.
  }
}

/** One haptic tap. Fire and forget. */
export function haptic(kind: HapticKind = "light"): void {
  if (!hapticsOn) return;
  const invoke = pluginMissing ? null : tauriInvoke();
  if (!invoke) {
    vibrate(kind);
    return;
  }
  const [cmd, args] = hapticCommand(kind);
  invoke(cmd, args).catch(() => {
    // No plugin (or no permission): remember it and fall back for the rest of the session.
    pluginMissing = true;
    vibrate(kind);
  });
}

/** `const tap = useHaptics(); tap("success")`. `enabled: false` (a setting) turns it off. */
export function useHaptics({ enabled = true }: { enabled?: boolean } = {}): (kind?: HapticKind) => void {
  return useMemo(() => (enabled ? haptic : () => {}), [enabled]);
}
