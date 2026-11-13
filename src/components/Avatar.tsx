import { Blobatar } from "@blobatar/react";
import { clsx } from "clsx";

export const AVATAR_COLORS = ["pink", "violet", "sky", "mint", "amber", "coral"] as const;
export type AvatarColor = (typeof AVATAR_COLORS)[number];

const SIZES = { sm: "size-7", md: "size-9", lg: "size-12" } as const;

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

/**
 * The face of someone without a picture: a blobatar (blobatar.dev) drawn from the seed, the same
 * seed always the same blob. It fills its parent and brings no backdrop of its own.
 * Moves on hover, still under reduced motion; needs the package's CSS (tailwind.css or plain.css).
 */
export function AvatarBlob({ seed, className }: { seed: string; className?: string }) {
  return (
    <Blobatar
      aria-hidden="true"
      animate="hover"
      className={clsx("size-full", className)}
      name={seed.trim().toLowerCase()}
    />
  );
}

export interface AvatarProps {
  name: string;
  /** A picture; a blob is the fallback. */
  src?: string;
  /** What the blob grows from, e.g. the e-mail address. Defaults to `name`. */
  seed?: string;
  size?: keyof typeof SIZES;
  className?: string;
}

export function Avatar({ name, src, seed, size = "md", className }: AvatarProps) {
  return (
    <span
      className={clsx(
        "inline-grid shrink-0 place-items-center overflow-hidden rounded-full select-none",
        SIZES[size],
        className,
      )}
      aria-hidden
    >
      {src ? <img src={src} alt="" className="size-full object-cover" /> : <AvatarBlob seed={seed ?? name} />}
    </span>
  );
}
