import { clsx } from "clsx";
import type { LucideIcon } from "lucide-react";
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { Icon } from "../icons/Icon";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: LucideIcon;
  busy?: boolean;
  /** Shown instead of the spinner while busy, e.g. <NyuThinking /> while the AI works. */
  busyIndicator?: ReactNode;
}

/** One primary button per view; it carries the action the view is for. docs/components.md */
export const BUTTON_VARIANTS: Record<ButtonVariant, string> = {
  primary: "bg-pink-solid text-on-pink shadow-primary hover:bg-pink-solid-hover",
  secondary: "border border-line bg-surface text-ink hover:border-faint/50 hover:bg-elevated",
  ghost: "text-ink hover:bg-pink-tint/60",
  danger: "border border-line bg-surface text-danger-ink hover:bg-danger-tint",
};

export const BUTTON_SIZES: Record<ButtonSize, string> = {
  sm: "h-8 gap-1.5 px-3 text-meta",
  md: "h-10 gap-2 px-4 text-body",
  lg: "h-12 gap-2 px-6 text-[15px]",
};

/** The busy button's turning ring. */
export function Spinner({ className }: { className?: string }) {
  return (
    <span
      className={clsx(
        "inline-block size-4 animate-spin rounded-full border-2 border-current border-t-transparent",
        className,
      )}
      aria-hidden
    />
  );
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = "secondary",
    size = "md",
    icon,
    busy,
    busyIndicator,
    className,
    children,
    disabled,
    type = "button",
    ...rest
  },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={clsx(
        "inline-flex shrink-0 items-center justify-center rounded-full font-semibold whitespace-nowrap transition-[background,box-shadow,transform,border-color] duration-150 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-55",
        // Long German words wrap on a phone instead of pushing the button off the screen.
        "phone:h-auto phone:min-h-10 phone:whitespace-normal",
        BUTTON_VARIANTS[variant],
        BUTTON_SIZES[size],
        className,
      )}
      disabled={disabled || busy}
      aria-busy={busy || undefined}
      {...rest}
    >
      {busy ? (busyIndicator ?? <Spinner />) : icon && <Icon icon={icon} strokeWidth={2.2} />}
      {children}
    </button>
  );
});

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon;
  /** Required: an icon button has no text, so this is its name (and its tooltip). */
  label: string;
  active?: boolean;
  size?: "sm" | "md";
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { icon, label, active, size = "md", className, type = "button", ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      aria-label={label}
      title={label}
      aria-pressed={active}
      className={clsx(
        "inline-flex shrink-0 items-center justify-center rounded-full transition-colors duration-150 disabled:opacity-40",
        size === "md" ? "size-9" : "size-8",
        active ? "bg-pink-tint text-pink-ink" : "text-muted hover:bg-pink-tint/60 hover:text-ink",
        className,
      )}
      {...rest}
    >
      <Icon icon={icon} size={size === "md" ? "md" : "sm"} />
    </button>
  );
});
