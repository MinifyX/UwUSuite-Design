# Changelog

## 1.2.0

macOS: the apps now get what a Mac app needs (docs/macos.md).

- **Menu bar:** `setMacMenu()` in `@uwusuite/design/tauri` sets the suite's
  menu bar in Apple's order: app menu (About, Einstellungen … ⌘,, Services,
  hide, quit), Ablage, Bearbeiten, Darstellung, the app's own menus, Fenster,
  Hilfe. The standard items are AppKit's own, the Window and Help menus are
  marked for macOS. German and English. `macMenuSpec()` returns the same as
  data. The title bar's actions move here on a Mac; the gear becomes ⌘,.
- **Shortcuts:** `shortcutText()`, `macShortcut()` and `withShortcut()` show
  one accelerator the platform's way: `⇧⌘S`, `Strg+Umschalt+S`,
  `Ctrl+Shift+S`. New type `Platform`.
- **Closing and quitting:** `hideWindowOnClose()` keeps the app in the Dock on
  ⌘W, `onMacQuit()` saves before ⌘Q, the Dock or a logout ends the app. The
  Rust side is the new crate `uwu-macos` in this repo (from UwUNotes 0.6),
  taken as a git dependency at the release tag; the Dock reopen is a
  `RunEvent::Reopen` snippet in the docs.
- **Dock icon:** `uwu-icons` sets the app icon into Apple's grid (824 of 1024,
  superellipse, soft shadow) and writes `icon.icns` itself, 16 to 1024 px,
  checked after writing. Until now the Dock got the full-bleed tile, a size
  too big next to other apps. Also `macos/icon-1024.png` to look at.
- **Menu bar icon:** `uwu-icons --tray` also writes `tray-template.png`
  (36 px) from the mono symbol with 1.5 times thicker outlines, or from a
  hand-drawn `<app>-tray-template.svg`.
- **Liquid Glass:** rules for a macOS 26 `.icon` from Icon Composer: tile as
  background fill, Nyu and props as layers, no baked shadow.
- Styleguide: a macOS part under Fenster (the menu bar, rendered from
  `macMenuSpec()`) and under App-Icons (Dock grid and menu bar template,
  rendered with the same code as `uwu-icons`).

## 1.1.0

- UwU Sans 1.100 drops the `:3` → Nyu and `<3` → heart ligatures. They
  changed the meaning of what people typed. The Nyu (U+E000), heart (U+2665)
  and arrow (U+2190–2193) glyphs stay and show where their code point is used.
  The font has no `calt` or ligature feature any more.
- `base.css`: the `"calt" 1` on the body and the ligature switch-off for
  inputs, text areas and `[contenteditable]` are gone. Code (`code`, `pre`,
  `kbd`, `samp`, `.uwu-mono`) keeps JetBrains Mono's ligatures off.
- The font build test is now `test_shaping.py`: `:3`, `<3`, `10:30` and the
  rest shape as plain characters.
- Styleguide and docs: Nyu and the heart are characters, not ligatures.
  docs/migration.md says which app rules to delete.

## 1.0.1

- The styleguide runs under a strict Content-Security-Policy: the theme boot
  script is a file and fonts are no longer inlined as `data:` URIs. Fixes the
  blocked fonts and the flash of the wrong theme on uwu.minifyx.de/design.
- docs/color.md: how to load `bootScript()` under a CSP.

## 1.0.0

The first UwUSuite design package, built from UwUMail and UwUMirror.

- Tokens for light, dark and high contrast. Every text pair is tested against
  WCAG AA (high contrast: AAA). States get `-ink` text variants, and badges
  move to `pink-solid`.
- Tailwind v4 theme with `dark:`, `contrast-high:`, `motion-reduced:` and
  `phone:` variants. There is also a plain-CSS entry point.
- UwU Sans is the suite font, moved here from UwUMail with its build. It comes
  with JetBrains Mono and a font picker (Manrope, Rubik, DM Sans, system).
- Icon rules:
  - `<Icon>` with five sizes and their strokes.
  - The `ICONS` vocabulary on Lucide.
  - Five suite icons, with a rule check.
- Nyu:
  - The catalogue of all eight shells (from the website).
  - Face kit, ears, sticker, motion CSS.
  - The UwUSuite box icon.
- App icon template and the `uwu-icons` generator (ICO, ICNS, Store tiles,
  tray, Android/iOS).
- Components: Button, IconButton, Field, TextInput, TextArea, Select, Switch,
  Toggle, Segmented, Pill, Badge, Tag, Card, SettingRow, Hint, StatusDot,
  StatusLine, Avatar, Menu, Dialog, Toaster, Tooltip, EmptyState, Wordmark,
  TitleBar.
- Styleguide (German), published at uwu.minifyx.de/design.
