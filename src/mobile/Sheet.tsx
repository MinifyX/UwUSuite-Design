import { clsx } from "clsx";
import { X } from "lucide-react";
import { useId, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { useLabels } from "../lib/labels.js";
import type { MobilePlatform } from "./device.js";
import { useDrag } from "./drag.js";
import { settleSheet, type Detent } from "./gestures.js";
import { useMobilePlatform } from "./hooks.js";
import { NavButton } from "./NavBar.js";
import { ShellPortal, useModalFocus, usePresence } from "./Shell.js";

const DETENT_HEIGHT: Record<Detent, string> = {
  large: "calc(100% - var(--uwu-safe-top) - 16px)",
  medium: "56%",
};

export interface SheetProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  /** Left of the title: "Abbrechen". */
  leading?: ReactNode;
  /** Right of the title: the primary action ("Fertig", "Sichern") as a tinted NavButton. */
  trailing?: ReactNode;
  /**
   * Heights the sheet can rest at (phones). Drag the grabber between them; dragging down from the
   * lowest closes. Default `["large"]`.
   */
  detents?: readonly Detent[];
  initialDetent?: Detent;
  /**
   * False while the sheet holds unsaved input: dragging down and tapping beside it do nothing.
   * Escape and the leading "Abbrechen" still close on purpose.
   */
  dismissible?: boolean;
  /** iOS sheet with detents · Android M3 bottom sheet · iPad centred form sheet. */
  platform?: MobilePlatform;
  /** The form sheet's height on an iPad (default 720 px). */
  ipadHeight?: number;
  children: ReactNode;
  className?: string;
}

/**
 * A sheet for creating, editing and choosing (docs/mobile.md). On an iPad it becomes a centred
 * form sheet. Rendered into the <MobileShell>.
 */
export function Sheet({
  open,
  onClose,
  title,
  leading,
  trailing,
  detents = ["large"],
  initialDetent,
  dismissible = true,
  platform: explicit,
  ipadHeight,
  children,
  className,
}: SheetProps) {
  const platform = useMobilePlatform(explicit);
  const { mounted, closing } = usePresence(open, 280);
  const [detent, setDetent] = useState<Detent>(initialDetent ?? detents[detents.length - 1] ?? "large");
  const [dy, setDy] = useState<number | null>(null);
  const sheet = useRef<HTMLDivElement>(null);
  const grabber = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const ipad = platform === "ipad";

  // A new opening starts at its initial detent; later detent changes come from the user.
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) setDetent(initialDetent ?? detents[detents.length - 1] ?? "large");
  }

  useModalFocus(sheet, open, onClose);

  useDrag(
    grabber,
    {
      move: ({ dy: moved }) => {
        // Down follows the finger; up only a little (rubber band) unless a taller detent waits.
        setDy(moved > 0 ? moved : moved / 4);
        return true;
      },
      end: ({ dy: moved, vy }) => {
        setDy(null);
        const height = sheet.current?.offsetHeight ?? 600;
        const next = settleSheet(detent, detents, moved, height, vy);
        if (next === null) {
          if (dismissible) onClose();
        } else setDetent(next);
      },
    },
    mounted && !ipad,
  );

  if (!mounted) return null;
  const height = ipad ? (ipadHeight ? `${ipadHeight}px` : undefined) : DETENT_HEIGHT[detent];
  const style = {
    "--uwu-sheet-height": height,
    transform: dy ? `translateY(${Math.max(dy, -24)}px)` : undefined,
  } as CSSProperties;

  return (
    <ShellPortal>
      <div className="uwu-sheet-layer" data-closing={closing ? "" : undefined}>
        <div className="uwu-scrim" onClick={dismissible ? onClose : undefined} aria-hidden />
        <div
          ref={sheet}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? titleId : undefined}
          tabIndex={-1}
          className={clsx("uwu-sheet", className)}
          data-platform={platform}
          data-detent={detent}
          data-dragging={dy !== null ? "" : undefined}
          style={style}
        >
          <div ref={grabber} className="uwu-sheet-grabber" aria-hidden />
          {(title || leading || trailing) && (
            <div className="uwu-sheet-header">
              <div style={{ minWidth: 44 }}>{leading}</div>
              <h2 id={titleId} className="uwu-sheet-title">
                {title}
              </h2>
              <div style={{ minWidth: 44, display: "flex", justifyContent: "flex-end" }}>{trailing}</div>
            </div>
          )}
          <div className="uwu-sheet-body">{children}</div>
        </div>
      </div>
    </ShellPortal>
  );
}

export interface FullScreenDialogProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  /** The confirming action at the end of the bar ("Sichern"). */
  action?: { label: string; onClick: () => void; disabled?: boolean };
  children: ReactNode;
  className?: string;
}

/**
 * Android: the Material 3 full-screen dialog for creating and editing: × left, title, the
 * confirming action right. (iOS uses a large <Sheet> for the same job.)
 */
export function FullScreenDialog({ open, onClose, title, action, children, className }: FullScreenDialogProps) {
  const { mounted, closing } = usePresence(open, 260);
  const labels = useLabels();
  const ref = useRef<HTMLDivElement>(null);
  const titleId = useId();
  useModalFocus(ref, open, onClose);
  if (!mounted) return null;
  return (
    <ShellPortal>
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={clsx("uwu-fullscreen", className)}
        data-platform="android"
        data-closing={closing ? "" : undefined}
      >
        <div className="uwu-fullscreen-header">
          <NavButton platform="android" label={labels.close} icon={X} onClick={onClose} />
          <h2 id={titleId} className="uwu-fullscreen-title">
            {title}
          </h2>
          {action && (
            <NavButton
              platform="android"
              label={action.label}
              text
              tint
              disabled={action.disabled}
              onClick={action.onClick}
            />
          )}
        </div>
        <div className="uwu-fullscreen-body">{children}</div>
      </div>
    </ShellPortal>
  );
}
