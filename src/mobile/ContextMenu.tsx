import type { LucideIcon } from "lucide-react";
import { useLayoutEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { useLabels } from "../lib/labels.js";
import type { MobilePlatform } from "./device.js";
import { useMobilePlatform } from "./hooks.js";
import { ShellPortal, useModalFocus, usePresence, useShellElement } from "./Shell.js";
import { Sheet } from "./Sheet.js";

export type ContextMenuEntry =
  { label: string; icon?: LucideIcon; onSelect: () => void; danger?: boolean; disabled?: boolean } | "separator";

export interface ContextMenuProps {
  open: boolean;
  onClose: () => void;
  items: readonly ContextMenuEntry[];
  /** Where the long press happened (clientX/Y, from useLongPress). */
  at?: { x: number; y: number };
  /** iOS: the pressed row, lifted above the blurred page. Android: the sheet's header. */
  preview?: ReactNode;
  /** The name for screen readers ("Aktionen für GitHub"). */
  label?: string;
  platform?: MobilePlatform;
}

const MENU_WIDTH = 270;
const GAP = 16;

/**
 * The menu a long press opens. iOS/iPad: a glass menu next to the finger over a blurred page,
 * with the row lifted as a preview. Android: a bottom sheet with the item as header.
 */
export function ContextMenu({ open, onClose, items, at, preview, label, platform: explicit }: ContextMenuProps) {
  const platform = useMobilePlatform(explicit);
  const labels = useLabels();
  if (platform === "android")
    return (
      <Sheet open={open} onClose={onClose} detents={["medium"]} platform="android">
        {preview && <div style={{ padding: "0 24px 12px" }}>{preview}</div>}
        <MenuList items={items} onClose={onClose} label={label ?? labels.actions} />
      </Sheet>
    );
  return (
    <GlassMenu open={open} onClose={onClose} items={items} at={at} preview={preview} label={label ?? labels.actions} />
  );
}

function GlassMenu({
  open,
  onClose,
  items,
  at,
  preview,
  label,
}: Required<Pick<ContextMenuProps, "open" | "onClose" | "items" | "label">> &
  Pick<ContextMenuProps, "at" | "preview">) {
  const { mounted, closing } = usePresence(open, 200);
  const shell = useShellElement();
  const layer = useRef<HTMLDivElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const [place, setPlace] = useState<{ left: number; top: number; previewTop: number } | null>(null);
  useModalFocus(layer, open, onClose);

  useLayoutEffect(() => {
    if (!mounted || closing) return;
    const bounds = (shell ?? document.documentElement).getBoundingClientRect();
    const height = menu.current?.offsetHeight ?? 240;
    const x = (at?.x ?? bounds.left + bounds.width / 2) - bounds.left;
    const y = (at?.y ?? bounds.top + bounds.height / 3) - bounds.top;
    const previewHeight = preview ? 72 : 0;
    // With a preview the menu lines up under it, like iOS; without one it opens at the finger.
    const left = preview ? GAP : Math.min(Math.max(GAP, x - 40), bounds.width - MENU_WIDTH - GAP);
    let previewTop = Math.max(GAP + 48, y - previewHeight / 2);
    let top = previewTop + previewHeight + 10;
    if (top + height > bounds.height - GAP) {
      top = Math.max(GAP + 48, bounds.height - GAP - height);
      previewTop = Math.max(GAP, top - previewHeight - 10);
    }
    setPlace({ left: Math.max(GAP, left), top, previewTop });
  }, [mounted, closing, at, preview, shell]);

  if (!mounted) return null;
  return (
    <ShellPortal>
      <div ref={layer} className="uwu-menu-layer" data-closing={closing ? "" : undefined} tabIndex={-1}>
        <div className="uwu-scrim" onClick={onClose} aria-hidden />
        {preview && place && (
          <div className="uwu-menu-preview" style={{ top: place.previewTop }} aria-hidden>
            {preview}
          </div>
        )}
        <div
          ref={menu}
          className="uwu-menu uwu-glass"
          style={place ? { left: place.left, top: place.top } : { opacity: 0 }}
        >
          <MenuList items={items} onClose={onClose} label={label} />
        </div>
      </div>
    </ShellPortal>
  );
}

function MenuList({
  items,
  onClose,
  label,
}: {
  items: readonly ContextMenuEntry[];
  onClose: () => void;
  label: string;
}) {
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    event.preventDefault();
    const buttons = [...event.currentTarget.querySelectorAll<HTMLButtonElement>("button:not(:disabled)")];
    const index = buttons.indexOf(document.activeElement as HTMLButtonElement);
    const next = event.key === "ArrowDown" ? index + 1 : index - 1;
    buttons[(next + buttons.length) % buttons.length]?.focus();
  };
  const firstEnabled = items.findIndex((item) => item !== "separator" && !item.disabled);
  return (
    <div role="menu" aria-label={label} onKeyDown={onKeyDown}>
      {items.map((item, index) => {
        if (item === "separator") return <hr key={`s${index}`} className="uwu-menu-separator" />;
        const autofocus = index === firstEnabled;
        return (
          <button
            key={item.label}
            type="button"
            role="menuitem"
            className="uwu-menu-item"
            data-danger={item.danger ? "" : undefined}
            data-autofocus={autofocus ? "" : undefined}
            disabled={item.disabled}
            onClick={() => {
              onClose();
              item.onSelect();
            }}
          >
            <span>{item.label}</span>
            {item.icon && <item.icon aria-hidden strokeWidth={1.9} />}
          </button>
        );
      })}
    </div>
  );
}
