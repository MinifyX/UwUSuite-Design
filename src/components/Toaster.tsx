import { clsx } from "clsx";
import { CircleAlert, CircleCheck, Info, X } from "lucide-react";
import { useSyncExternalStore, type ReactNode } from "react";
import { useLabels } from "../lib/labels";

export type ToastTone = "info" | "success" | "error";

export interface Toast {
  id: number;
  message: ReactNode;
  tone: ToastTone;
  action?: { label: string; run: () => void };
  /** Replaces the tone icon, e.g. the app's own symbol for "sent". */
  icon?: ReactNode;
}

type Listener = () => void;

/**
 * A tiny toast store. 5 s for info and success, 9 s for errors, four at most (the oldest goes).
 * Every app makes one: `export const toasts = createToasts()`.
 */
export function createToasts({ infoMs = 5000, errorMs = 9000, max = 4 } = {}) {
  let list: Toast[] = [];
  let next = 1;
  const listeners = new Set<Listener>();
  const timers = new Map<number, ReturnType<typeof setTimeout>>();
  const emit = () => listeners.forEach((listener) => listener());

  const dismiss = (id: number) => {
    clearTimeout(timers.get(id));
    timers.delete(id);
    list = list.filter((item) => item.id !== id);
    emit();
  };

  const show = (message: ReactNode, options: Partial<Omit<Toast, "id" | "message">> = {}) => {
    const item: Toast = {
      id: next++,
      message,
      tone: options.tone ?? "info",
      action: options.action,
      icon: options.icon,
    };
    const drop = Math.max(0, list.length - (max - 1));
    list.slice(0, drop).forEach((old) => clearTimeout(timers.get(old.id)));
    list = [...list.slice(drop), item];
    timers.set(
      item.id,
      setTimeout(() => dismiss(item.id), item.tone === "error" ? errorMs : infoMs),
    );
    emit();
    return item.id;
  };

  return {
    show,
    dismiss,
    subscribe(listener: Listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    get: () => list,
  };
}

export type ToastStore = ReturnType<typeof createToasts>;

const ICONS = { info: Info, success: CircleCheck, error: CircleAlert } as const;

/** The toast stack: bottom centre on desktop, top on phones. Inverted colours, so it stands out. */
export function Toaster({ store }: { store: ToastStore }) {
  const toasts = useSyncExternalStore(store.subscribe, store.get, store.get);
  const labels = useLabels();
  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed bottom-5 left-1/2 z-[var(--uwu-z-toast)] flex w-[min(440px,calc(100vw-32px))] -translate-x-1/2 flex-col items-center gap-2 phone:top-2 phone:bottom-auto"
    >
      {toasts.map((item) => {
        const Glyph = ICONS[item.tone];
        return (
          <div
            key={item.id}
            role={item.tone === "error" ? "alert" : "status"}
            className="pointer-events-auto flex w-full animate-slide-up items-center gap-3 rounded-2xl bg-toast py-2.5 pr-2 pl-4 text-meta font-medium text-toast-ink shadow-float"
          >
            <span className="relative shrink-0">
              {item.icon ?? (
                <Glyph
                  className={clsx("size-[18px]", item.tone === "error" ? "text-toast-danger" : "text-toast-accent")}
                  strokeWidth={1.8}
                  aria-hidden
                />
              )}
            </span>
            <span className="flex-1">{item.message}</span>
            {item.action && (
              <button
                type="button"
                onClick={() => {
                  store.dismiss(item.id);
                  item.action?.run();
                }}
                className="shrink-0 rounded-full px-3 py-1.5 text-meta font-bold text-toast-accent hover:bg-toast-ink/10"
              >
                {item.action.label}
              </button>
            )}
            <button
              type="button"
              aria-label={labels.close}
              onClick={() => store.dismiss(item.id)}
              className="grid size-7 shrink-0 place-items-center rounded-full opacity-70 hover:bg-toast-ink/10 hover:opacity-100"
            >
              <X className="size-4" strokeWidth={1.8} aria-hidden />
            </button>
          </div>
        );
      })}
    </div>
  );
}
