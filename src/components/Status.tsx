import { clsx } from "clsx";
import type { ReactNode } from "react";

export type StatusState = "online" | "connecting" | "offline" | "error";

const DOTS: Record<StatusState, string> = {
  online: "bg-success",
  // The one place pink means a state: something is starting, and it pulses.
  connecting: "bg-pink animate-pulse-soft",
  offline: "bg-offline",
  error: "bg-warning",
};

/** A state dot: mint is ready, pink pulses while starting, grey is off, amber needs attention. */
export function StatusDot({ state, className }: { state: StatusState; className?: string }) {
  return <span className={clsx("inline-block size-2 shrink-0 rounded-full", DOTS[state], className)} aria-hidden />;
}

/** "● Bereit als „Wohnzimmer“": the dot plus one line of text that says the same. */
export function StatusLine({ state, children }: { state: StatusState; children: ReactNode }) {
  return (
    <p className="flex items-center gap-2 text-[calc(var(--uwu-text-meta)+0.5px)]" data-state={state}>
      <StatusDot state={state} />
      <span className={clsx(state === "error" && "text-warning-ink")}>{children}</span>
    </p>
  );
}
