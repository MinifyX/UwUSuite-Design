import { clsx } from "clsx";
import type { ReactNode } from "react";
import { useLabels } from "../lib/labels.js";

/** The desktop platform, for chrome decisions: title bar, menus, shortcut text. */
export type Platform = "windows" | "linux" | "mac";

export interface WindowControls {
  maximized: boolean;
  minimize: () => void;
  toggleMaximize: () => void;
  close: () => void;
}

export interface TitleBarProps {
  /** Usually <Wordmark shell=… product=… />. */
  brand: ReactNode;
  /** Between brand and spacer: tabs, a search field. They are not drag regions. */
  children?: ReactNode;
  /** Right before the window controls: settings, account. Use <TitleBarAction>. */
  actions?: ReactNode;
  /** From useTauriWindow() (`@uwusuite/design/tauri`) or your own. */
  controls: WindowControls;
  /**
   * false for windows that cannot be maximized (an installer, a fixed-size dialog): no maximize
   * button, and a double-click on the bar does nothing. Default true.
   */
  maximizable?: boolean;
  /**
   * "mac" renders nothing: on macOS the app keeps the native title bar and menu bar
   * (docs/window.md). Pass the result of detectPlatform().
   */
  platform?: Platform;
  className?: string;
}

/**
 * The suite's title bar for frameless windows on Windows and Linux: brand on the left, a drag
 * region in the middle, actions and the window controls on the right. Double-clicking the empty
 * bar maximizes, as everywhere on Windows. From UwUMirror.
 */
export function TitleBar({
  brand,
  children,
  actions,
  controls,
  maximizable = true,
  platform = "windows",
  className,
}: TitleBarProps) {
  const labels = useLabels();
  if (platform === "mac") return null;
  const drag = { "data-tauri-drag-region": true } as const;
  return (
    <header
      className={clsx("uwu-titlebar", className)}
      {...drag}
      onDoubleClick={(event) => {
        if (maximizable && (event.target as HTMLElement).hasAttribute("data-tauri-drag-region"))
          controls.toggleMaximize();
      }}
    >
      <span className="uwu-titlebar-brand" {...drag}>
        {brand}
      </span>
      {children}
      <span className="uwu-titlebar-spacer" {...drag} />
      {actions && <span className="uwu-titlebar-actions">{actions}</span>}
      <div className="uwu-window-controls">
        <button
          type="button"
          className="uwu-window-control"
          onClick={controls.minimize}
          title={labels.minimize}
          aria-label={labels.minimize}
        >
          <svg viewBox="0 0 10 10" aria-hidden>
            <path d="M0 5.5h10" />
          </svg>
        </button>
        {maximizable && (
          <button
            type="button"
            className="uwu-window-control"
            onClick={controls.toggleMaximize}
            title={controls.maximized ? labels.restore : labels.maximize}
            aria-label={controls.maximized ? labels.restore : labels.maximize}
          >
            <svg viewBox="0 0 10 10" aria-hidden>
              {controls.maximized ? <path d="M2.5 2.5V.5h7v7h-2 M.5 2.5h7v7h-7z" /> : <path d="M.5.5h9v9h-9z" />}
            </svg>
          </button>
        )}
        <button
          type="button"
          className="uwu-window-control"
          data-kind="close"
          onClick={controls.close}
          title={labels.close}
          aria-label={labels.close}
        >
          <svg viewBox="0 0 10 10" aria-hidden>
            <path d="M.5.5l9 9 M9.5.5l-9 9" />
          </svg>
        </button>
      </div>
    </header>
  );
}

/** A 30 px round button in the title bar with an 18 px icon. */
export function TitleBarAction({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button type="button" className="uwu-titlebar-action" onClick={onClick} title={label} aria-label={label}>
      {children}
    </button>
  );
}

/** The desktop platform from the user agent: good enough for chrome decisions, not for security. */
export function detectPlatform(userAgent = typeof navigator === "undefined" ? "" : navigator.userAgent): Platform {
  if (/Mac OS X|Macintosh/.test(userAgent) && !/iPhone|iPad/.test(userAgent)) return "mac";
  if (/Windows/.test(userAgent)) return "windows";
  return "linux";
}
