# Mobile

One webview app runs on the desktop, on iPhones, on iPads and on Android
phones (Tauri 2). On a phone or tablet it should feel like it belongs there:
iOS 26 Liquid Glass on the iPhone, iPadOS 26 on the iPad, Material 3 on
Android. The patterns come from the approved UwULock prototype; the apps pick
their own tabs and screens and build them from these parts.

| What                                             | Where                                         |
| ------------------------------------------------ | --------------------------------------------- |
| Glass, M3 tones, scrim (light, dark, high)       | `tokens.css` (`--uwu-glass*`, `--uwu-m3-*`)   |
| Layout, lists, bars, sheets, gestures (CSS)      | `mobile.css` (in `tailwind.css`, `plain.css`) |
| Components and hooks                             | `src/mobile/`, exported from the main entry   |
| Gesture thresholds (pure, tested)                | `src/mobile/gestures.ts`                      |
| Live examples in iPhone, Android and iPad frames | styleguide → Mobil                            |

## Which layout

`useDeviceKind()` → `phone-ios` · `phone-android` · `ipad` · `desktop`:

- **Phone:** a touch device narrower than 700 px (the same line as `phone:`).
- **iPad:** iPadOS with touch, 700 px or wider. iPadOS reports a Mac user
  agent, so touch decides. An iPad in narrow Split View gets the phone layout.
- **Desktop:** everything else, including a narrow desktop window (that keeps
  the desktop layout with `phone:` tweaks) and, for now, Android tablets.

The desktop layout on Windows, macOS and Linux does not change. Wrap the
mobile UI in `<MobileShell>`; it detects the device (or takes `kind`), sets
`data-platform="ios|android|ipad"` and is where sheets, menus and toasts
render.

## The pattern every app follows

- **Tabs:** a bottom tab bar with three to five tabs the app picks
  (UwULock: Tresor · Prüfung · Generator · Einstellungen). Settings come last.
- **Overview, not a drawer:** the first tab is an overview page of grouped
  lists (all/due, favourites, types, folders, spaces, extras). Phones have no
  sidebar drawer.
- **New:** "+" top right in the navigation bar on iOS, a FAB on Android.
- **Account:** the avatar top left on iOS, at the end of the search bar on
  Android. It opens the account switcher (a sheet).
- **Detail and edit:** grouped inset lists. Tapping a field copies it, with a
  toast and a haptic tick.
- **Gestures:** back by swiping from the edge, swipe actions on rows,
  long press for a context menu, pull down to sync.
- **Updates:** no update settings on iOS (the App Store updates). Android keeps
  the update check, because the APK comes from GitHub.

## iPhone (iOS 26)

- **Tab bar:** a floating Liquid Glass capsule at the bottom; a round glass
  search button sits right of it. Searching replaces the bar with a round
  back button and the search field in one row, riding on top of the keyboard.
  iOS scrolls the page for the keyboard instead of resizing it, so
  `MobileShell` follows the visible part (`visualViewport`, `data-keyboard`,
  `useKeyboardOpen()` e.g. for a small title while typing).
- **Navigation bar:** large title (`large-title`, 34 pt at the default size, 750) on a tab's root page; it
  collapses into a small centred title with a gradient behind it as the page
  scrolls. Pushed pages have the small title only. Toolbar buttons are round
  44 px glass buttons (`NavButton`), the primary action of a sheet is pink
  (`tint`).
- **Lists:** grouped inset cards (radius 26, 16 px from the edges), headers in
  sentence case above, footnotes below, hairlines that start where the text
  starts, chevrons on rows that open something.
- **Sheets:** from the bottom with a grabber, `large` or `medium` detent;
  "Abbrechen" left, the action right. A sheet with unsaved input is not
  `dismissible` (no drag-down, no tap beside it).
- **Toasts:** glass, dropping in at the top: a round tone icon, a title, a
  detail line ("Wird in 30 s geleert").
- **Back:** swipe from the left edge. Past 110 px (or a flick) it goes back.
- **Context menu:** long press (480 ms) lifts the row over a blurred page and
  shows a glass menu under it. Destructive entries are last, in red.
- **Pull to sync:** the content follows the finger with resistance and uncovers
  a spinner and a line ("Loslassen zum Aktualisieren"); past 66 px it arms
  with a tick.

## iPad (iPadOS 26)

- **Tab bar:** floating glass at the top centre, icon and label side by side.
- **Split view:** `SplitView` with sidebar | list | detail for the main tab,
  two columns (list | detail) for checks and settings. In landscape all
  columns show; in portrait the sidebar is an overlay opened from a toolbar
  button.
- **Detail:** opens beside the list, never as a pushed phone page. No edge
  swipe back.
- **Sheets:** centred form sheets (560 px wide).
- **Keyboard:** `useKeyboardShortcut("CmdOrCtrl+F", …)` for search,
  `CmdOrCtrl+N` for new. ⌘ on an iPad (and a Mac), Ctrl elsewhere.
- **Pointer:** a trackpad's secondary click opens the context menu
  (`useLongPress` handles `contextmenu`).

## Android (Material 3)

- **Navigation bar:** full width at the bottom, a 64 × 32 pill indicator
  behind the active icon (`m3-indicator`), labels under the icons.
- **Top:** a search bar with the account avatar at its end on root pages; a
  64 px top app bar with the title on the left on pushed pages. It takes the
  container tone once the page scrolls.
- **Surfaces:** tones derived from the suite pink: `m3-surface` (page),
  `m3-container` (rows, navigation bar, sheets), `m3-container-high` (search
  bar, rows inside sheets). Lists are rows with 2 px gaps and rounded ends, no
  hairlines and no chevrons; section headers are pink.
- **New:** the FAB (56 px, radius 16) above the navigation bar.
- **Edit:** a full-screen dialog (`FullScreenDialog`): × left, title, the
  confirming action right.
- **Sheets:** M3 bottom sheets with a drag handle, edge to edge. The context
  menu is a bottom sheet too.
- **Snackbar:** at the bottom above the navigation bar, inverted, with one
  action ("Rückgängig").
- **Predictive back:** swipe from either edge; the page shrinks and drifts
  with the finger and goes back after 28 % of the width. The system back
  button is the app's (Tauri's back-button event), not the package's.
- **Pull to sync:** a round indicator slides down over the content.

## Native sheets (SwiftUI)

Some screens can't be the webview: an AutoFill credential provider, share or
action extensions. They are SwiftUI and still look like the app, not like a
bare system form (first: UwULock's AutoFill sheet, `PasskeyProvider/`).

- **Colours:** the `tokens.css` values, light and dark, as dynamic colours
  (`UIColor { traits in … }` / `NSColor(name:dynamicProvider:)`): `canvas`
  behind everything, `surface` cards with a 1 px `border`, `ink` and `muted`
  text, `faint` chevrons, `hairline` dividers, `pink-solid` with `on-pink`
  for the main button, `pink-tint` with `pink-ink` for badges and the pressed
  row. Copy the hex values; there is no Swift package yet.
- **Header:** a 36 pt `pink-tint` badge with the app's SF Symbol, a small
  `pink-ink` app name over the title (headline, two lines at most), "Abbrechen"
  in pink on the right.
- **Search:** the app's search field: magnifier, `surface`, radius 14,
  `border` that turns pink (1.5 px) while focused, a clear button; no
  autocorrection or capitalisation. It searches name, user and the hosts of
  the addresses, every word, ignoring case and accents.
- **Lists:** grouped inset cards (radius 16, 16 px from the edges) with
  section headers in small caps above: what fits the page or app first ("Passend
  zu dieser Seite"), then everything A–Z ("Alle Logins"). Rows: a round
  `pink-tint` initial, title and a muted subtitle (user · host), a chevron.
- **States:** a pink spinner with a line while loading; empty states and
  messages as a `surface` card with a `pink-ink` icon that says what to do
  ("Öffne UwULock und entsperre den Tresor"), never a bare grey line.

## Material

- **Liquid Glass** (`.uwu-glass`): a translucent fill
  (`--uwu-glass`) over `backdrop-filter: blur(16px) saturate(1.9)`, a bright top
  edge and a soft shade. Only for what floats: tab bar, search button, toolbar
  buttons, toasts, context menus, the iPad sidebar. Text on glass is ink.
  - **Fallbacks:** without `backdrop-filter`, with "Transparenz reduzieren"
    (`prefers-reduced-transparency`, or `data-transparency="reduced"` on
    `<html>`) it turns solid `elevated`; in high contrast solid with a
    1.5 px border and no shadow.
- **Safe areas:** `--uwu-safe-top|bottom|left|right` default to `env(safe-area-inset-*)`
  (the app sets `viewport-fit=cover`). Every bar and sheet reads them.
- **Contrast:** the M3 tones are part of `tests/contrast.test.ts` (ink, muted,
  pink-ink and danger-ink on each, pink-ink on the indicator). Swipe actions
  use tested pairs only (`*-ink` fills with `surface` text).

## Components

| Component / hook                             | Notes                                                                                                                                                                                                                                                         |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `MobileShell`                                | `kind?` pins the device. Overlays portal into it                                                                                                                                                                                                              |
| `TabBar`                                     | `tabs` (`{ id, label, icon, badge? }`), `value`, `onChange`, `search?` (`{ open, onOpenChange, value, onChange, placeholder? }`, iPhone), `platform?`                                                                                                         |
| `SearchButton`, `SearchField`                | The iPhone pieces `TabBar` uses; the field rises above the keyboard, Escape closes                                                                                                                                                                            |
| `SearchBar`                                  | Android M3 search bar: `value`/`onChange` (an input) or `onActivate` (a button), `trailing` (avatar), `leading`, `inline`                                                                                                                                     |
| `Screen`                                     | One page: `title`, `largeTitle`, `subtitle`, `leading`, `trailing`, `onBack` (+ edge/predictive back), `underRef`, `onRefresh` (pull to sync), `searchBar`                                                                                                    |
| `NavBar`, `NavButton`, `BackButton`          | `NavButton`: `label` (name), `icon` or `text`, `tint` for the primary action                                                                                                                                                                                  |
| `GroupedList`, `ListSection`, `ListRow`      | Section: `header`, `headerAction`, `footer`. Row: `title`, `subtitle`, `label` (field row), `value`, `icon` + `iconTone`, `chevron`, `trailing`, `mono`, `tone` (`danger`/`accent`), `selected`, `onClick`, `onCopy` (tap to copy) + `copyLabel`, `longPress` |
| `SwipeRow`                                   | `leading`/`trailing` actions (`{ label, icon, tone, onSelect }`). Opens past 70 px, one row open at a time, closed actions are hidden                                                                                                                         |
| `useLongPress(handler)` + `ContextMenu`      | Spread the handlers on the row (`longPress` on `ListRow`). Menu: `open`, `onClose`, `items` (`{ label, icon?, onSelect, danger? }` or `"separator"`), `at`, `preview`                                                                                         |
| `PullToRefresh`                              | `onRefresh` returns a promise; spins until it settles. `Screen` wraps it for you                                                                                                                                                                              |
| `Sheet`                                      | `open`, `onClose`, `title`, `leading`, `trailing`, `detents` (`medium`/`large`), `dismissible`. iPad: form sheet                                                                                                                                              |
| `FullScreenDialog`                           | Android edit: `title`, `action: { label, onClick, disabled? }`                                                                                                                                                                                                |
| `Stepper`                                    | `value`, `onChange`, `min`, `max`, `step`, `label`. Arrow keys work                                                                                                                                                                                           |
| `MobileToaster`                              | The `createToasts()` store drawn as iOS toast or Android snackbar (newest only). `detail` is the second line                                                                                                                                                  |
| `Fab`                                        | `label`, `icon`, `extended`                                                                                                                                                                                                                                   |
| `SplitView`, `SidebarRow`, `SidebarHeading`  | `sidebar`, `list`, `detail`, `overlaySidebar`, `sidebarOpen`, `onSidebarOpenChange`, `listWidth`                                                                                                                                                              |
| `useDeviceKind`, `DeviceKindProvider`        | See above                                                                                                                                                                                                                                                     |
| `useEdgeBack`, `usePredictiveBack`           | `(pageRef, { onBack, enabled, underRef })`, used by `Screen`                                                                                                                                                                                                  |
| `useHaptics()` / `haptic(kind)`              | `selection` · `light` · `medium` · `heavy` · `success` · `warning` · `error`; `setHapticsEnabled(false)` turns all off                                                                                                                                        |
| `useKeyboardShortcut(accelerator, handler)`  | Tauri accelerator syntax, `matchesAccelerator()` underneath                                                                                                                                                                                                   |
| `useKeyboardInset()`, `useScrolledPast(ref)` | Keyboard height from the visual viewport (outside a `MobileShell`; inside use `useKeyboardOpen()`); large-title collapse                                                                                                                                      |

Their words (Zurück, Suchen, Suche schließen, Wird aktualisiert …, the
"kopieren" screen readers hear after a tap-to-copy row) come from `UwuLabels`
like the desktop components'. `copyLabel` on a `ListRow` overrides it for one
row.

The navigation bar is a three-column grid: the sides take what their buttons
need, the small title gets the rest and ends in "…". A short title stays
centred; a wide text button ("Bearbeiten") moves it aside instead of covering
it.

## Text

Every text size in the mobile components is a role from
[typography.md](typography.md#roles) (`--uwu-type-body`, `--uwu-type-headline` …),
never a px value. `MobileShell` sets `data-type="ios"` or `"android"`, so the
iPhone and iPad get Dynamic Type's scale (body 17, footnote 13, large title 34)
and Android Material 3's (body large 16, title large 22), each × UwU Sans'
optical factor × the system's text size (`useTypeScale`). Larger text makes
rows taller: rows and fields use `min-height`. Bars (navigation, tab) keep
their height and truncate their titles, as the systems do.

## Text fields

A bare input inside a rounded field or a field row draws no focus ring of its
own (it would be a box inside the field); the caret shows focus in the accent.
Mark the field's container with `data-uwu-field` and it gets the ring around
its own shape (inset in a grouped card). The package's search fields do this
already. Inputs with their own border (`TextInput`) keep their ring.

## Haptics

`haptic(kind)` uses `tauri-plugin-haptics` when the app has it (add the
plugin to the mobile build and its permissions, see below): the Taptic
Engine on iOS, the vibrator on Android. It calls the plugin through Tauri's
IPC directly, so the main entry imports nothing from Tauri and a missing
plugin fails soft. Without the plugin Android falls back to
`navigator.vibrate`; iOS without the plugin and the desktop do nothing.

The plugin has no `haptics:default` permission set, so list the three
feedback commands `haptic()` calls in a mobile-only capability
(`src-tauri/capabilities/mobile.json`); `vibrate` is not needed:

```json
{
  "identifier": "mobile",
  "platforms": ["iOS", "android"],
  "windows": ["main"],
  "permissions": [
    "haptics:allow-impact-feedback",
    "haptics:allow-notification-feedback",
    "haptics:allow-selection-feedback"
  ]
}
```

Haptics confirm: a copy, a stepper step, a pull that arms, a long press, a
committed swipe. Never on scroll, never in a loop. Apps offer a switch and
pass it to `setHapticsEnabled()`; the components' own ticks follow it.

## Gestures

All thresholds live in `gestures.ts` as pure functions, tested in Node:

| Gesture         | Rule                                                                                    |
| --------------- | --------------------------------------------------------------------------------------- |
| Tap vs. drag    | 8 px slop; horizontal needs 1.2 × the vertical movement                                 |
| Long press      | 480 ms without leaving the slop                                                         |
| iOS back        | starts within 26 px of the left edge; goes back past 110 px or a 0.5 px/ms flick        |
| Android back    | either edge; goes back past 28 % of the width; the page scales to 86 % and drifts 40 px |
| Swipe row       | actions 76 px each, follows up to 40 px past them, stays open past 70 px                |
| Pull to refresh | `120 × (1 − e^(−dy/200))`, arms past 66 px                                              |
| Sheet           | goes to the next detent (or closes) past 25 % of its height or a 0.6 px/ms flick        |

With reduced motion (`data-motion="reduced"`), gestures still work but
nothing animates afterwards: a released back swipe goes back at once.

## Rules

- Every swipe action is also in the row's context menu or detail page.
- Glass carries controls and short labels, never body text.
- Taps copy only what the user would copy; secrets copy through the app's own
  clipboard code (it clears the clipboard later), `onCopy` is just the hook.
- Toasts on iOS, snackbars on Android, never both. An undo goes in the
  snackbar's action.
- iPad gets columns, not a stretched phone.
- Desktop stays desktop: gate mobile UI by `useDeviceKind()`, not by width
  alone.
