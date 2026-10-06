import { clsx } from "clsx";
import { CircleAlert, Check, Info, Minus, Plus, type LucideIcon } from "lucide-react";
import { useSyncExternalStore, type ButtonHTMLAttributes, type ReactNode } from "react";
import type { ToastStore } from "../components/Toaster.js";
import { useLabels } from "../lib/labels.js";
import type { MobilePlatform } from "./device.js";
import { stepValue } from "./gestures.js";
import { haptic } from "./haptics.js";
import { useMobilePlatform } from "./hooks.js";
import { ShellPortal } from "./Shell.js";

export interface StepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  /** What the stepper changes ("Mindestens Ziffern"), for screen readers. */
  label: string;
  platform?: MobilePlatform;
  className?: string;
}

/** − / + for small counts (minimums, copies). iOS: a grey capsule; Android: an outlined pill. */
export function Stepper({
  value,
  onChange,
  min = 0,
  max = 99,
  step = 1,
  label,
  platform: explicit,
  className,
}: StepperProps) {
  const platform = useMobilePlatform(explicit);
  const labels = useLabels();
  const change = (delta: number) => {
    const next = stepValue(value, delta, min, max);
    if (next === value) return;
    haptic("selection");
    onChange(next);
  };
  return (
    <div
      role="group"
      aria-label={label}
      className={clsx("uwu-stepper", className)}
      data-platform={platform}
      onKeyDown={(event) => {
        if (event.key === "ArrowUp" || event.key === "ArrowRight") change(step);
        else if (event.key === "ArrowDown" || event.key === "ArrowLeft") change(-step);
        else return;
        event.preventDefault();
      }}
    >
      <button
        type="button"
        aria-label={`${labels.decrease}: ${label}`}
        disabled={value <= min}
        onClick={() => change(-step)}
      >
        <Minus aria-hidden strokeWidth={2.2} />
      </button>
      <button
        type="button"
        aria-label={`${labels.increase}: ${label}`}
        disabled={value >= max}
        onClick={() => change(step)}
      >
        <Plus aria-hidden strokeWidth={2.2} />
      </button>
      <span className="uwu-visually-hidden" aria-live="polite">
        {value}
      </span>
    </div>
  );
}

export interface FabProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  /** The accessible name ("Neuer Eintrag"); shown as text when `extended`. */
  label: string;
  icon: LucideIcon;
  /** The extended FAB with its label next to the icon. */
  extended?: boolean;
}

/** Android: the floating action button for the screen's main action ("+" on iOS sits in the nav bar). */
export function Fab({ label, icon: Glyph, extended, className, ...rest }: FabProps) {
  return (
    <button
      type="button"
      aria-label={extended ? undefined : label}
      title={extended ? undefined : label}
      className={clsx("uwu-fab", className)}
      {...rest}
    >
      <Glyph aria-hidden strokeWidth={2} />
      {extended && label}
    </button>
  );
}

const TONE_ICON = { success: Check, error: CircleAlert, info: Info } as const;

export interface MobileToasterProps {
  store: ToastStore;
  platform?: MobilePlatform;
}

/**
 * The same toast store as <Toaster>, drawn the mobile way: iOS/iPad a glass toast that drops in at
 * the top (title, detail line, round tone icon); Android a Material 3 snackbar above the
 * navigation bar with its action ("Rückgängig"). Shows the newest toast only.
 */
export function MobileToaster({ store, platform: explicit }: MobileToasterProps) {
  const platform = useMobilePlatform(explicit);
  const toasts = useSyncExternalStore(store.subscribe, store.get, store.get);
  const item = toasts[toasts.length - 1];
  if (!item) return null;
  const role = item.tone === "error" ? "alert" : "status";
  const run = () => {
    store.dismiss(item.id);
    item.action?.run();
  };
  if (platform === "android")
    return (
      <ShellPortal>
        <div key={item.id} role={role} className="uwu-snackbar">
          <span className="uwu-snackbar-text">{item.message}</span>
          {item.action && (
            <button type="button" onClick={run}>
              {item.action.label}
            </button>
          )}
        </div>
      </ShellPortal>
    );
  const Glyph = TONE_ICON[item.tone];
  return (
    <ShellPortal>
      <div key={item.id} role={role} className="uwu-mtoast uwu-glass" data-platform={platform}>
        <span className="uwu-mtoast-icon" data-tone={item.tone}>
          {item.icon ?? <Glyph aria-hidden />}
        </span>
        <span className="uwu-mtoast-text">
          <b>{item.message}</b>
          {item.detail && <span>{item.detail as ReactNode}</span>}
        </span>
        {item.action && (
          <button type="button" className="uwu-mtoast-action" onClick={run}>
            {item.action.label}
          </button>
        )}
      </div>
    </ShellPortal>
  );
}
