import {
  createContext,
  createElement,
  useContext,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  type RefObject,
} from "react";
import { matchesAccelerator } from "../lib/shortcuts.js";
import { currentDeviceKind, platformOf, type DeviceKind, type MobilePlatform } from "./device.js";
import {
  backEdge,
  backTransform,
  dragAxis,
  keyboardInset,
  LONG_PRESS_MS,
  shouldGoBack,
  TAP_SLOP,
  type BackPlatform,
  type Edge,
} from "./gestures.js";
import { haptic } from "./haptics.js";

// ── Device ───────────────────────────────────────────────────────────────────────────────────────

const DeviceKindContext = createContext<DeviceKind | null>(null);

/**
 * Pins the device kind for everything below, e.g. the styleguide's frames or a test. Apps
 * normally leave it out and let `useDeviceKind()` detect it.
 */
export function DeviceKindProvider({ kind, children }: { kind: DeviceKind; children: ReactNode }) {
  return createElement(DeviceKindContext.Provider, { value: kind }, children);
}

function subscribeResize(listener: () => void) {
  window.addEventListener("resize", listener);
  window.addEventListener("orientationchange", listener);
  return () => {
    window.removeEventListener("resize", listener);
    window.removeEventListener("orientationchange", listener);
  };
}

/**
 * 'phone-ios' | 'phone-android' | 'ipad' | 'desktop'. Follows rotation and window size (an iPad
 * in Split View narrower than 700 px becomes a phone layout).
 */
export function useDeviceKind(): DeviceKind {
  const pinned = useContext(DeviceKindContext);
  const detected = useSyncExternalStore(
    pinned ? noopSubscribe : subscribeResize,
    currentDeviceKind,
    () => "desktop" as const,
  );
  return pinned ?? detected;
}

const noopSubscribe = () => () => {};

/** The platform look a mobile component draws: its `platform` prop, else the device's. */
export function useMobilePlatform(explicit?: MobilePlatform): MobilePlatform {
  const kind = useDeviceKind();
  return explicit ?? platformOf(kind) ?? "ios";
}

// ── Motion ───────────────────────────────────────────────────────────────────────────────────────

/** True when animations are off: the app's setting (`data-motion`) or the system's. */
export function prefersReducedMotion(): boolean {
  if (typeof document === "undefined") return false;
  const setting = document.documentElement.dataset.motion;
  if (setting) return setting === "reduced";
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
}

// ── Keyboard ─────────────────────────────────────────────────────────────────────────────────────

/**
 * How many pixels the on-screen keyboard covers at the bottom (0 when it is closed). iOS keeps the
 * layout viewport and only shrinks the visual viewport, so a field pinned to the bottom has to
 * rise by this much to stay above the keyboard — but only outside a `MobileShell`: the shell
 * already shrinks to the area above the keyboard (use `useKeyboardOpen()` there).
 */
export function useKeyboardInset(): number {
  const [inset, setInset] = useState(0);
  useEffect(() => {
    const viewport = typeof window === "undefined" ? undefined : window.visualViewport;
    if (!viewport) return;
    const update = () => setInset(keyboardInset(window.innerHeight, viewport.height, viewport.offsetTop));
    update();
    viewport.addEventListener("resize", update);
    viewport.addEventListener("scroll", update);
    return () => {
      viewport.removeEventListener("resize", update);
      viewport.removeEventListener("scroll", update);
    };
  }, []);
  return inset;
}

function isApple() {
  if (typeof navigator === "undefined") return false;
  return /Mac|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

/**
 * A hardware keyboard shortcut, written as a Tauri accelerator: `CmdOrCtrl+F` is ⌘F on an iPad or
 * a Mac and Ctrl+F elsewhere. iPad apps use it for ⌘F (search) and ⌘N (new); hold ⌘ on an iPad
 * and iPadOS lists the ones the app announces in its menu.
 */
export function useKeyboardShortcut(
  accelerator: string,
  handler: (event: KeyboardEvent) => void,
  { enabled = true }: { enabled?: boolean } = {},
): void {
  const latest = useRef(handler);
  useEffect(() => {
    latest.current = handler;
  });
  useEffect(() => {
    if (!enabled) return;
    const apple = isApple();
    const onKey = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.repeat) return;
      if (!matchesAccelerator(event, accelerator, apple)) return;
      event.preventDefault();
      latest.current(event);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [accelerator, enabled]);
}

// ── Long press ───────────────────────────────────────────────────────────────────────────────────

export interface LongPressPoint {
  x: number;
  y: number;
  target: HTMLElement;
}

export interface LongPressHandlers {
  onPointerDown: (event: ReactPointerEvent<HTMLElement>) => void;
  onPointerMove: (event: ReactPointerEvent<HTMLElement>) => void;
  onPointerUp: () => void;
  onPointerCancel: () => void;
  onContextMenu: (event: ReactMouseEvent<HTMLElement>) => void;
  onClickCapture: (event: ReactMouseEvent<HTMLElement>) => void;
}

/**
 * Opens a context menu on a long press (480 ms without moving), a right click or a trackpad's
 * secondary click on an iPad. Spread the handlers on the row. A long press swallows the click that
 * follows it, so the row does not also open.
 */
export function useLongPress(
  onLongPress: (point: LongPressPoint) => void,
  { enabled = true, ms = LONG_PRESS_MS }: { enabled?: boolean; ms?: number } = {},
): LongPressHandlers {
  const state = useRef<{ x: number; y: number; timer?: ReturnType<typeof setTimeout>; fired: boolean } | null>(null);
  const latest = useRef(onLongPress);
  useEffect(() => {
    latest.current = onLongPress;
  });
  const cancel = () => {
    if (state.current?.timer) clearTimeout(state.current.timer);
    if (state.current) state.current.timer = undefined;
  };
  useEffect(() => cancel, []);

  return {
    onPointerDown(event) {
      if (!enabled || (event.pointerType === "mouse" && event.button !== 0)) return;
      const target = event.currentTarget;
      const { clientX: x, clientY: y } = event;
      cancel();
      state.current = {
        x,
        y,
        fired: false,
        timer: setTimeout(() => {
          if (!state.current) return;
          state.current.fired = true;
          state.current.timer = undefined;
          haptic("medium");
          latest.current({ x, y, target });
        }, ms),
      };
    },
    onPointerMove(event) {
      const s = state.current;
      if (s?.timer && Math.hypot(event.clientX - s.x, event.clientY - s.y) >= TAP_SLOP) cancel();
    },
    onPointerUp: cancel,
    onPointerCancel: cancel,
    onContextMenu(event) {
      if (!enabled) return;
      event.preventDefault();
      // A touch long press also fires contextmenu on Android; the timer has handled it already.
      if (state.current?.fired) return;
      cancel();
      latest.current({ x: event.clientX, y: event.clientY, target: event.currentTarget });
    },
    onClickCapture(event) {
      if (state.current?.fired) {
        event.preventDefault();
        event.stopPropagation();
        state.current = null;
      }
    },
  };
}

// ── Back gestures ────────────────────────────────────────────────────────────────────────────────

export interface BackGestureOptions {
  /** Goes back (pops the page). Called after the page left the screen. */
  onBack: () => void;
  /** False on the root page, while a sheet is open or while searching. */
  enabled?: boolean;
  /** The page below, which slides in from -30 % on iOS. */
  underRef?: RefObject<HTMLElement | null>;
}

const SETTLE_MS = 300;
const SETTLE = `transform ${SETTLE_MS}ms cubic-bezier(0.2, 0.85, 0.25, 1), opacity ${SETTLE_MS}ms`;

function useBackGesture(platform: BackPlatform, ref: RefObject<HTMLElement | null>, options: BackGestureOptions) {
  const latest = useRef(options);
  useEffect(() => {
    latest.current = options;
  });
  const enabled = options.enabled ?? true;

  useEffect(() => {
    const page = ref.current;
    if (!page || !enabled) return;
    let drag: { x: number; y: number; t: number; edge: Edge | null; axis: string; dx: number; lastT: number } | null =
      null;
    let lastDx = 0;

    const reset = (el: HTMLElement | null | undefined) => {
      if (!el) return;
      el.style.transform = "";
      el.style.transition = "";
      el.style.opacity = "";
    };

    const start = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (!touch || event.touches.length > 1) return;
      drag = { x: touch.clientX, y: touch.clientY, t: event.timeStamp, edge: null, axis: "pending", dx: 0, lastT: 0 };
    };

    const move = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (!drag || !touch) return;
      const rect = page.getBoundingClientRect();
      const dx = touch.clientX - drag.x;
      const dy = touch.clientY - drag.y;
      if (drag.axis === "pending") {
        const axis = dragAxis(dx, dy, 1);
        if (axis === "pending") return;
        drag.edge = axis === "horizontal" ? backEdge(platform, drag.x - rect.left, rect.width, dx) : null;
        drag.axis = drag.edge ? "back" : "other";
        if (drag.edge) {
          page.dataset.dragging = "";
          page.style.transition = "none";
          if (latest.current.underRef?.current) latest.current.underRef.current.style.transition = "none";
        }
      }
      if (drag.axis !== "back" || !drag.edge) return;
      if (event.cancelable) event.preventDefault();
      lastDx = drag.dx;
      drag.lastT = event.timeStamp;
      drag.dx = dx;
      const look = backTransform(platform, dx, rect.width, drag.edge);
      page.style.transform = look.page;
      const under = latest.current.underRef?.current;
      if (under && platform === "ios") under.style.transform = look.under;
    };

    const end = (event: TouchEvent) => {
      const current = drag;
      drag = null;
      if (!current || current.axis !== "back" || !current.edge) return;
      delete page.dataset.dragging;
      const width = page.getBoundingClientRect().width;
      const distance = current.edge === "left" ? current.dx : -current.dx;
      const dt = Math.max(1, event.timeStamp - current.lastT);
      const velocity = ((current.edge === "left" ? 1 : -1) * (current.dx - lastDx)) / dt;
      const under = latest.current.underRef?.current;
      const go = shouldGoBack(platform, distance, width, velocity);
      if (prefersReducedMotion()) {
        reset(page);
        reset(under);
        if (go) latest.current.onBack();
        return;
      }
      page.style.transition = SETTLE;
      if (under) under.style.transition = SETTLE;
      if (go) {
        if (platform === "android") {
          const sign = current.edge === "left" ? 1 : -1;
          page.style.transform = `translateX(${sign * width * 0.5}px) scale(0.8)`;
          page.style.opacity = "0";
        } else {
          page.style.transform = "translateX(100%)";
          if (under) under.style.transform = "translateX(0)";
        }
        haptic("light");
        setTimeout(() => {
          latest.current.onBack();
          reset(page);
          reset(under);
        }, SETTLE_MS);
      } else {
        page.style.transform = "";
        if (under) under.style.transform = "";
        setTimeout(() => {
          reset(page);
          reset(under);
        }, SETTLE_MS);
      }
    };

    page.addEventListener("touchstart", start, { passive: true });
    page.addEventListener("touchmove", move, { passive: false });
    page.addEventListener("touchend", end);
    page.addEventListener("touchcancel", end);
    return () => {
      page.removeEventListener("touchstart", start);
      page.removeEventListener("touchmove", move);
      page.removeEventListener("touchend", end);
      page.removeEventListener("touchcancel", end);
    };
  }, [platform, ref, enabled]);
}

/**
 * iOS: swipe from the left edge to go back. The page follows the finger, the page below slides in
 * from the left, and letting go past 110 px (or after a flick) goes back.
 */
export function useEdgeBack(ref: RefObject<HTMLElement | null>, options: BackGestureOptions): void {
  useBackGesture("ios", ref, options);
}

/**
 * Android predictive back: swipe from either edge. The page shrinks and drifts with the finger,
 * and letting go after 28 % of the width goes back. The hardware/system back button is the app's
 * router's business (Tauri's `onBackButtonPress`), not this hook's.
 */
export function usePredictiveBack(ref: RefObject<HTMLElement | null>, options: BackGestureOptions): void {
  useBackGesture("android", ref, options);
}

// ── Scroll ───────────────────────────────────────────────────────────────────────────────────────

/** True once the scroll container moved past `offset` px: the large title has collapsed. */
export function useScrolledPast(ref: RefObject<HTMLElement | null>, offset = 8): boolean {
  const [past, setPast] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setPast(el.scrollTop > offset);
    update();
    el.addEventListener("scroll", update, { passive: true });
    return () => el.removeEventListener("scroll", update);
  }, [ref, offset]);
  return past;
}
