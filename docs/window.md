# Window

| Platform       | Frame                                                                                                            | In the app                                                                                      |
| -------------- | ---------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Windows, Linux | `"decorations": false`, `"shadow": true`                                                                         | `<TitleBar>`: brand left, drag region, actions, window controls right                           |
| macOS          | Native title bar (`tauri.macos.conf.json`: `"decorations": true`, `"titleBarStyle": "Visible"`), native menu bar | No `TitleBar` (it renders nothing with `platform="mac"`); the menus live in the system menu bar |

```tsx
import { detectPlatform, TitleBar, TitleBarAction, Wordmark, Icon, ICONS, withShortcut } from "@uwusuite/design";
import { useTauriWindow } from "@uwusuite/design/tauri";

const platform = detectPlatform();

<TitleBar
  platform={platform}
  controls={useTauriWindow()}
  brand={<Wordmark product="Mirror" shell="mirror" />}
  actions={
    <TitleBarAction label={withShortcut("Einstellungen", "CmdOrCtrl+,", platform)} onClick={openSettings}>
      <Icon icon={ICONS.settings} size="md" />
    </TitleBarAction>
  }
/>;
```

## Title bar (Windows, Linux)

From UwUMirror:

- **Bar:** 38 px (`--uwu-titlebar-height`), `surface` with a hairline below,
  14 px left padding.
- **Brand:** Nyu at about 22 px, then the wordmark. Both are drag regions.
- **Middle:** optional tabs or a search field. These are not drag regions.
- **Actions:** 30 px round buttons, 18 px icons, `muted` that turns `ink` on
  hover.
- **Window controls:** 46 px wide, full height, 10 px glyphs at stroke 1. Hover
  is `elevated`. Close hover is `pink-solid` with `on-pink`.
- **Double-click:** on the empty bar it maximizes or restores.
- **Capabilities:** `useTauriWindow()` needs `core:window:allow-minimize`,
  `-toggle-maximize`, `-close`, `-is-maximized` and `-start-dragging`. The
  resize listener is covered by `core:default`.

## macOS

The full rules and code are in [macos.md](macos.md). In short:

- Use the native title bar and traffic lights. Don't draw a second title bar
  and don't fake traffic lights.
- The title bar's actions move into the menu bar (`setMacMenu()`): the gear
  becomes App → Einstellungen … (⌘,).
- Shortcuts in Mac style (⌘, ⌥, ⇧) in menus and tooltips (`shortcutText()`).
- ⌘W hides the window and the app stays in the Dock; ⌘Q, the Dock and logging
  out save first (`uwu-macos`, `onMacQuit()`).

## Sizes

- **Default window:** 1180 × 760 for tools, 1280 × 820 for content apps
  (mail, notes), centred.
- **Minimum:** 640 × 440. Below 700 px wide the phone layout applies.
- **Full screen** (streams, remote desktops): hide all chrome. A bar slides in
  from the top edge on hover, max 640 px wide, with bottom radii of 16 px and
  `stage-overlay`.

## Installers

The setup apps are always light. They use:

- the tile gradient as the background,
- plum text (`--uwu-plum`),
- a translucent white card with `backdrop-filter: blur(10px)`,
- Nyu packing the box,
- a striped pink progress bar.

They use the same fonts and Nyu CSS as the app.
