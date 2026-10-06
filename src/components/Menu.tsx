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

export interface MenuProps {
  /** Renders the button that opens the menu; spread the props onto it. */
  trigger: (props: {
    open: boolean;
    toggle: () => void;
    "aria-haspopup": "menu";
    "aria-expanded": boolean;
    "aria-controls": string;
  }) => ReactNode;
  items: (MenuItem | "separator")[];
  align?: "start" | "end";
  /** Opens upwards, e.g. from a toolbar at the bottom. */
  side?: "below" | "above";
  className?: string;
  /** Opens and closes it from outside too, e.g. from a right-click on the row it belongs to. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/** A small popup list of actions. Closes on selection, Escape and clicks outside. */
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
            "absolute z-[var(--uwu-z-menu)] flex w-max max-w-[min(360px,calc(100vw-48px))] min-w-[200px] animate-pop flex-col rounded-2xl border border-line bg-surface p-1.5 text-ink shadow-float",
            side === "above" ? "bottom-[calc(100%+6px)]" : "top-[calc(100%+6px)]",
            align === "end" ? "right-0" : "left-0",
          )}
        >
          {items.map((item, index) =>
            item === "separator" ? (
              <hr key={index} role="separator" className="mx-2 my-1 border-hairline" />
            ) : (
              <button
                key={index}
                type="button"
                role="menuitem"
                disabled={item.disabled}
                onClick={() => {
                  setOpen(false);
                  item.onSelect();
                }}
                className={clsx(
                  "flex items-center gap-2.5 rounded-xl px-3 py-2 text-left text-meta font-medium break-words hover:bg-pink-tint/60 focus:bg-pink-tint/60 focus:outline-none disabled:opacity-50",
                  item.danger && "text-danger-ink",
                )}
              >
                {item.icon && <Icon icon={item.icon} className={item.danger ? undefined : "text-muted"} />}
                {item.label}
              </button>
            ),
          )}
        </div>
      )}
    </div>
  );
}
