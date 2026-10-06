import { useEffect, useRef, type RefObject } from "react";

export interface DragPoint {
  x: number;
  y: number;
  dx: number;
  dy: number;
  /** ms since the drag started */
  t: number;
  /** px/ms over the last move, along y and x */
  vx: number;
  vy: number;
}

export interface DragHandlers {
  /** Return false to ignore this drag (e.g. the list is not scrolled to the top). */
  start?: (point: DragPoint, target: EventTarget | null) => boolean | void;
  /** Return true once the drag is this component's, so the page does not scroll as well. */
  move: (point: DragPoint) => boolean | void;
  end: (point: DragPoint) => void;
}

/**
 * One drag source for touch and mouse (the styleguide and an iPad with a trackpad). Touch moves
 * are not passive, so a drag that a component claims stops the page from scrolling.
 */
export function useDrag(ref: RefObject<HTMLElement | null>, handlers: DragHandlers, enabled = true): void {
  const latest = useRef(handlers);
  useEffect(() => {
    latest.current = handlers;
  });

  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;
    let origin: { x: number; y: number; t: number } | null = null;
    let last = { x: 0, y: 0, t: 0, vx: 0, vy: 0 };

    const point = (x: number, y: number, t: number): DragPoint => {
      const dt = Math.max(1, t - last.t);
      const vx = (x - last.x) / dt;
      const vy = (y - last.y) / dt;
      return { x, y, dx: x - origin!.x, dy: y - origin!.y, t: t - origin!.t, vx, vy };
    };

    const begin = (x: number, y: number, t: number, target: EventTarget | null) => {
      origin = { x, y, t };
      last = { x, y, t, vx: 0, vy: 0 };
      if (latest.current.start?.(point(x, y, t), target) === false) origin = null;
    };
    const go = (x: number, y: number, t: number, event: Event) => {
      if (!origin) return;
      const p = point(x, y, t);
      last = { x, y, t, vx: p.vx, vy: p.vy };
      if (latest.current.move(p) && event.cancelable) event.preventDefault();
    };
    const finish = () => {
      if (!origin) return;
      const p = {
        x: last.x,
        y: last.y,
        dx: last.x - origin.x,
        dy: last.y - origin.y,
        t: last.t - origin.t,
        vx: last.vx,
        vy: last.vy,
      };
      origin = null;
      latest.current.end(p);
    };

    const touchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (touch && e.touches.length === 1) begin(touch.clientX, touch.clientY, e.timeStamp, e.target);
    };
    const touchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (touch) go(touch.clientX, touch.clientY, e.timeStamp, e);
    };
    const mouseDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      begin(e.clientX, e.clientY, e.timeStamp, e.target);
      window.addEventListener("pointermove", mouseMove);
      window.addEventListener("pointerup", mouseUp);
    };
    const mouseMove = (e: PointerEvent) => go(e.clientX, e.clientY, e.timeStamp, e);
    const mouseUp = () => {
      window.removeEventListener("pointermove", mouseMove);
      window.removeEventListener("pointerup", mouseUp);
      finish();
    };

    el.addEventListener("touchstart", touchStart, { passive: true });
    el.addEventListener("touchmove", touchMove, { passive: false });
    el.addEventListener("touchend", finish);
    el.addEventListener("touchcancel", finish);
    el.addEventListener("pointerdown", mouseDown);
    return () => {
      el.removeEventListener("touchstart", touchStart);
      el.removeEventListener("touchmove", touchMove);
      el.removeEventListener("touchend", finish);
      el.removeEventListener("touchcancel", finish);
      el.removeEventListener("pointerdown", mouseDown);
      window.removeEventListener("pointermove", mouseMove);
      window.removeEventListener("pointerup", mouseUp);
    };
  }, [ref, enabled]);
}
