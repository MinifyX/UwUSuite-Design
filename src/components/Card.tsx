import { clsx } from "clsx";
import type { LucideIcon } from "lucide-react";
import type { HTMLAttributes, ReactNode } from "react";
import { Icon } from "../icons/Icon.js";

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
            {title && <h2 className="text-[15px] font-bold">{title}</h2>}
            {subtitle && <span className="text-[12.5px] text-muted">{subtitle}</span>}
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
  /** The control: Switch, Segmented, Select, a button. */
  children: ReactNode;
  htmlFor?: string;
}

/** One line in a settings page: what it is on the left, the control on the right. From UwUMirror. */
export function SettingRow({ label, description, children, htmlFor }: SettingRowProps) {
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-hairline py-3.5 last:border-b-0">
      <div className="flex min-w-[220px] flex-1 flex-col gap-0.5">
        <label htmlFor={htmlFor} className="text-body font-semibold">
          {label}
        </label>
        {description && <p className="text-[12.5px] text-muted">{description}</p>}
      </div>
      <div className="shrink-0">{children}</div>
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
