import { clsx } from "clsx";
import type { LucideIcon, LucideProps } from "lucide-react";

/**
 * Every icon in the suite goes through <Icon>, so size and stroke follow the rules in
 * docs/icons.md without anyone remembering numbers:
 *
 *   xs 14 px · stroke 2      inline in dense text, badges, chips
 *   sm 16 px · stroke 1.8    buttons, menu items, list rows, fields   (default)
 *   md 18 px · stroke 1.8    icon buttons, navigation, title bar
 *   lg 20 px · stroke 1.8    toolbars on touch, tabs with a device
 *   xl 24 px · stroke 1.6    cards, setting groups, dialogs' lead icon
 *
 * Icons are decoration unless they stand alone: then pass `label` (or give the button a label).
 */

export const ICON_SIZES = {
  xs: { px: 14, stroke: 2 },
  sm: { px: 16, stroke: 1.8 },
  md: { px: 18, stroke: 1.8 },
  lg: { px: 20, stroke: 1.8 },
  xl: { px: 24, stroke: 1.6 },
} as const;

export type IconSize = keyof typeof ICON_SIZES;

export interface IconProps extends Omit<LucideProps, "size" | "ref"> {
  icon: LucideIcon;
  size?: IconSize;
  /** Makes the icon an image with this name. Leave it out when a text or button label says it. */
  label?: string;
}

export function Icon({ icon: Glyph, size = "sm", label, className, strokeWidth, ...rest }: IconProps) {
  const spec = ICON_SIZES[size];
  return (
    <Glyph
      size={spec.px}
      strokeWidth={strokeWidth ?? spec.stroke}
      className={clsx("uwu-icon shrink-0", className)}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? "img" : undefined}
      focusable="false"
      {...rest}
    />
  );
}
