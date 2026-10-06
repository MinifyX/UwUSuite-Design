import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { detectPlatform, type Platform } from "../components/TitleBar.js";

/**
 * How a suite app lives on macOS (docs/macos.md):
 *
 * - Closing the window (⌘W, the red light) hides it. The app keeps running in the Dock, and a click
 *   on its Dock icon brings the window back (`RunEvent::Reopen` in Rust, see the docs).
 * - Quitting (⌘Q, the Dock, logging out) saves first: the `uwu-macos` crate holds the quit and
 *   sends `quit-requested`, the page saves and answers through the app's `finish_quit` command.
 *
 * On Windows and Linux both do nothing: closing the window ends the app there, through the page's
 * own close guard.
 */

/** The event `uwu-macos` asks with, the same as `uwu_macos::QUIT_EVENT`. */
export const MAC_QUIT_EVENT = "quit-requested";

const noop = () => undefined;

/**
 * On macOS, closing the window hides it instead of ending the app. Returns the unlisten function.
 * Needs the capabilities `core:window:allow-hide` and `core:window:allow-show`.
 */
export async function hideWindowOnClose(platform = detectPlatform()): Promise<() => void> {
  if (platform !== "mac") return noop;
  const window = getCurrentWindow();
  return window.onCloseRequested((event) => {
    event.preventDefault();
    void window.hide();
  });
}

export interface MacQuitOptions {
  /** The Tauri command that calls `uwu_macos::reply_quit`. */
  command?: string;
  platform?: Platform;
}

/**
 * Runs `save` when macOS wants to quit the app, then lets it go. `save` returns `false` to stay
 * (the person cancelled a dialog). If `save` throws, the app stays too, so nothing is lost; the
 * person can quit again. Returns the unlisten function.
 */
export async function onMacQuit(
  save: () => Promise<boolean | void> | boolean | void,
  { command = "finish_quit", platform = detectPlatform() }: MacQuitOptions = {},
): Promise<() => void> {
  if (platform !== "mac") return noop;
  return listen(MAC_QUIT_EVENT, async () => {
    let proceed: boolean;
    try {
      proceed = (await save()) !== false;
    } catch {
      proceed = false;
    }
    await invoke(command, { proceed });
  });
}
