import { clsx } from "clsx";

export const AVATAR_COLORS = ["pink", "violet", "sky", "mint", "amber", "coral"] as const;
export type AvatarColor = (typeof AVATAR_COLORS)[number];

const COLOR_CLASSES: Record<AvatarColor, string> = {
  pink: "bg-avatar-pink text-avatar-pink-ink",
  violet: "bg-avatar-violet text-avatar-violet-ink",
  sky: "bg-avatar-sky text-avatar-sky-ink",
  mint: "bg-avatar-mint text-avatar-mint-ink",
  amber: "bg-avatar-amber text-avatar-amber-ink",
  coral: "bg-avatar-coral text-avatar-coral-ink",
};

/** The initials keep their size with the circle: they don't follow the text size. */
const SIZES = { sm: "size-7 text-[11px]", md: "size-9 text-[13px]", lg: "size-12 text-[17px]" } as const;

/** A stable colour for a name or address, so the same person always looks the same. */
export function avatarColor(seed: string): AvatarColor {
  let hash = 0;
  for (const char of seed.toLowerCase()) hash = (hash * 31 + char.charCodeAt(0)) | 0;
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length] ?? "pink";
}

/** The first letters of up to two words. */
export function initials(name: string) {
  const words = name
    .trim()
    .split(/[\s@._-]+/)
    .filter(Boolean);
  return words
    .slice(0, 2)
    .map((word) => [...word][0]?.toUpperCase() ?? "")
    .join("");
}

export interface AvatarProps {
  name: string;
  /** A picture; initials are the fallback. */
  src?: string;
  color?: AvatarColor;
  size?: keyof typeof SIZES;
  className?: string;
}

export function Avatar({ name, src, color, size = "md", className }: AvatarProps) {
  return (
    <span
      className={clsx(
        "inline-grid shrink-0 place-items-center overflow-hidden rounded-full font-bold select-none",
        SIZES[size],
        !src && COLOR_CLASSES[color ?? avatarColor(name)],
        className,
      )}
      aria-hidden
    >
      {src ? <img src={src} alt="" className="size-full object-cover" /> : initials(name)}
    </span>
  );
}
