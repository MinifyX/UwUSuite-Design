import { clsx } from "clsx";
import { useId, useRef, type KeyboardEvent, type ReactNode } from "react";

export interface Tab<T extends string> {
  id: T;
  label: ReactNode;
  /** Something next to the label, like a count in a Badge. */
  extra?: ReactNode;
  disabled?: boolean;
}

export interface TabsProps<T extends string> {
  /** The tab list's name for screen readers. */
  label: string;
  tabs: readonly Tab<T>[];
  value: T;
  onChange: (id: T) => void;
  /** `line` for the parts of a page (under a heading), `segmented` for the views of a list. */
  variant?: "line" | "segmented";
  /** Ties the tabs to their panels; the same prefix goes to `TabPanel`. Without it, no panels. */
  idPrefix?: string;
  className?: string;
}

/**
 * Tabs: the arrow keys, Home and End move between them and pick one; only the picked tab is in
 * the Tab order. Each tab carries `data-tab={id}`. From UwULock-Server.
 */
export function Tabs<T extends string>({
  label,
  tabs,
  value,
  onChange,
  variant = "line",
  idPrefix,
  className,
}: TabsProps<T>) {
  const list = useRef<HTMLDivElement>(null);
  const enabled = tabs.filter((tab) => !tab.disabled);
  // The tab stop is the picked tab; if that one is missing or disabled, the first usable one.
  const tabStop = enabled.find((tab) => tab.id === value) ?? enabled[0];
  const segmented = variant === "segmented";

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.altKey || event.ctrlKey || event.metaKey || enabled.length === 0) return;
    const index = enabled.findIndex((tab) => tab.id === value);
    const next =
      event.key === "ArrowRight"
        ? enabled[(index + 1) % enabled.length]
        : event.key === "ArrowLeft"
          ? enabled[(index - 1 + enabled.length) % enabled.length]
          : event.key === "Home"
            ? enabled[0]
            : event.key === "End"
              ? enabled[enabled.length - 1]
              : undefined;
    if (!next) return;
    event.preventDefault();
    if (next.id !== value) onChange(next.id);
    list.current?.querySelector<HTMLElement>(`[data-tab="${CSS.escape(next.id)}"]`)?.focus();
  };

  return (
    <div
      ref={list}
      role="tablist"
      aria-label={label}
      onKeyDown={onKeyDown}
      className={clsx(
        "flex max-w-full [scrollbar-width:none] overflow-x-auto",
        segmented ? "self-start rounded-full bg-canvas p-1" : "gap-1 border-b border-hairline",
        className,
      )}
    >
      {tabs.map((tab) => {
        const selected = tab.id === value;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            data-tab={tab.id}
            id={idPrefix ? `${idPrefix}-tab-${tab.id}` : undefined}
            aria-controls={idPrefix ? `${idPrefix}-panel-${tab.id}` : undefined}
            aria-selected={selected}
            tabIndex={tab === tabStop ? 0 : -1}
            disabled={tab.disabled}
            onClick={() => onChange(tab.id)}
            className={clsx(
              "inline-flex shrink-0 items-center gap-1.5 text-meta font-semibold whitespace-nowrap transition-colors disabled:cursor-not-allowed disabled:opacity-55",
              segmented
                ? [
                    "h-8 rounded-full px-4",
                    selected
                      ? // As in Segmented: in high contrast the choice also gets an ink outline.
                        "bg-surface text-pink-ink shadow-sm contrast-high:outline-2 contrast-high:-outline-offset-2 contrast-high:outline-ink"
                      : "text-muted enabled:hover:text-ink",
                  ]
                : [
                    // The underline sits on the list's hairline, so the picked tab has a shape, not only a colour.
                    "-mb-px h-9 rounded-t-small border-b-2 px-3",
                    selected
                      ? "border-pink-solid text-pink-ink"
                      : "border-transparent text-muted enabled:hover:bg-elevated enabled:hover:text-ink",
                  ],
            )}
          >
            {tab.label}
            {tab.extra}
          </button>
        );
      })}
    </div>
  );
}

export interface TabPanelProps {
  /** The `idPrefix` given to `Tabs`. */
  idPrefix: string;
  /** The id of the tab this panel belongs to. */
  tab: string;
  children: ReactNode;
  className?: string;
}

/** The content of the picked tab, named by its tab. */
export function TabPanel({ idPrefix, tab, children, className }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      id={`${idPrefix}-panel-${tab}`}
      aria-labelledby={`${idPrefix}-tab-${tab}`}
      tabIndex={0}
      className={className}
    >
      {children}
    </div>
  );
}

/** A prefix for `Tabs` and `TabPanel`, unique on the page and safe in an id selector. */
export function useTabsId(): string {
  return useId().replace(/[^\w-]/g, "");
}
