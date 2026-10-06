# macOS

On a Mac a suite app should feel like a Mac app: the system draws the title
bar, the menus live at the top of the screen, the Dock icon sits in Apple's
grid, and closing a window is not quitting. The pieces:

| What                          | Where                                               | Since |
| ----------------------------- | --------------------------------------------------- | ----- |
| Native title bar, no TitleBar | `tauri.macos.conf.json`, `TitleBar` renders nothing | 1.0   |
| Menu bar                      | `setMacMenu()` in `@uwusuite/design/tauri`          | 1.2   |
| Shortcut text (⌘, ⇧, ⌥)       | `shortcutText()`, `macShortcut()`, `withShortcut()` | 1.2   |
| ⌘W hides, Dock click reopens  | `hideWindowOnClose()` + `RunEvent::Reopen` (Rust)   | 1.2   |
| ⌘Q / Dock / logout saves      | `uwu-macos` crate + `onMacQuit()`                   | 1.2   |
| Dock icon in Apple's grid     | `uwu-icons` → `icon.icns`                           | 1.2   |
| Menu bar (tray) icon          | `uwu-icons --tray` → `tray-template.png`            | 1.2   |
| Liquid Glass icon (macOS 26)  | rules below, built by hand in Icon Composer         | rules |

## Title bar

Native, with the traffic lights (`"decorations": true`,
`"titleBarStyle": "Visible"` in `tauri.macos.conf.json`). The app draws no
second bar, no fake traffic lights and no menu row inside the window. Details
in [window.md](window.md).

## Menu bar

Everything the Windows/Linux title bar has as buttons moves into the menu bar.
The gear becomes **App → Einstellungen … (⌘,)**, an account button becomes an
entry in the app menu or a menu of its own.

Every app has the same skeleton, in Apple's order:

| Menu                | Contents                                                                                                                                       |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| **UwUMirror** (app) | Über UwUMirror · Einstellungen … ⌘, · the app's own (updates) · Dienste · ausblenden ⌘H · Andere ausblenden ⌥⌘H · Alle einblenden · beenden ⌘Q |
| **Ablage**          | the app's entries (new, open, export) · Fenster schließen ⌘W                                                                                   |
| **Bearbeiten**      | Widerrufen ⌘Z · Wiederholen ⇧⌘Z · Ausschneiden ⌘X · Kopieren ⌘C · Einsetzen ⌘V · Alles auswählen ⌘A · the app's (find ⌘F)                      |
| **Darstellung**     | the app's entries (sidebar, zoom) · Vollbild ⌃⌘F                                                                                               |
| the app's own menus | "Postfach", "Verbindung", …                                                                                                                    |
| **Fenster**         | Im Dock ablegen ⌘M · Zoomen · Alle nach vorne bringen · the window list (macOS)                                                                |
| **Hilfe**           | the search field (macOS) · website, release notes, report a problem                                                                            |

The standard items are AppKit's own (`PredefinedMenuItem`), so they work in the
web view's text fields and are named like in every other Mac app. A menu bar
without Bearbeiten breaks ⌘C and ⌘V in the web view, so it is always there.

```ts
import { setMacMenu } from "@uwusuite/design/tauri";

useEffect(() => {
  void setMacMenu({
    appName: "UwUMirror",
    lang,
    onSettings: () => navigate("/settings"),
    file: [{ text: t("Neue Verbindung …"), accelerator: "CmdOrCtrl+N", action: newConnection }],
    view: [{ text: t("Seitenleiste"), accelerator: "CmdOrCtrl+Alt+S", checked: sidebar, action: toggleSidebar }],
    menus: [{ text: t("Verbindung"), items: [{ text: t("Trennen"), enabled: connected, action: disconnect }] }],
    help: [{ text: "UwUMirror-Website", action: () => openUrl("https://uwu.minifyx.de/") }],
  });
}, [lang, sidebar, connected]);
```

- It replaces the whole bar every time, so call it again when the language or
  a check mark changes. Off macOS it does nothing.
- Capability: `core:menu:default`.
- An entry with `…` opens something that asks for more (a dialog); without it,
  the entry acts at once. Apple's German writes a space before the ellipsis:
  „Einstellungen …“.
- An entry that cannot act right now is disabled (`enabled: false`), not
  hidden, so the menu does not jump around.

## Shortcuts

Write a shortcut once, as a Tauri accelerator (`CmdOrCtrl+Shift+S`). The menu
takes it as it is; tooltips and labels show it the platform's way:

```ts
shortcutText("CmdOrCtrl+Shift+S", platform, lang); // ⇧⌘S · Strg+Umschalt+S · Ctrl+Shift+S
withShortcut("Einstellungen", "CmdOrCtrl+,", platform); // Einstellungen (⌘,)
```

- Mac order of symbols: ⌃ ⌥ ⇧ ⌘, no plus signs.
- `CmdOrCtrl` is ⌘ on a Mac and Strg/Ctrl elsewhere. Use plain `Ctrl` only
  where the Control key is meant on a Mac too.
- Don't take the system's shortcuts: ⌘H, ⌥⌘H, ⌘M, ⌘Q, ⌘W, ⌘, (only for the
  settings), ⌃⌘F, ⌘Space, ⌘Tab.

## Closing and quitting

| The person does              | macOS                                                    | Windows, Linux                  |
| ---------------------------- | -------------------------------------------------------- | ------------------------------- |
| ⌘W, the red light            | The window hides, the app stays in the Dock              | Closing the window ends the app |
| Clicks the Dock icon         | The window comes back                                    | –                               |
| ⌘Q, Dock → Beenden, logs out | The app saves, then quits (or stays if a dialog says so) | –                               |

The page side (`@uwusuite/design/tauri`):

```ts
import { hideWindowOnClose, onMacQuit } from "@uwusuite/design/tauri";

await hideWindowOnClose(); // capabilities core:window:allow-hide, core:window:allow-show
await onMacQuit(async () => {
  await saveEverything(); // return false to stay, e.g. when a dialog was cancelled
});
```

The Rust side, with `uwu-macos` from this repo:

```toml
# src-tauri/Cargo.toml
uwu-macos = { git = "https://github.com/MinifyX/UwUSuite-Design", tag = "v1.3.0" }
```

```rust
use tauri::{Emitter, Manager};

#[tauri::command]
fn finish_quit(proceed: bool) {
    uwu_macos::reply_quit(proceed);
}

tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![finish_quit])
    .setup(|app| {
        let handle = app.handle().clone();
        if let Err(error) = uwu_macos::install_quit_guard(move || handle.emit(uwu_macos::QUIT_EVENT, ()).is_ok()) {
            eprintln!("{error}"); // the app still quits, only without saving first
        }
        Ok(())
    })
    .build(tauri::generate_context!())?
    .run(|app, event| {
        // A click on the Dock icon brings the hidden window back.
        #[cfg(target_os = "macos")]
        if let tauri::RunEvent::Reopen { has_visible_windows: false, .. } = event {
            if let Some(window) = app.get_webview_window("main") {
                let _ = window.show();
                let _ = window.set_focus();
            }
        }
    });
```

Why the crate: macOS ends an app with `terminate:`, and tao answers that by
ending the event loop on the spot, without asking the window. `uwu-macos` gives
the app delegate an `applicationShouldTerminate:` that answers "later", asks
the page through `quit-requested` and waits for `finish_quit`. It waits at most
10 seconds, so a logout never hangs. Off macOS both functions do nothing. It
comes from UwUNotes 0.6, which also explains the details in its `quit.rs`.

## Dock icon

macOS draws no frame around an app icon, so the file is the frame. Apple's grid
puts the tile at 824 of 1024 pixels, centred, as a superellipse (not a rounded
rectangle), with a soft shadow in the 100 pixel margin. A full-bleed tile looks
a size too big next to every other icon in the Dock.

`uwu-icons` sets the app icon into that grid (`bin/mac-icon.mjs`), renders
every size from 16 to 1024 and writes `icon.icns` itself (`bin/icns.mjs`). The
master also lands in `icons/macos/icon-1024.png`, to look at. Nothing changes
in the brand SVG: the same tile serves Windows, the stores and the web, where
the platform rounds or frames it.

## Menu bar icon (tray)

The menu bar wants a **template**: black on transparent, which macOS tints for
light and dark menu bars and for the highlighted state. A colour Nyu there
looks foreign and turns into a blob on a dark bar.

- `uwu-icons --tray` writes `tray-template.png`, 36 × 36 (18 points at 2x),
  from `<app>-symbol-mono.svg` with its outlines 1.5 times as thick: at 18
  points the symbol's own stroke is barely a pixel.
- A hand-drawn `<app>-tray-template.svg` (black on transparent, 256 grid)
  wins when it exists.
- In Tauri: `TrayIconBuilder::new().icon(template).icon_as_template(true)` on
  macOS, `tray.png` elsewhere.

## Liquid Glass (macOS 26)

macOS 26 and iOS 26 draw icons as layered glass: the system adds highlights,
depth and the shadow, and shows the icon in a light, dark, clear and tinted
look. The source is a `.icon` file from Apple's **Icon Composer**. The
`icon.icns` from `uwu-icons` keeps working: it fits Apple's shape, so macOS 26
shows it as it is. When an app moves to Liquid Glass, build its `.icon` like
this:

- **Canvas:** 1024 × 1024. The tile is no layer: set its gradient as the
  icon's background fill, `#FFF3F8` → `#FFD3E5` (light) and the plum
  `#4B1D3F` → `#2A1024` (dark).
- **Layers, front to back, in at most four groups:**
  1. Nyu: the app's shell with the white die-cut edge, tilted as on the tile.
     Face and blush as their own layer in the same group, so they stay
     opaque.
  2. The app's thing (letter, key, mirror) if it is not part of Nyu.
  3. Props: sparkles and heart.
- **Export every layer as SVG** from the app icon, without the drop shadow
  filter: the system draws the shadow. No baked gloss, gradients on Nyu or
  glows either.
- **Tinted and clear looks:** Nyu's outline plum and the props must still read
  as one colour; check them in Icon Composer's previews, and use the mono
  symbol's shapes where a layer goes muddy.
- **Building:** only on a Mac. Icon Composer writes the `.icon`, Xcode's
  `actool` compiles it into `Assets.car`. Check how the Tauri bundler takes it
  at the time; until then the app ships `icon.icns`.
- **Keep the brand:** the same tilt, props and arrangement as the app's tile,
  so the glass icon and the web and Windows icon are clearly the same app.
