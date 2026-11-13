import { clsx } from "clsx";
import { useRef, useState, type KeyboardEvent } from "react";

export interface ResizeHandleProps {
  /** What it resizes, for screen readers: „Breite der Ordner“. */
  label: string;
  /** The width of the column left of it, as it is on screen. */
  width: number;
  min: number;
  max: number;
  /** Gets the new width, already kept within `min` and `max`. */
  onResize: (width: number) => void;
  /** The drag or the key press is over: keep the width (save it). */
  onCommit?: () => void;
  /** Double-click or Enter: back to the initial width. */
  onReset?: () => void;
  /** Pixels per arrow key; Shift moves four steps. */
  step?: number;
  className?: string;
}

/** The width a key asks for (arrows, Home, End), null for keys that don't move the handle. */
export function keyedWidth(
  key: string,
  shift: boolean,
  { width, min, max, step = 16 }: Pick<ResizeHandleProps, "width" | "min" | "max" | "step">,
): number | null {
  const by = shift ? step * 4 : step;
  const clamp = (value: number) => Math.min(max, Math.max(min, value));
  switch (key) {
    case "ArrowLeft":
      return clamp(width - by);
    case "ArrowRight":
      return clamp(width + by);
    case "Home":
      return min;
    case "End":
      return max;
    default:
      return null;
  }
}

/**
 * The gap between two columns, which drags the left one wider or narrower. With the keyboard it is
 * a focusable separator: ←/→ move it (Shift for bigger steps), Home and End go to the limits, Enter
 * resets. From UwUMail.
 */
export function ResizeHandle({
  label,
  width,
  min,
  max,
  onResize,
  onCommit,
  onReset,
  step = 16,
  className,
}: ResizeHandleProps) {
  const drag = useRef<{ x: number; width: number } | null>(null);
  const [dragging, setDragging] = useState(false);
  const end = () => {
    if (!drag.current) return false;
    drag.current = null;
    setDragging(false);
    onCommit?.();
    return true;
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" && onReset) {
      event.preventDefault();
      onReset();
      return;
    }
    const next = keyedWidth(event.key, event.shiftKey, { width, min, max, step });
    if (next === null) return;
    event.preventDefault();
    // The app's own shortcuts on these keys (a list's Home and End) stay out of it.
    event.stopPropagation();
    onResize(next);
    onCommit?.();
  };

  return (
    <div
      role="separator"
      aria-orientation="vertical"
      aria-label={label}
      aria-valuenow={Math.round(width)}
      aria-valuemin={min}
      aria-valuemax={max}
      tabIndex={0}
      onPointerDown={(event) => {
        if (event.button !== 0) return;
        event.preventDefault();
        event.currentTarget.setPointerCapture?.(event.pointerId);
        drag.current = { x: event.clientX, width };
        setDragging(true);
      }}
      onPointerMove={(event) => {
        const start = drag.current;
        if (start) onResize(Math.min(max, Math.max(min, start.width + event.clientX - start.x)));
      }}
      onPointerUp={(event) => {
        if (end()) event.currentTarget.releasePointerCapture?.(event.pointerId);
      }}
      onPointerCancel={end}
      onDoubleClick={onReset}
      onKeyDown={onKeyDown}
      className={clsx("group relative w-3 shrink-0 cursor-col-resize touch-none rounded-full select-none", className)}
    >
      <span
        aria-hidden
        className={clsx(
          "absolute inset-y-6 left-1/2 w-[3px] -translate-x-1/2 rounded-full motion-safe:transition-colors",
          dragging ? "bg-pink-solid" : "bg-transparent group-hover:bg-control group-focus-visible:bg-pink-solid",
        )}
      />
    </div>
  );
}
