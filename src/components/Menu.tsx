import { clsx } from "clsx";
import type { LucideIcon } from "lucide-react";
import { useEffect, useId, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { Icon } from "../icons/Icon.js";

export interface MenuItem {
  label: ReactNode;
  onSelect: () => void;
  icon?: LucideIcon;
  /** Deletes or throws away something. */
  danger?: boolean;
  disabled?: boolean;
}

/** A labelled section: the items after it, up to the next heading, belong to it. */
export interface MenuHeading {
  heading: ReactNode;
}

export type MenuEntry = MenuItem | MenuHeading | "separator";

interface MenuSection {
  heading?: ReactNode;
  entries: (MenuItem | "separator")[];
}

/** Splits the entries at their headings; what comes before the first heading has none. */
function sections(items: MenuEntry[]): MenuSection[] {
  const result: MenuSection[] = [{ entries: [] }];
  for (const item of items) {
    if (item !== "separator" && "heading" in item) result.push({ heading: item.heading, entries: [] });
    else result[result.length - 1]!.entries.push(item);
  }
  return result.filter((section) => section.heading !== undefined || section.entries.length > 0);
}

export interface MenuProps {
  /** Renders the button that opens the menu; spread the props onto it. */
  trigger: (props: {
    open: boolean;
    toggle: () => void;
    "aria-haspopup": "menu";
    "aria-expanded": boolean;
    "aria-controls": string;
  }) => ReactNode;
  /** Items, `"separator"` lines and `{ heading }` entries that start a labelled section. */
  items: MenuEntry[];
  align?: "start" | "end";
  /** Opens upwards, e.g. from a toolbar at the bottom. */
  side?: "below" | "above";
  className?: string;
  /** Opens and closes it from outside too, e.g. from a right-click on the row it belongs to. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/**
 * A small popup list of actions. Closes on selection, Escape and clicks outside. Long menus scroll
 * (at most 520 px or three quarters of the window high).
 */
export function Menu({
  trigger,
  items,
  align = "start",
  side = "below",
  className,
  open: controlled,
  onOpenChange,
}: MenuProps) {
  const [uncontrolled, setUncontrolled] = useState(false);
  const open = controlled ?? uncontrolled;
  const setOpen = (value: boolean) => {
    setUncontrolled(value);
    onOpenChange?.(value);
  };
  // The listeners below must always close through the latest callback without re-subscribing.
  const closeRef = useRef(() => {});
  useLayoutEffect(() => {
    closeRef.current = () => setOpen(false);
  });
  const id = useId();
  const root = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    list.current?.querySelector<HTMLButtonElement>("[role=menuitem]:not(:disabled)")?.focus();
    const onPointer = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) closeRef.current();
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      // Only the menu closes, not the dialog behind it.
      event.stopPropagation();
      closeRef.current();
      root.current?.querySelector<HTMLButtonElement>("[aria-haspopup]")?.focus();
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey, true);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey, true);
    };
  }, [open]);

  const moveFocus = (step: number) => {
    const buttons = [...(list.current?.querySelectorAll<HTMLButtonElement>("[role=menuitem]:not(:disabled)") ?? [])];
    const index = buttons.indexOf(document.activeElement as HTMLButtonElement);
    buttons[(index + step + buttons.length) % buttons.length]?.focus();
  };

  return (
    <div ref={root} className={clsx("relative inline-flex", className)}>
      {trigger({
        open,
        toggle: () => setOpen(!open),
        "aria-haspopup": "menu",
        "aria-expanded": open,
        "aria-controls": id,
      })}
      {open && (
        <div
          ref={list}
          id={id}
          role="menu"
          onKeyDown={(event) => {
            if (event.key === "ArrowDown" || event.key === "ArrowUp") {
              event.preventDefault();
              moveFocus(event.key === "ArrowDown" ? 1 : -1);
            }
          }}
          className={clsx(
            "absolute z-[var(--uwu-z-menu)] flex max-h-[min(75vh,520px)] w-max max-w-[min(360px,calc(100vw-48px))] min-w-[200px] animate-pop flex-col overflow-y-auto overscroll-contain rounded-2xl border border-line bg-surface p-1.5 text-ink shadow-float",
            side === "above" ? "bottom-[calc(100%+6px)]" : "top-[calc(100%+6px)]",
            align === "end" ? "right-0" : "left-0",
          )}
        >
          {sections(items).map((section, sectionIndex) =>
            section.heading === undefined ? (
              <Entries key={sectionIndex} entries={section.entries} close={() => setOpen(false)} />
            ) : (
              <div
                key={sectionIndex}
                role="group"
                aria-labelledby={`${id}-h${sectionIndex}`}
                className={clsx("flex flex-col", sectionIndex > 0 && "mt-1 border-t border-hairline pt-1")}
              >
                <p
                  id={`${id}-h${sectionIndex}`}
                  role="presentation"
                  className="px-3 pt-1.5 pb-1 text-badge font-bold tracking-wide text-muted uppercase"
                >
                  {section.heading}
                </p>
                <Entries entries={section.entries} close={() => setOpen(false)} />
              </div>
            ),
          )}
        </div>
      )}
    </div>
  );
}

function Entries({ entries, close }: { entries: (MenuItem | "separator")[]; close: () => void }) {
  return entries.map((item, index) =>
    item === "separator" ? (
      <hr key={index} role="separator" className="mx-2 my-1 shrink-0 border-hairline" />
    ) : (
      <button
        key={index}
        type="button"
        role="menuitem"
        disabled={item.disabled}
        onClick={() => {
          close();
          item.onSelect();
        }}
        className={clsx(
          "flex shrink-0 items-center gap-2.5 rounded-xl px-3 py-2 text-left text-meta font-medium break-words hover:bg-pink-tint/60 focus:bg-pink-tint/60 focus:outline-none disabled:opacity-50",
          item.danger && "text-danger-ink",
        )}
      >
        {item.icon && <Icon icon={item.icon} className={item.danger ? undefined : "text-muted"} />}
        {item.label}
      </button>
    ),
  );
}
