/**
 * The gesture math of the mobile patterns, as pure functions (docs/mobile.md). The hooks and
 * components only feed pointer positions in and apply what comes out, so every threshold is
 * tested without a browser. The numbers come from the approved UwULock prototype.
 */

/** Movement below this many pixels is still a tap (and still allows a long press). */
export const TAP_SLOP = 8;
/** A press held this long without moving opens the context menu. */
export const LONG_PRESS_MS = 480;
/** Edge swipes start within this many pixels of the screen edge. */
export const EDGE_WIDTH = 26;
/** iOS: an edge swipe further than this goes back when released. */
export const IOS_BACK_DISTANCE = 110;
/** iOS: a quick flick (px/ms) goes back after a shorter way. */
export const IOS_BACK_VELOCITY = 0.5;
export const IOS_BACK_MIN_FLICK = 30;
/** Android predictive back: the share of the screen width after which releasing goes back. */
export const ANDROID_BACK_PROGRESS = 0.28;
/** A row swipe further than this opens the actions when released. */
export const SWIPE_OPEN_THRESHOLD = 70;
/** How far a row follows the finger past its actions. */
export const SWIPE_OVERSHOOT = 40;
/** Pull to refresh: the most the content follows the finger, and how fast it gets stiff. */
export const PULL_MAX = 120;
export const PULL_RESISTANCE = 200;
/** Pulled this far, releasing refreshes. */
export const PULL_ARM_DISTANCE = 66;
/** The width of one swipe action button. */
export const SWIPE_ACTION_WIDTH = 76;

export type Axis = "pending" | "horizontal" | "vertical";

/** Which way a drag goes once it left the tap slop. Horizontal needs a clear lead (`bias`). */
export function dragAxis(dx: number, dy: number, bias = 1.2): Axis {
  if (Math.hypot(dx, dy) < TAP_SLOP) return "pending";
  return Math.abs(dx) > Math.abs(dy) * bias ? "horizontal" : "vertical";
}

export type BackPlatform = "ios" | "android";
export type Edge = "left" | "right";

/**
 * The edge a back swipe starts from, or null. iOS goes back only from the left edge; Android's
 * predictive back works from both.
 */
export function backEdge(platform: BackPlatform, startX: number, width: number, dx: number): Edge | null {
  if (startX <= EDGE_WIDTH && dx > 0) return "left";
  if (platform === "android" && startX >= width - EDGE_WIDTH && dx < 0) return "right";
  return null;
}

/** 0…1: how far a back swipe got across the screen. */
export function backProgress(dx: number, width: number, edge: Edge): number {
  const towards = edge === "left" ? dx : -dx;
  return Math.min(1, Math.max(0, towards / Math.max(1, width)));
}

/** Whether releasing a back swipe goes back. `velocity` is px/ms away from the edge. */
export function shouldGoBack(platform: BackPlatform, distance: number, width: number, velocity = 0): boolean {
  if (platform === "android") return distance / Math.max(1, width) > ANDROID_BACK_PROGRESS;
  return distance > IOS_BACK_DISTANCE || (velocity > IOS_BACK_VELOCITY && distance > IOS_BACK_MIN_FLICK);
}

/**
 * How the leaving page looks during a back swipe. iOS: the page follows the finger and the one
 * below slides in from -30 %. Android (predictive back): the page shrinks to 86 % and drifts 40 px
 * towards the finger.
 */
export function backTransform(
  platform: BackPlatform,
  dx: number,
  width: number,
  edge: Edge,
): { page: string; under: string } {
  const progress = backProgress(dx, width, edge);
  if (platform === "android") {
    const sign = edge === "left" ? 1 : -1;
    return {
      page: `translateX(${round(sign * progress * 40)}px) scale(${round(1 - progress * 0.14)})`,
      under: "none",
    };
  }
  const x = Math.max(0, dx);
  return { page: `translateX(${round(x)}px)`, under: `translateX(${round(-30 + progress * 30)}%)` };
}

export interface SwipeWidths {
  /** Width of the actions revealed by swiping right (leading, e.g. "favourite"). */
  leading: number;
  /** Width of the actions revealed by swiping left (trailing, e.g. "delete"). */
  trailing: number;
}

export type SwipeState = "closed" | "leading" | "trailing";

/** The row's offset while the finger moves: it follows, a little past the actions at most. */
export function swipeOffset(base: number, dx: number, widths: SwipeWidths): number {
  const min = widths.trailing > 0 ? -widths.trailing - SWIPE_OVERSHOOT : 0;
  const max = widths.leading > 0 ? widths.leading + SWIPE_OVERSHOOT : 0;
  return Math.min(max, Math.max(min, base + dx));
}

/** Where a row settles when the finger lifts. */
export function swipeSettle(offset: number, widths: SwipeWidths): SwipeState {
  if (offset < -SWIPE_OPEN_THRESHOLD && widths.trailing > 0) return "trailing";
  if (offset > SWIPE_OPEN_THRESHOLD && widths.leading > 0) return "leading";
  return "closed";
}

/** The resting offset of a state. */
export function swipeRest(state: SwipeState, widths: SwipeWidths): number {
  if (state === "trailing") return -widths.trailing;
  if (state === "leading") return widths.leading;
  return 0;
}

/** Pull to refresh: the content follows the finger with growing resistance, never past PULL_MAX. */
export function pullDistance(dy: number): number {
  return PULL_MAX * (1 - Math.exp(-Math.max(0, dy) / PULL_RESISTANCE));
}

export function pullArmed(distance: number): boolean {
  return distance > PULL_ARM_DISTANCE;
}

export type Detent = "medium" | "large";

/**
 * A sheet's height for a detent: `large` leaves the status bar and a strip of the page above it
 * visible, `medium` takes about half the screen.
 */
export function detentHeight(detent: Detent, viewport: number, topInset = 0): number {
  if (detent === "large") return Math.max(0, viewport - topInset - 10);
  return Math.round(viewport * 0.56);
}

/**
 * Where a sheet goes when its grabber is let go after dragging `dy` px (down is positive) at
 * `velocity` px/ms: the next detent, or `null` to close.
 */
export function settleSheet(
  current: Detent,
  detents: readonly Detent[],
  dy: number,
  height: number,
  velocity = 0,
): Detent | null {
  const flick = Math.abs(velocity) > 0.6;
  const far = Math.abs(dy) > height * 0.25;
  if (!flick && !far) return current;
  if (dy > 0) {
    if (current === "large" && detents.includes("medium")) return "medium";
    return null;
  }
  if (current === "medium" && detents.includes("large")) return "large";
  return current;
}

/**
 * The space the on-screen keyboard takes at the bottom of the layout viewport: the difference
 * between the window and the visual viewport (iOS shrinks only the visual one).
 */
export function keyboardInset(innerHeight: number, viewportHeight: number, viewportOffsetTop = 0): number {
  return Math.max(0, Math.round(innerHeight - viewportHeight - viewportOffsetTop));
}

export interface VisibleArea {
  /** How far the visible part starts below the top of the page (iOS scrolls to the field). */
  top: number;
  height: number;
  /** How much of the window the on-screen keyboard covers, 0 when it is closed. */
  keyboard: number;
}

/**
 * The part of the page the user sees, measured from the top of the shell's container (`top`, in
 * the layout viewport like `getBoundingClientRect`). iOS keeps the layout viewport when the
 * keyboard comes up: it shrinks the visual viewport and moves it down until the focused field
 * shows, which pushes a full-screen layout out at the top. `MobileShell` follows this area instead
 * (moved down by `top`, `height` tall), so its top stays visible and the bottom bar sits on the
 * keyboard.
 */
export function visibleArea(
  innerHeight: number,
  viewportHeight: number,
  viewportOffsetTop = 0,
  containerTop = 0,
): VisibleArea {
  return {
    top: Math.max(0, Math.round(viewportOffsetTop - containerTop)),
    height: Math.round(viewportHeight),
    keyboard: Math.max(0, Math.round(innerHeight - viewportHeight)),
  };
}

/** Steppers: the next value, inside min…max. */
export function stepValue(value: number, delta: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value + delta));
}

function round(value: number) {
  return Math.round(value * 1000) / 1000;
}
