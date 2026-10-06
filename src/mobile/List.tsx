import { clsx } from "clsx";
import { ChevronRight, type LucideIcon } from "lucide-react";
import type { HTMLAttributes, ReactNode } from "react";
import type { MobilePlatform } from "./device.js";
import { haptic } from "./haptics.js";
import { useMobilePlatform, type LongPressHandlers } from "./hooks.js";

export interface GroupedListProps {
  platform?: MobilePlatform;
  children: ReactNode;
  className?: string;
}

/**
 * The wrapper for grouped inset lists: iOS settings-style cards, Android M3 list items. Holds
 * `ListSection`s. Detail, edit and settings pages are built from these.
 */
export function GroupedList({ platform: explicit, children, className }: GroupedListProps) {
  const platform = useMobilePlatform(explicit);
  return (
    <div className={clsx("uwu-grouped", className)} data-platform={platform}>
      {children}
    </div>
  );
}

export interface ListSectionProps {
  /** Title above the card (sentence case, not uppercase). */
  header?: ReactNode;
  /** A small action at the header's end (a "+" for a new folder). */
  headerAction?: ReactNode;
  /** A note under the card. */
  footer?: ReactNode;
  children: ReactNode;
  className?: string;
}

/** One rounded card of rows with an optional header and footer. */
export function ListSection({ header, headerAction, footer, children, className }: ListSectionProps) {
  return (
    <section className={clsx("uwu-list", className)}>
      {(header || headerAction) && (
        <div className="uwu-list-header">
          <h2 style={{ font: "inherit", margin: 0 }}>{header}</h2>
          {headerAction}
        </div>
      )}
      <div className="uwu-list-body">{children}</div>
      {footer && <p className="uwu-list-footer">{footer}</p>}
    </section>
  );
}

export type RowTone = "pink" | "success" | "warning" | "danger" | "neutral" | "solid" | "none";

export interface ListRowProps extends Omit<HTMLAttributes<HTMLElement>, "title" | "onCopy"> {
  /** The main text. In a field row (`label` set) this is the value. */
  title: ReactNode;
  subtitle?: ReactNode;
  /** A field's name above its value ("Benutzername"). Makes it a field row (detail pages). */
  label?: ReactNode;
  /** A value at the end ("12", "Aus"). */
  value?: ReactNode;
  /** A Lucide icon in a tinted square, or any node (an item's own icon tile). */
  icon?: LucideIcon | ReactNode;
  iconTone?: RowTone;
  /** Shows the disclosure chevron (iOS; Android hides it). Defaults to true when `onClick` is set. */
  chevron?: boolean;
  /** Buttons or a switch at the end. */
  trailing?: ReactNode;
  /** Monospace value (passwords, codes). */
  mono?: boolean;
  /** Let the title wrap instead of ending in "…" (notes). */
  wrap?: boolean;
  /** `danger`: a centred red action row ("Löschen"); `accent`: a pink action row ("Feld hinzufügen"). */
  tone?: "default" | "danger" | "accent";
  selected?: boolean;
  /**
   * Tap to copy: the whole row is the button. The app copies (it knows whether the clipboard must
   * be cleared later) and shows the toast; the row adds the haptic tick and tells screen readers
   * that a tap copies.
   */
  onCopy?: () => void;
  /** What screen readers hear after the row when it copies. Defaults to "kopieren". */
  copyLabel?: string;
  onClick?: () => void;
  /** From `useLongPress()`: opens the context menu. */
  longPress?: LongPressHandlers;
  disabled?: boolean;
}

function isComponent(icon: unknown): icon is LucideIcon {
  return (
    typeof icon === "function" || (typeof icon === "object" && icon !== null && "$$typeof" in icon && "render" in icon)
  );
}

/** One row of a grouped list. */
export function ListRow({
  title,
  subtitle,
  label,
  value,
  icon,
  iconTone = "pink",
  chevron,
  trailing,
  mono,
  wrap,
  tone = "default",
  selected,
  onCopy,
  copyLabel,
  onClick,
  longPress,
  disabled,
  className,
  ...rest
}: ListRowProps) {
  const action = onCopy
    ? () => {
        haptic("success");
        onCopy();
      }
    : onClick;
  const showChevron = chevron ?? (!!onClick && !onCopy && tone === "default");
  const Glyph = isComponent(icon) ? icon : null;
  const content = (
    <>
      {icon !== undefined && icon !== null && (
        <span className="uwu-row-icon" data-tone={iconTone}>
          {Glyph ? <Glyph aria-hidden strokeWidth={1.9} /> : (icon as ReactNode)}
        </span>
      )}
      {tone === "default" ? (
        <span className="uwu-row-text">
          {label && <span className="uwu-row-label">{label}</span>}
          <span className="uwu-row-title" data-mono={mono ? "" : undefined} data-wrap={wrap ? "" : undefined}>
            {title}
          </span>
          {subtitle && <span className="uwu-row-subtitle">{subtitle}</span>}
        </span>
      ) : (
        title
      )}
      {value !== undefined && <span className="uwu-row-value">{value}</span>}
      {trailing && <span className="uwu-row-trailing">{trailing}</span>}
      {showChevron && <ChevronRight className="uwu-row-chevron" aria-hidden />}
      {onCopy && <span className="uwu-visually-hidden">, {copyLabel ?? "kopieren"}</span>}
    </>
  );
  const common = {
    ...rest,
    ...longPress,
    className: clsx("uwu-row", className),
    "data-field": label ? "" : undefined,
    "data-tone": tone === "default" ? undefined : tone,
    "data-selected": selected ? "" : undefined,
  };
  if (!action) return <div {...common}>{content}</div>;
  // Rows with their own buttons can't be a <button> (no nested buttons): the row is a pressable
  // div with a button role then, and Enter/Space work as on a button.
  if (trailing)
    return (
      <div
        {...common}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled || undefined}
        data-pressable=""
        onClick={(event) => {
          if (disabled || (event.target as HTMLElement).closest("button, a, input, [role=switch]")) return;
          action();
        }}
        onKeyDown={(event) => {
          if (disabled || event.target !== event.currentTarget) return;
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            action();
          }
        }}
      >
        {content}
      </div>
    );
  return (
    <button {...common} type="button" disabled={disabled} onClick={action}>
      {content}
    </button>
  );
}

/** Copies text with the browser clipboard; resolves false where that is not allowed. */
export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
