import { clsx } from "clsx";
import type { LucideIcon } from "lucide-react";
import { useId, type HTMLAttributes, type ReactNode } from "react";
import { Icon } from "../icons/Icon.js";
import { CountUp } from "./CountUp.js";

export interface CardProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  title?: ReactNode;
  /** One line under the title. */
  subtitle?: ReactNode;
  /** A lead icon in a pink tile (UwUMirror's start cards). */
  icon?: LucideIcon;
  /** A control on the right of the header: a switch, a button. */
  aside?: ReactNode;
}

/** A white surface on the canvas with a hairline border. No shadow: cards don't float. */
export function Card({ title, subtitle, icon, aside, className, children, ...rest }: CardProps) {
  return (
    <section
      // Buttons keep their own width instead of stretching across the card.
      className={clsx(
        "flex flex-col gap-3.5 rounded-card border border-hairline bg-surface p-5 [&>button]:self-start",
        className,
      )}
      {...rest}
    >
      {(title || aside) && (
        <header className="flex items-start gap-3">
          {icon && (
            <span className="grid size-[38px] shrink-0 place-items-center rounded-xl bg-pink-tint text-pink-ink">
              <Icon icon={icon} size="lg" />
            </span>
          )}
          <span className="flex min-w-0 flex-1 flex-col gap-0.5">
            {title && <h2 className="text-[calc(var(--uwu-text-body)+1px)] font-bold">{title}</h2>}
            {subtitle && <span className="text-[calc(var(--uwu-text-caption)+0.5px)] text-muted">{subtitle}</span>}
          </span>
          {aside}
        </header>
      )}
      {children}
    </section>
  );
}

export interface SettingRowProps {
  label: ReactNode;
  description?: ReactNode;
  /**
   * The control: Switch, Segmented, Select, a button. As a function it gets the ids that tie it to
   * the label and the description (`<Switch id={id} aria-describedby={describedBy} />`).
   */
  children: ReactNode | ((ids: { id: string; describedBy?: string }) => ReactNode);
  /** Ties the label to a control that brings its own id; not needed with a function child. */
  htmlFor?: string;
  /** Fades the whole row; disable the control itself too. */
  disabled?: boolean;
  /** False keeps the control beside the text on narrow screens (a switch); default true. */
  wrap?: boolean;
  className?: string;
}

/** One line in a settings page: what it is on the left, the control on the right. From UwUMirror. */
export function SettingRow({
  label,
  description,
  children,
  htmlFor,
  disabled = false,
  wrap = true,
  className,
}: SettingRowProps) {
  const id = useId();
  const descriptionId = description ? `${id}-description` : undefined;
  const ids = typeof children === "function";
  return (
    <div
      className={clsx(
        "flex items-center gap-x-6 gap-y-2 border-b border-hairline py-3.5 last:border-b-0",
        wrap && "flex-wrap",
        disabled && "opacity-60",
        className,
      )}
    >
      <div className={clsx("flex flex-1 flex-col gap-0.5", wrap ? "min-w-[min(220px,100%)]" : "min-w-0")}>
        <label htmlFor={ids ? id : htmlFor} className="text-body font-semibold">
          {label}
        </label>
        {description && (
          <p id={descriptionId} className="text-[calc(var(--uwu-text-caption)+0.5px)] text-muted">
            {description}
          </p>
        )}
      </div>
      <div className={clsx("max-w-full shrink-0", !wrap && "self-start pt-0.5")}>
        {typeof children === "function" ? children({ id, describedBy: descriptionId }) : children}
      </div>
    </div>
  );
}

export type StatTone = "normal" | "warning" | "danger";

const STAT_TONES: Record<StatTone, string> = {
  normal: "text-pink-ink",
  warning: "text-warning-ink",
  danger: "text-danger-ink",
};

export interface StatTileProps {
  label: ReactNode;
  /** A number counts up when the tile appears (`CountUp`); text shows as it is. */
  value: ReactNode;
  /** Formats a numeric `value`. */
  format?: (n: number) => string;
  icon?: LucideIcon;
  /** A line under it that says in words what is wrong, so colour is never the only hint. */
  note?: ReactNode;
  /** Colours only the icon. */
  tone?: StatTone;
  /** Something under the value, such as a `ProgressBar kind="usage"`. */
  children?: ReactNode;
  className?: string;
}

/** One number on an overview: the icon, the value big, what it is below. From UwUMail's portal. */
export function StatTile({ label, value, format, icon, note, tone = "normal", children, className }: StatTileProps) {
  return (
    <div className={clsx("flex min-w-0 flex-col rounded-card border border-hairline bg-surface p-4", className)}>
      {icon && <Icon icon={icon} size="lg" className={clsx("mb-2", STAT_TONES[tone])} />}
      <p className="truncate text-section leading-tight font-bold tabular-nums">
        {typeof value === "number" ? <CountUp value={value} format={format} /> : value}
      </p>
      <p className="mt-0.5 truncate text-meta text-muted">{label}</p>
      {children && <div className="mt-2">{children}</div>}
      {note && <p className="mt-1 text-caption text-muted">{note}</p>}
    </div>
  );
}

export type HintTone = "info" | "warning" | "danger" | "success";

const HINT_TONES: Record<HintTone, string> = {
  info: "border-hairline bg-elevated text-ink",
  warning: "border-warning/40 bg-warning-tint text-warning-ink",
  danger: "border-danger/40 bg-danger-tint text-danger-ink",
  success: "border-success/40 bg-success-tint text-success-ink",
};

/** A short note inside a card or dialog: a firewall hint, a missing codec, a tip. */
export function Hint({ tone = "info", className, ...rest }: HTMLAttributes<HTMLDivElement> & { tone?: HintTone }) {
  return (
    <div
      role={tone === "danger" ? "alert" : undefined}
      className={clsx("rounded-control border px-3.5 py-2.5 text-meta leading-relaxed", HINT_TONES[tone], className)}
      {...rest}
    />
  );
}
