/**
 * The open modal dialogs (Dialog, CommandPalette), so a toast stack can move into the topmost
 * one: a modal makes everything outside it inert and covers it with its backdrop, and
 * popover="manual" is not Baseline widely available yet (and would still be inert).
 */

let stack: HTMLDialogElement[] = [];
const listeners = new Set<() => void>();

const forget = (dialog: HTMLDialogElement) => {
  if (!stack.includes(dialog)) return;
  stack = stack.filter((item) => item !== dialog);
  listeners.forEach((listener) => listener());
};

export function showModal(dialog: HTMLDialogElement) {
  dialog.showModal?.();
  stack = [...stack.filter((item) => item !== dialog), dialog];
  listeners.forEach((listener) => listener());
  // Closed by the browser (Android back). A late event after a reopen is ignored.
  dialog.addEventListener("close", () => !dialog.open && forget(dialog), { once: true });
}

export function closeModal(dialog: HTMLDialogElement) {
  if (dialog.open) dialog.close?.();
  forget(dialog);
}

export const topModal = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => void listeners.delete(listener);
  },
  get: (): HTMLDialogElement | null => stack.at(-1) ?? null,
};
