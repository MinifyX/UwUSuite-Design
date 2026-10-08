import { clsx } from "clsx";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";
import { platformOf, type DeviceKind } from "./device.js";
import { visibleArea, type VisibleArea } from "./gestures.js";
import { DeviceKindProvider, prefersReducedMotion, useDeviceKind } from "./hooks.js";

const ShellContext = createContext<HTMLElement | null>(null);
const KeyboardContext = createContext(false);

export interface MobileShellProps {
  /** Pins the device (styleguide frames, tests); detected when left out. A pinned shell is a frame
   * on a page and does not follow the keyboard. */
  kind?: DeviceKind;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

/**
 * The full-screen root of a phone or iPad layout. Tab bar, sheets, menus and toasts position
 * themselves inside it, and it carries `data-platform` for the CSS and `data-type` for the platform's
 * text sizes (docs/typography.md), so a phone frame on a desktop page reads like the phone. In an app it fills the
 * viewport (`height: 100dvh` on its parent); in the styleguide it is the device frame.
 *
 * While the on-screen keyboard is up, the shell shrinks to the part of the page above it (iOS
 * scrolls the page instead of resizing it) and carries `data-keyboard`, so the content stays at the
 * top and the bottom bar sits on the keyboard (`useKeyboardOpen()`).
 */
export function MobileShell({ kind, children, className, style }: MobileShellProps) {
  const detected = useDeviceKind();
  const device = kind ?? detected;
  const [element, setElement] = useState<HTMLDivElement | null>(null);
  const platform = platformOf(device) ?? "ios";
  const area = useVisibleArea(!kind);
  const follow = !!area && (area.keyboard > 0 || area.top > 0);
  const keyboard = !!area && area.keyboard > 0;
  const content = (
    <div
      ref={setElement}
      className={clsx("uwu-mshell", className)}
      data-platform={platform}
      data-type={platform === "android" ? "android" : "ios"}
      data-follow={follow ? "" : undefined}
      data-keyboard={keyboard ? "" : undefined}
      style={
        follow
          ? ({
              ...style,
              "--uwu-visible-top": `${area.top}px`,
              "--uwu-visible-height": `${area.height}px`,
            } as CSSProperties)
          : style
      }
    >
      {/* The content waits for the shell element (one synchronous commit), so overlays portal into
          it from their first render instead of moving there and losing focus and state. */}
      {element && (
        <ShellContext.Provider value={element}>
          <KeyboardContext.Provider value={keyboard}>{children}</KeyboardContext.Provider>
        </ShellContext.Provider>
      )}
    </div>
  );
  return kind ? <DeviceKindProvider kind={kind}>{content}</DeviceKindProvider> : content;
}

/** The visible part of the page while it differs from the window (keyboard up, page scrolled). */
function useVisibleArea(enabled: boolean): VisibleArea | null {
  const [area, setArea] = useState<VisibleArea | null>(null);
  useEffect(() => {
    const viewport = typeof window === "undefined" ? undefined : window.visualViewport;
    if (!enabled || !viewport) return;
    const update = () => {
      const next = visibleArea(window.innerHeight, viewport.height, viewport.pageTop);
      // iOS sometimes leaves the page scrolled after the keyboard went away.
      if (next.keyboard === 0 && next.top > 0) {
        window.scrollTo(0, 0);
        next.top = 0;
      }
      setArea((last) =>
        last && last.top === next.top && last.height === next.height && last.keyboard === next.keyboard ? last : next,
      );
    };
    update();
    viewport.addEventListener("resize", update);
    viewport.addEventListener("scroll", update);
    return () => {
      viewport.removeEventListener("resize", update);
      viewport.removeEventListener("scroll", update);
    };
  }, [enabled]);
  return area;
}

/** True while the on-screen keyboard is up (inside a `MobileShell` that follows it). */
export function useKeyboardOpen(): boolean {
  return useContext(KeyboardContext);
}

/** Renders overlays (sheets, menus, toasts) at the top of the shell, or in place without one. */
export function ShellPortal({ children }: { children: ReactNode }) {
  const shell = useContext(ShellContext);
  return shell ? createPortal(children, shell) : <>{children}</>;
}

/** The shell element, e.g. to position a context menu inside it. */
export function useShellElement(): HTMLElement | null {
  return useContext(ShellContext);
}

/**
 * Keeps an overlay mounted for its exit animation: `{ mounted, closing }`. No delay with reduced
 * motion.
 */
export function usePresence(open: boolean, exitMs = 260): { mounted: boolean; closing: boolean } {
  const [mounted, setMounted] = useState(open);
  if (open && !mounted) setMounted(true);
  useEffect(() => {
    if (open || !mounted) return;
    const timer = setTimeout(() => setMounted(false), prefersReducedMotion() ? 0 : exitMs);
    return () => clearTimeout(timer);
  }, [open, mounted, exitMs]);
  return { mounted: mounted || open, closing: mounted && !open };
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Modal focus for overlays that are not a native <dialog> (they live inside the shell so they can
 * sit in a device frame): focus moves in, Tab stays inside, Escape closes, and focus goes back to
 * where it was.
 */
export function useModalFocus(ref: RefObject<HTMLElement | null>, active: boolean, onEscape: () => void): void {
  const latest = useRef(onEscape);
  useEffect(() => {
    latest.current = onEscape;
  });
  useEffect(() => {
    const el = ref.current;
    if (!active || !el) return;
    const before = document.activeElement as HTMLElement | null;
    const first = el.querySelector<HTMLElement>("[data-autofocus]") ?? el;
    first.focus({ preventScroll: true });
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        latest.current();
        return;
      }
      if (event.key !== "Tab") return;
      const items = [...el.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((item) => item.offsetParent !== null);
      if (items.length === 0) {
        event.preventDefault();
        return;
      }
      const head = items[0]!;
      const tail = items[items.length - 1]!;
      if (event.shiftKey && (document.activeElement === head || document.activeElement === el)) {
        event.preventDefault();
        tail.focus();
      } else if (!event.shiftKey && document.activeElement === tail) {
        event.preventDefault();
        head.focus();
      }
    };
    el.addEventListener("keydown", onKey);
    return () => {
      el.removeEventListener("keydown", onKey);
      before?.focus?.({ preventScroll: true });
    };
  }, [ref, active]);
}
