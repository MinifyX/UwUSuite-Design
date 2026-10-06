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
import { DeviceKindProvider, prefersReducedMotion, useDeviceKind } from "./hooks.js";

const ShellContext = createContext<HTMLElement | null>(null);

export interface MobileShellProps {
  /** Pins the device (styleguide frames, tests); detected when left out. */
  kind?: DeviceKind;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

/**
 * The full-screen root of a phone or iPad layout. Tab bar, sheets, menus and toasts position
 * themselves inside it, and it carries `data-platform` for the CSS. In an app it fills the
 * viewport (`height: 100dvh` on its parent); in the styleguide it is the device frame.
 */
export function MobileShell({ kind, children, className, style }: MobileShellProps) {
  const detected = useDeviceKind();
  const device = kind ?? detected;
  const [element, setElement] = useState<HTMLDivElement | null>(null);
  const content = (
    <div
      ref={setElement}
      className={clsx("uwu-mshell", className)}
      data-platform={platformOf(device) ?? "ios"}
      style={style}
    >
      {/* The content waits for the shell element (one synchronous commit), so overlays portal into
          it from their first render instead of moving there and losing focus and state. */}
      {element && <ShellContext.Provider value={element}>{children}</ShellContext.Provider>}
    </div>
  );
  return kind ? <DeviceKindProvider kind={kind}>{content}</DeviceKindProvider> : content;
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
