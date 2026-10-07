import { clsx } from "clsx";
import type { ReactNode } from "react";

export interface EmptyStateProps {
  /** A Nyu scene (320 × 220) from the app, or <Nyu /> on its own. */
  art?: ReactNode;
  title: ReactNode;
  body?: ReactNode;
  action?: ReactNode;
  /** Smaller art for dense places: sidebars, dialogs, the Pro layout. */
  compact?: boolean;
  className?: string;
}

/** Nothing here yet, nothing found, something failed: Nyu, one line that says so, what to do. */
export function EmptyState({ art, title, body, action, compact = false, className }: EmptyStateProps) {
  return (
    <div className={clsx("flex flex-col items-center justify-center gap-3 px-8 py-12 text-center", className)}>
      {art && (
        <div
          className={clsx(
            "animate-pop drop-shadow-nyu [&>svg]:h-auto [&>svg]:w-full",
            compact ? "w-[150px]" : "w-[240px]",
          )}
        >
          {art}
        </div>
      )}
      <p className="max-w-[320px] text-[calc(var(--uwu-text-body)+1px)] font-bold text-ink">{title}</p>
      {body && <p className="max-w-[300px] text-meta text-muted">{body}</p>}
      {action}
    </div>
  );
}
