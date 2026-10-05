import { clsx } from "clsx";
import type { ButtonHTMLAttributes, HTMLAttributes } from "react";

export interface PillProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  count?: number;
}

/** A filter that can be on or off, optionally with a count. */
export function Pill({ active, count, className, children, type = "button", ...rest }: PillProps) {
  return (
    <button
      type={type}
      aria-pressed={active}
      className={clsx(
        "inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full px-3.5 text-meta font-medium transition-colors duration-150",
        active ? "bg-pink-tint text-pink-ink" : "border border-line text-muted hover:border-faint/60 hover:text-ink",
        className,
      )}
      {...rest}
    >
      {children}
      {count !== undefined && count > 0 && <Badge count={count} />}
    </button>
  );
}

/** An unread or pending count. Hidden at zero, capped at 999+. */
export function Badge({ count, className }: { count: number; className?: string }) {
  if (count <= 0) return null;
  return (
    <span
      className={clsx(
        "inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-pink-solid px-1.5 text-badge font-bold text-on-pink tabular-nums",
        className,
      )}
    >
      {count > 999 ? "999+" : count}
    </span>
  );
}

export type TagTone = "neutral" | "pink" | "success" | "warning" | "danger";

const TAG_TONES: Record<TagTone, string> = {
  neutral: "bg-canvas text-muted",
  pink: "bg-pink-tint text-pink-ink",
  success: "bg-success-tint text-success-ink",
  warning: "bg-warning-tint text-warning-ink",
  danger: "bg-danger-tint text-danger-ink",
};

/** A small label that says what something is: "Beta", "Neu", "Offline", "Admin". */
export function Tag({ tone = "neutral", className, ...rest }: HTMLAttributes<HTMLSpanElement> & { tone?: TagTone }) {
  return (
    <span
      className={clsx(
        "inline-flex h-[22px] items-center rounded-full px-2.5 text-caption font-semibold whitespace-nowrap",
        TAG_TONES[tone],
        className,
      )}
      {...rest}
    />
  );
}
