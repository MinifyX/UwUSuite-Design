import { getCurrentWindow } from "@tauri-apps/api/window";
import { useEffect, useMemo, useState } from "react";
import type { WindowControls } from "../components/TitleBar";

/**
 * Window controls for <TitleBar> in a Tauri 2 app. Needs the capabilities
 * core:window:allow-minimize, -toggle-maximize, -close, -is-maximized and -start-dragging.
 */
export function useTauriWindow(): WindowControls {
  const [maximized, setMaximized] = useState(false);

  useEffect(() => {
    const window = getCurrentWindow();
    let stopped = false;
    let unlisten: (() => void) | undefined;
    const sync = () =>
      void window
        .isMaximized()
        .then((value) => !stopped && setMaximized(value))
        .catch(() => undefined);
    sync();
    void window
      .onResized(sync)
      .then((stop) => {
        if (stopped) stop();
        else unlisten = stop;
      })
      .catch(() => undefined);
    return () => {
      stopped = true;
      unlisten?.();
    };
  }, []);

  return useMemo(
    () => ({
      maximized,
      minimize: () => void getCurrentWindow().minimize(),
      toggleMaximize: () => void getCurrentWindow().toggleMaximize(),
      close: () => void getCurrentWindow().close(),
    }),
    [maximized],
  );
}

export { hideWindowOnClose, MAC_QUIT_EVENT, onMacQuit } from "./mac-lifecycle";
export type { MacQuitOptions } from "./mac-lifecycle";
export { MAC_MENU_LABELS, macMenuSpec, setMacMenu } from "./mac-menu";
export type { MacMenuEntry, MacMenuOptions, MacSubmenuSpec } from "./mac-menu";
