import { clsx } from "clsx";
import { RefreshCw } from "lucide-react";
import { useRef, useState, type CSSProperties, type ReactNode, type RefObject } from "react";
import { useLabels } from "../lib/labels.js";
import type { MobilePlatform } from "./device.js";
import { useDrag } from "./drag.js";
import { dragAxis, PULL_ARM_DISTANCE, pullArmed, pullDistance } from "./gestures.js";
import { haptic } from "./haptics.js";
import { useMobilePlatform } from "./hooks.js";

export interface PullToRefreshProps {
  /** Sync. The indicator spins until the promise settles. */
  onRefresh: () => Promise<unknown> | void;
  /** The scrolling element; a pull only starts when it is at the top. Defaults to the parent. */
  scrollRef?: RefObject<HTMLElement | null>;
  platform?: MobilePlatform;
  disabled?: boolean;
  children: ReactNode;
  className?: string;
}

/** Where the content rests while refreshing (iOS). */
const HOLD = 62;

/**
 * Pull to refresh (pull-to-sync). iOS: the content follows the finger with growing resistance and
 * uncovers a spinner and a line of text. Android: a round indicator slides down over the content.
 * Pulled past 66 px it arms (with a haptic tick) and releasing refreshes.
 */
export function PullToRefresh({
  onRefresh,
  scrollRef,
  platform: explicit,
  disabled,
  children,
  className,
}: PullToRefreshProps) {
  const platform = useMobilePlatform(explicit);
  const labels = useLabels();
  const root = useRef<HTMLDivElement>(null);
  const [pull, setPull] = useState(0);
  const [pulling, setPulling] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const claimed = useRef<"pending" | "pull" | "no">("pending");
  const armed = useRef(false);

  useDrag(
    root,
    {
      start: () => {
        const scroller = scrollRef?.current ?? root.current?.parentElement;
        if (refreshing || (scroller && scroller.scrollTop > 0)) return false;
        claimed.current = "pending";
        armed.current = false;
      },
      move: ({ dx, dy }) => {
        if (claimed.current === "pending") {
          const axis = dragAxis(dx, dy, 1);
          if (axis === "pending") return false;
          claimed.current = axis === "vertical" && dy > 0 ? "pull" : "no";
          if (claimed.current === "pull") setPulling(true);
        }
        if (claimed.current !== "pull") return false;
        const d = pullDistance(dy);
        setPull(d);
        const now = pullArmed(d);
        if (now !== armed.current) {
          armed.current = now;
          if (now) haptic("selection");
        }
        return true;
      },
      end: () => {
        if (claimed.current !== "pull") return;
        claimed.current = "pending";
        setPulling(false);
        if (!armed.current) {
          setPull(0);
          return;
        }
        setRefreshing(true);
        setPull(platform === "android" ? 0 : HOLD);
        Promise.resolve()
          .then(onRefresh)
          .catch(() => {})
          .finally(() => {
            setRefreshing(false);
            setPull(0);
          });
      },
    },
    !disabled,
  );

  const android = platform === "android";
  const shown = refreshing ? 1 : Math.min(1, pull / (android ? 50 : 55));
  const indicator: CSSProperties = android
    ? {
        opacity: shown,
        transform: `translateY(${refreshing ? 56 : pull - 60}px) rotate(${pull * 3}deg)`,
        transition: pulling ? "none" : "transform 250ms, opacity 250ms",
      }
    : { opacity: shown };
  const text = refreshing
    ? labels.refreshing
    : pull > PULL_ARM_DISTANCE
      ? labels.releaseToRefresh
      : labels.pullToRefresh;

  return (
    <div
      ref={root}
      className={clsx("uwu-ptr", className)}
      data-platform={platform}
      data-pulling={pulling ? "" : undefined}
      data-refreshing={refreshing ? "" : undefined}
      aria-busy={refreshing || undefined}
    >
      <div className="uwu-ptr-indicator" style={indicator} role={refreshing ? "status" : undefined}>
        <RefreshCw aria-hidden style={!android && !refreshing ? { rotate: `${pull * 3}deg` } : undefined} />
        {android ? <span className="uwu-visually-hidden">{refreshing ? text : ""}</span> : <span>{text}</span>}
      </div>
      <div className="uwu-ptr-content" style={android || !pull ? undefined : { transform: `translateY(${pull}px)` }}>
        {children}
      </div>
    </div>
  );
}
