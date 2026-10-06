# Changelog

## 1.7.0

- **Mobile patterns** for the suite's iPhone, iPad and Android apps, from the
  approved UwULock prototype ([mobile.md](docs/mobile.md)):
  - Tokens: Liquid Glass (`--uwu-glass*`), Material 3 surface tones from the
    suite pink (`--uwu-m3-*`, contrast-tested) and `--uwu-scrim`, in light,
    dark and high contrast. Glass turns solid without `backdrop-filter`, with
    reduced transparency and in high contrast.
  - `mobile.css` (part of `tailwind.css` and `plain.css`, also
    `@uwusuite/design/mobile.css`), in the `components` layer.
  - Components: `MobileShell`, `TabBar` (iOS glass capsule with search button
    and a search field above the keyboard, Android M3 navigation bar, iPad
    floating top bar), `Screen`/`NavBar`/`NavButton` with collapsing large
    titles, `GroupedList`/`ListSection`/`ListRow` with tap to copy,
    `SwipeRow`, `ContextMenu`, `PullToRefresh`, `Sheet` (detents, M3 bottom
    sheet, iPad form sheet), `FullScreenDialog`, `Stepper`, `MobileToaster`
    (iOS toast, Android snackbar), `Fab`, `SearchBar`, `SplitView` with
    `SidebarRow`.
  - Hooks: `useDeviceKind`, `useEdgeBack`, `usePredictiveBack`,
    `useLongPress`, `useHaptics`/`haptic` (Tauri haptics plugin, else
    `navigator.vibrate` on Android), `useKeyboardShortcut` (iPad ⌘F, ⌘N),
    `useKeyboardInset`. The gesture thresholds are pure functions in
    `gestures.ts`.
  - Styleguide: a Mobil section with iPhone, Android and iPad frames.
- **Toaster:** a toast takes a `detail` line.
- **Labels:** words for the mobile components (`back`, `search`, …).
- `matchesAccelerator()` matches a key press against a Tauri accelerator.

## 1.6.2

- **Dialog:** a dialog opened from inside another closes on its own on Escape;
  the one behind it stays open. React used to hand the `cancel` on to the outer
  dialog too, so apps needed a wrapper for it.
- **Menu:** `{ heading: "…" }` entries start a labelled section
  (`role="group"`) up to the next heading. Long menus scroll, at most
  `min(75vh, 520px)` high; apps drop their own max-height.
- **uwu-icons:** a mono symbol that is not square is centred in a square canvas
  (with room for the thicker outlines) for `tray-template.png`, so apps no
  longer need a hand-drawn `<app>-tray-template.svg` for it.

## 1.6.1

- **Button:** a focused primary button shows the focus ring; its own
  `shadow-primary` used to cover it (`focus-visible:shadow-focus`).
- **TitleBar:** `maximizable={false}` for fixed-size windows such as an
  installer: no maximize button, and a double-click on the bar does nothing.

## 1.6.0

- **Icons:** `ICONS` gets the meanings UwUMail-Client needs to move onto the
  package (77 new, all Lucide glyphs):
  - mail: `mail`, `compose`, `reply`, `replyAll`, `forward`, `drafts`,
    `allMailboxes`, `unread`, `move`, `label`, `labels`, `spam`, `notSpam`,
    `spamCheck`, `block`, `attachment`, `signature`, `sendLater`,
    `imagesBlocked`, `redirect`, `quote`, `rules`, `select`, `selectAll`,
    `automatic`, `offline`, `verified`, `score`;
  - writing: `bold`, `italic`, `bulletList`, `addImage`, `insert`;
  - assistant: `summary`, `rewrite`, `adjust`, `proofread`, `localModel`,
    `experimental`;
  - calendar: `calendar`, `agenda`, `addEvent`, `findEvent`, `invitation`,
    `removeEvent`, `time`, `repeat`, `location`, `description`, `videoCall`,
    `comment`, `maybe`;
  - contacts: `contacts`, `contact`, `addContact`, `people`, `profile`,
    `phone`, `birthday`, `anniversary`, `celebration`, `camera`;
  - kinds of files: `document`, `imageFile`, `codeFile`, `spreadsheet`,
    `audioFile`, `videoFile`, `archiveFile`;
  - app settings: `appearance`, `addons`, `layout`, `device`, `loading`,
    `zoomIn`, `zoomOut`, `mixed`.
- docs/icons.md explains them and their close neighbours (`pending` vs
  `time` vs `sendLater`, `share` vs `people`, `warning` vs `spam`).

## 1.5.0

- **Icons:** `ICONS` gets the meanings UwUSSH and UwURDP need to move onto
  the package:
  - sessions: `server`, `connect`, `disconnect`, `tunnel`, `admin`,
    `keyboard`, `fit`, `overview`;
  - files on a host: `files`, `parentFolder`, `drive`, `permissions`;
  - actions: `start`, `stop`, `export`, `signIn`; spaces: `work`.
- **New suite icon `tunnel`** (`Tunnel`): Lucide has no tunnel. An arch over
  the ground line, drawn by the suite icon rules.
- docs/icons.md explains the new meanings and their close neighbours
  (`fit` vs `fullscreen`, `overview` vs `collection`, `server` vs `network`).

## 1.4.1

Gaps UwULock-Client found while moving its desktop app onto the package.

- **`Segmented` can be disabled:** `disabled` greys out the whole control
  (`aria-disabled` on the group, every option a disabled button), and an
  option can carry `disabled: true` on its own. Arrow keys skip disabled
  options, and when the chosen one is disabled the first usable option keeps
  the tab stop. New type `SegmentedOption`. Apps no longer need a
  `<fieldset disabled>` around it.
- **Fix: `Segmented` in high contrast marks its choice with a shape.** Canvas
  and surface are the same colour there (white, or black in dark), so the
  chosen option was shown only by its text colour. It now gets a 2 px ink
  outline (21:1, WCAG 1.4.1 and 1.4.11); `tests/contrast.test.ts` checks the
  pair.
- **Fix: `Dialog` footers on phones.** Below 700 px the footer buttons share
  the row and grow to fill it; what doesn't fit wraps onto a full-width line
  of its own, so with three buttons the last one (the primary) gets a whole
  row. Full-screen phone dialogs keep clear of the notch and the home
  indicator (`env(safe-area-inset-*)`).
- The styleguide shows a disabled `Segmented`, one with a disabled option,
  and a dialog with three buttons.

## 1.4.0

- **Icons:** `ICONS` gets the meanings UwULock needs to move onto the
  package, all from Lucide (no new suite icons):
  - vault and secrets: `vault`, `website`, `card`, `identity`, `note`,
    `sshKey`, `wifi`, `passkey`, `securityKey`, `fingerprint`,
    `masterPassword`, `oneTimeCode`, `generate`, `maskedAddress`, `inbox`,
    `travelMode`, `securityCheck`, `review`, `reminder`, `organization`,
    `collection`, `qrCode`, `import`, `image`, `moveUp`, `moveDown`;
  - remote access: `terminal`, `computer`, `network`;
  - installers and media: `sound`, `soundOff`.
- docs/icons.md explains the new meanings and where they differ from close
  neighbours (`secret` vs `sshKey`, `locked` vs `masterPassword`,
  `notifications` vs `reminder`).

## 1.3.0

- **Fix: the package loads in plain Node.** The JavaScript in `dist/` had
  relative imports without an extension (`./components/Button`), which Vite
  resolves and Node does not, so apps' vitest runs needed
  `server.deps.inline`. Every relative import now carries `.js`, and
  `pnpm build` imports each entry point (`.`, `./tauri`, `./nyu-svg`) with
  Node and fails if one does not load.
- **Icons:** `ICONS` gets the meanings of an editor, from UwUNotes: `file`,
  `newFile`, `folder`, `folderOpen`, `newFolder`, `save`, `saveAll`,
  `closeFile`, `closeAll`, `print`, `compare`, `replace`, `collapseAll`,
  `gitBranch`, `sidebarHide`, `sidebarShow`, `preview`, `outline`,
  `bookmark`, `notebook`, `restore`.
- Reminder for apps on 1.1: since 1.2.0 `uwu-icons` sets the Dock icon into
  Apple's grid itself, so an app's own macOS icon step can go.

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
