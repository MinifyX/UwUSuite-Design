import { clsx } from "clsx";
import type { LucideIcon } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useDrag } from "./drag.js";
import {
  dragAxis,
  SWIPE_ACTION_WIDTH,
  swipeOffset,
  swipeRest,
  swipeSettle,
  type SwipeState,
  type SwipeWidths,
} from "./gestures.js";
import { haptic } from "./haptics.js";

export interface SwipeAction {
  label: string;
  icon: LucideIcon;
  /** accent (pink) · success · warning (favourite) · danger (delete) · neutral */
  tone?: "accent" | "success" | "warning" | "danger" | "neutral";
  onSelect: () => void;
}

export interface SwipeRowProps {
  /** Revealed by swiping right, e.g. "Favorit". */
  leading?: readonly SwipeAction[];
  /** Revealed by swiping left, e.g. "Passwort kopieren", "Löschen" (the destructive one last). */
  trailing?: readonly SwipeAction[];
  /** The row, usually a <ListRow>. */
  children: ReactNode;
  disabled?: boolean;
  className?: string;
}

/** Only one row in the app is open at a time. */
let closeOpenRow: (() => void) | null = null;

/**
 * A list row with swipe actions (Mail-style). Past 70 px it stays open; tapping anywhere on the
 * row closes it again. Closed rows hide their actions (no colour bleeding past the rounded
 * corners). Every swipe action must also be in the row's context menu or detail page: swiping is
 * a shortcut, not the only way.
 */
export function SwipeRow({ leading = [], trailing = [], children, disabled, className }: SwipeRowProps) {
  const root = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<SwipeState>("closed");
  const [drag, setDrag] = useState<number | null>(null);
  const claimed = useRef<"pending" | "swipe" | "no">("pending");
  const swallowClick = useRef(false);
  const widths: SwipeWidths = {
    leading: leading.length * SWIPE_ACTION_WIDTH,
    trailing: trailing.length * SWIPE_ACTION_WIDTH,
  };
  const close = useRef(() => setState("closed"));

  useEffect(() => {
    if (state === "closed") {
      if (closeOpenRow === close.current) closeOpenRow = null;
      return;
    }
    if (closeOpenRow && closeOpenRow !== close.current) closeOpenRow();
    closeOpenRow = close.current;
  }, [state]);

  useEffect(
    () => () => {
      if (closeOpenRow === close.current) closeOpenRow = null;
    },
    [],
  );

  useDrag(
    root,
    {
      start: () => {
        claimed.current = "pending";
      },
      move: ({ dx, dy }) => {
        if (claimed.current === "pending") {
          const axis = dragAxis(dx, dy);
          if (axis === "pending") return false;
          claimed.current = axis === "horizontal" ? "swipe" : "no";
        }
        if (claimed.current !== "swipe") return false;
        setDrag(swipeOffset(swipeRest(state, widths), dx, widths));
        return true;
      },
      end: ({ dx }) => {
        if (claimed.current !== "swipe") return;
        claimed.current = "pending";
        swallowClick.current = true;
        setTimeout(() => (swallowClick.current = false), 80);
        const next = swipeSettle(swipeOffset(swipeRest(state, widths), dx, widths), widths);
        if (next !== state && next !== "closed") haptic("light");
        setState(next);
        setDrag(null);
      },
    },
    !disabled && widths.leading + widths.trailing > 0,
  );

  const offset = drag ?? swipeRest(state, widths);
  const swiping = drag === null ? undefined : drag < 0 ? "trailing" : drag > 0 ? "leading" : undefined;

  const actions = (side: "leading" | "trailing", list: readonly SwipeAction[]) =>
    list.length > 0 && (
      <div className="uwu-swipe-actions" data-side={side} aria-hidden={state !== side}>
        {list.map((action) => (
          <button
            key={action.label}
            type="button"
            className="uwu-swipe-action"
            data-tone={action.tone ?? "neutral"}
            tabIndex={state === side ? 0 : -1}
            onClick={() => {
              setState("closed");
              action.onSelect();
            }}
          >
            <action.icon aria-hidden strokeWidth={1.9} />
            {action.label}
          </button>
        ))}
      </div>
    );

  return (
    <div
      ref={root}
      className={clsx("uwu-swipe", className)}
      data-state={state}
      data-swiping={swiping}
      onClickCapture={(event) => {
        // The click at the end of a swipe, or a tap that only closes an open row, opens nothing.
        if (
          swallowClick.current ||
          (state !== "closed" && !(event.target as HTMLElement).closest(".uwu-swipe-action"))
        ) {
          swallowClick.current = false;
          if (state !== "closed") setState("closed");
          event.preventDefault();
          event.stopPropagation();
        }
      }}
    >
      {actions("leading", leading)}
      {actions("trailing", trailing)}
      <div
        className="uwu-swipe-main"
        style={{
          transform: offset ? `translateX(${offset}px)` : undefined,
          transition: drag === null ? undefined : "none",
        }}
      >
        {children}
      </div>
    </div>
  );
}
