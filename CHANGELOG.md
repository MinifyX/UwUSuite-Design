# Changelog

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
