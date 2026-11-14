import { useEffect, useRef, useState } from "react";
import { motionAllowed, tokenMs } from "../lib/motion.js";

export interface CountUpProps {
  value: number;
  /** Turns the number into text. Default: grouped in the page's language (`<html lang>`). */
  format?: (n: number) => string;
  className?: string;
}

const defaultFormat = (n: number) =>
  new Intl.NumberFormat((typeof document !== "undefined" && document.documentElement.lang) || undefined).format(n);

/**
 * A number that counts up to its value when it appears, and from the old to the new value when it
 * changes. Screen readers only get the final value. Under reduced motion it just shows the value.
 */
export function CountUp({ value, format = defaultFormat, className }: CountUpProps) {
  const target = Number.isFinite(value) ? value : 0;
  const [shown, setShown] = useState(() => (motionAllowed() ? 0 : target));
  const from = useRef(shown);

  useEffect(() => {
    const start = from.current;
    if (!motionAllowed() || start === target) {
      from.current = target;
      setShown(target);
      return;
    }
    const duration = tokenMs("--uwu-duration-count", 600);
    // The first frame is the start: a frame's timestamp can lie before performance.now().
    let t0: number | undefined;
    let frame = requestAnimationFrame(function step(now) {
      t0 ??= now;
      const t = Math.min(1, (now - t0) / duration);
      const v = t >= 1 ? target : start + (target - start) * (1 - (1 - t) ** 3); // ease-out cubic
      from.current = v;
      setShown(v);
      if (t < 1) frame = requestAnimationFrame(step);
    });
    return () => cancelAnimationFrame(frame);
  }, [target]);

  return (
    <span className={className}>
      {/* Whole numbers count in whole steps. */}
      <span aria-hidden="true">{format(Number.isInteger(target) ? Math.round(shown) : shown)}</span>
      <span className="sr-only">{format(target)}</span>
    </span>
  );
}
