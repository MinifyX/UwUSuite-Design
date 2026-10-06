import { clsx } from "clsx";
import { X } from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";
import { useLabels } from "../lib/labels.js";
import { IconButton } from "./Button.js";

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  children: ReactNode;
  /** sm 420 confirmations · md 560 forms · lg 860 settings · viewer 1200 full height. */
  width?: "sm" | "md" | "lg" | "viewer";
  /** "warning" for questions that throw something away or can't be undone. */
  tone?: "default" | "warning";
  footer?: ReactNode;
  className?: string;
  /**
   * False while a form inside has unsaved input: a click beside the window leaves it open. Escape
   * and the X still close on purpose. Defaults to true.
   */
  closeOnOutsideClick?: boolean;
  /** Keeps the dialog from opening, e.g. while the app lock covers the window. */
  held?: boolean;
}

/**
 * Modal built on <dialog>: focus trapping, Escape and the backdrop come from the browser. Dialogs
 * opened from inside another stack: Escape closes only the innermost one.
 */
export function Dialog({
  open,
  onClose,
  title,
  children,
  width = "md",
  tone = "default",
  footer,
  className,
  closeOnOutsideClick = true,
  held = false,
}: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const labels = useLabels();
  const shown = open && !held;

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (shown && !dialog.open) dialog.showModal?.();
    if (!shown && dialog.open) dialog.close?.();
  }, [shown]);

  return (
    <dialog
      ref={ref}
      onCancel={(event) => {
        // The browser fires `cancel` only at the topmost modal, but React hands it on up the
        // component tree, so a dialog opened from inside another would close both. Only the
        // dialog it was fired at answers it.
        if (event.target !== ref.current) return;
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (closeOnOutsideClick && event.target === ref.current) onClose();
      }}
      className={clsx(
        "m-auto max-h-[min(720px,calc(100svh-48px))] w-[calc(100vw-48px)] overflow-hidden rounded-dialog border border-line bg-surface p-0 text-ink shadow-float backdrop:bg-[var(--uwu-backdrop)] backdrop:backdrop-blur-[2px] open:flex open:animate-pop open:flex-col",
        tone === "warning" && "border-t-4 border-t-warning",
        width === "sm" && "max-w-[420px]",
        width === "md" && "max-w-[560px]",
        width === "lg" && "max-w-[860px]",
        width === "viewer" && "h-[calc(100svh-48px)] max-h-none max-w-[1200px]",
        // Phones: everything but small confirmations fills the screen, clear of the notch and the
        // home indicator (env() is 0 without viewport-fit=cover).
        width !== "sm" &&
          "phone:h-full phone:max-h-none phone:w-full phone:max-w-none phone:rounded-none phone:border-0 phone:pt-[env(safe-area-inset-top)] phone:pb-[env(safe-area-inset-bottom)]",
        className,
      )}
    >
      {/* Safari sizes a <dialog> as fit-content, and in WebKit that is 0 for a column whose items
          have flex-basis 0 (flex-1) or a percentage height. So items start from their content
          (flex-auto) and shrink from there (min-h-0). Never flex-1 or h-full in here. */}
      {open && (
        <div className="flex min-h-0 flex-auto flex-col">
          {title !== undefined && (
            <header className="flex items-center justify-between gap-4 px-6 pt-5 pb-2">
              <h2 className={clsx("text-section font-bold", tone === "warning" && "text-warning-ink")}>{title}</h2>
              <IconButton icon={X} label={labels.close} onClick={onClose} />
            </header>
          )}
          <div className="min-h-0 flex-auto overflow-y-auto">{children}</div>
          {/* Phones: the buttons share the row and grow to fill it. What doesn't fit wraps onto a
              line of its own at full width, so a third button (the primary one comes last) gets a
              whole row instead of being squeezed. */}
          {footer && (
            <footer className="flex flex-wrap items-center justify-end gap-2 border-t border-hairline px-6 py-4 phone:px-4 phone:[&>a]:flex-auto phone:[&>button]:flex-auto">
              {footer}
            </footer>
          )}
        </div>
      )}
    </dialog>
  );
}
