import { clsx } from "clsx";
import type { ReactNode } from "react";
import { NYU, nyuSvg, type NyuMood, type NyuShell } from "./svg";

export { NYU, MOODS, SHELLS, VIEWBOX, type NyuMood, type NyuShell } from "./svg";

/** Draws its children twice: first as the white die-cut edge, then as they are. */
export function Sticker({ edge, children }: { edge: number; children: ReactNode }) {
  return (
    <>
      <g className="nyu-edge" strokeWidth={edge}>
        {children}
      </g>
      {children}
    </>
  );
}

const line = { fill: "none", stroke: NYU.ink, strokeWidth: 8 } as const;

/** Eyes per mood on the suite's 256 grid (terminal, monitor, page, lock, mirror, badge, box). */
const EYES: Record<NyuMood, ReactNode> = {
  uwu: (
    <g {...line}>
      <path d="M88 142 Q102 160 116 142" />
      <path d="M140 142 Q154 160 168 142" />
    </g>
  ),
  happy: (
    <g>
      <g fill={NYU.ink}>
        <ellipse cx="102" cy="148" rx="8" ry="10" />
        <ellipse cx="154" cy="148" rx="8" ry="10" />
      </g>
      <g fill={NYU.paper} className="no-edge">
        <circle cx="105" cy="144" r="3" />
        <circle cx="157" cy="144" r="3" />
      </g>
    </g>
  ),
  cheer: (
    <g {...line}>
      <path d="M92 138 L110 148 L92 158" />
      <path d="M164 138 L146 148 L164 158" />
    </g>
  ),
  sparkle: (
    <g fill={NYU.star} stroke={NYU.ink} strokeWidth={4}>
      <path d="M102 134 Q104 146 116 148 Q104 150 102 162 Q100 150 88 148 Q100 146 102 134Z" />
      <path d="M154 134 Q156 146 168 148 Q156 150 154 162 Q152 150 140 148 Q152 146 154 134Z" />
    </g>
  ),
  sad: (
    <g>
      <g {...line}>
        <path d="M90 152 Q102 142 114 152" />
        <path d="M142 152 Q154 142 166 152" />
      </g>
      <g fill={NYU.tear} stroke={NYU.ink} strokeWidth={4}>
        <path d="M94 158 q-6 9 0 13 q6 -4 0 -13Z" />
        <path d="M162 158 q-6 9 0 13 q6 -4 0 -13Z" />
      </g>
    </g>
  ),
  puzzled: (
    <g fill={NYU.ink}>
      <circle cx="102" cy="148" r="7" />
      <circle cx="154" cy="148" r="7" />
    </g>
  ),
  sleepy: (
    <g {...line}>
      <path d="M90 150 q12 8 24 0" />
      <path d="M142 150 q12 8 24 0" />
    </g>
  ),
};

const W_MOUTH = <path d="M112 170 q8 13 16 0 q8 13 16 0" {...line} />;

const MOUTHS: Record<NyuMood, ReactNode> = {
  uwu: W_MOUTH,
  happy: W_MOUTH,
  sparkle: W_MOUTH,
  cheer: <path d="M114 170 Q128 194 142 170 Z" fill={NYU.ink} stroke={NYU.ink} strokeWidth={6} />,
  sad: <path d="M114 184 Q128 172 142 184" {...line} />,
  puzzled: <path d="M114 180 q7 -6 14 0 q7 6 14 0" {...line} strokeWidth={7} />,
  sleepy: <path d="M120 180 q4 5 8 0 q4 5 8 0" {...line} strokeWidth={6} />,
};

export interface NyuFaceProps {
  mood?: NyuMood;
  /** Moves the whole face up or down, e.g. -46 for the box cat. */
  dy?: number;
  /** Replaces the mood's eyes, e.g. pupils that follow something. The mouth stays the mood's. */
  eyes?: ReactNode;
}

/**
 * Nyu's face on the 256 grid: blush, eyes and mouth exactly where every shell expects them. A new
 * app draws its shell (ears + body) and puts <NyuFace> on top; see docs/nyu.md.
 */
export function NyuFace({ mood = "uwu", dy = 0, eyes }: NyuFaceProps) {
  return (
    <g transform={dy ? `translate(0 ${dy})` : undefined}>
      {mood !== "puzzled" && (
        <g className="no-edge" fill={NYU.blushSolid} opacity={0.5}>
          <ellipse cx={74} cy={168} rx={12} ry={7.5} />
          <ellipse cx={182} cy={168} rx={12} ry={7.5} />
        </g>
      )}
      <g className="nyu-face">
        <g className={mood === "sleepy" ? "nyu-look" : "nyu-look nyu-eyes"}>{eyes ?? EYES[mood]}</g>
        <g className="nyu-look">{MOUTHS[mood]}</g>
      </g>
    </g>
  );
}

/** The two pointed ears every 256-grid shell shares, behind the body. */
export function NyuEars({ y = 0 }: { y?: number }) {
  return (
    <g transform={y ? `translate(0 ${y})` : undefined}>
      <g className="nyu-ear nyu-ear-l">
        <path d="M62 88 L80 36 L114 88 Z" fill={NYU.body} stroke={NYU.ink} strokeWidth={9} />
        <path d="M76 82 L84 52 L100 82 Z" fill={NYU.flap} />
      </g>
      <g className="nyu-ear nyu-ear-r">
        <path d="M142 88 L176 36 L194 88 Z" fill={NYU.body} stroke={NYU.ink} strokeWidth={9} />
        <path d="M156 82 L172 52 L180 82 Z" fill={NYU.flap} />
      </g>
    </g>
  );
}

/** A paw on the 256 grid. */
export function Paw({ x, y, className }: { x: number; y: number; className?: string }) {
  return (
    <g className={className}>
      <ellipse cx={x} cy={y} rx="17" ry="13" fill={NYU.body} stroke={NYU.ink} strokeWidth={8} />
      <path d={`M${x - 4} ${y + 2} v6 M${x + 4} ${y + 2} v6`} fill="none" stroke={NYU.ink} strokeWidth={4.5} />
    </g>
  );
}

export interface NyuProps {
  /** Which app's Nyu: mail (UwUMail), mirror (UwUMirror), terminal (UwUSSH), monitor (UwURDP),
   *  page (UwUNotes), lock (UwULock), badge (UwUAuth), box (UwUSuite). */
  shell?: NyuShell;
  mood?: NyuMood;
  /** Height (px, or any CSS length such as "1.35em"); the width follows the shell. */
  size?: number | string;
  /** On by default; stops on its own when motion is reduced. */
  blink?: boolean;
  /** Accessible name. Pass "" when the text next to it already says it (the wordmark). */
  title?: string;
  className?: string;
}

/** Nyu on her own, from the suite's catalogue: title bar, about pages, empty states. */
export function Nyu({ shell = "box", mood = "uwu", size = 96, blink = true, title = "Nyu", className }: NyuProps) {
  return (
    <span
      className={clsx("inline-flex shrink-0 [&>svg]:h-full [&>svg]:w-auto", className)}
      style={{ height: size }}
      // The markup comes from the package's own constants; the only outside string (the title) is escaped.
      dangerouslySetInnerHTML={{ __html: nyuSvg({ shell, mood, label: title, blink }) }}
    />
  );
}
