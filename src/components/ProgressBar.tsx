import { clsx } from "clsx";
import { useLayoutEffect, useRef } from "react";

export interface ProgressBarProps {
  /** How far along, 0…1. Values outside are clamped, NaN counts as 0. */
  share: number;
  /** Names the bar for screen readers. Leave it out when text next to the bar says the same. */
  label?: string;
  /**
   * "usage" is a fill level (storage, a quota): thin, amber above 75 %, red above 90 %, and never
   * thinner than a sliver once something is used. "progress" (default) is pink work in progress.
   */
  kind?: "progress" | "usage";
  className?: string;
}

/** A horizontal bar: work in progress (an import, a move) or how full something is. */
export function ProgressBar({ share, label, kind = "progress", className }: ProgressBarProps) {
  const fill = useRef<HTMLDivElement>(null);
  const value = Number.isFinite(share) ? Math.min(1, Math.max(0, share)) : 0;
  const usage = kind === "usage";
  const width = usage && value > 0 ? Math.max(0.02, value) : value;

  // CSP: the width goes through CSSOM, never a style attribute.
  useLayoutEffect(() => {
    fill.current?.style.setProperty("width", `${width * 100}%`);
  }, [width]);

  return (
    <div
      role={label ? "progressbar" : undefined}
      aria-label={label}
      aria-valuemin={label ? 0 : undefined}
      aria-valuemax={label ? 100 : undefined}
      aria-valuenow={label ? Math.round(value * 100) : undefined}
      aria-hidden={label ? undefined : true}
      className={clsx("overflow-hidden rounded-full bg-canvas", usage ? "h-1.5" : "h-2.5", className)}
    >
      <div
        ref={fill}
        className={clsx(
          "h-full w-0 rounded-full motion-safe:transition-[width]",
          usage && value > 0.9 ? "bg-danger" : usage && value > 0.75 ? "bg-warning" : "bg-pink-solid",
        )}
      />
    </div>
  );
}
