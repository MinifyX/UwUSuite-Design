# Color

All colours are custom properties in [`src/css/tokens.css`](../src/css/tokens.css).
Components never use raw hex values; if one is missing, add a token. Tailwind
names come from [`tailwind.css`](../src/css/tailwind.css): `--uwu-surface` is
`bg-surface`, `--uwu-border` is `border-line`, `--uwu-pink-ink` is
`text-pink-ink`.

`tests/contrast.test.ts` checks every text pair against WCAG AA (4.5:1), every
mark (dots, outlines, switches) against 3:1, and high contrast against 7:1, in
all four themes. A token change that breaks a pair fails the build.

## Surfaces and text

| Token             | Light     | Dark      | Use                                              |
| ----------------- | --------- | --------- | ------------------------------------------------ |
| `canvas`          | `#f8f4f6` | `#141016` | App background                                   |
| `surface`         | `#ffffff` | `#1c171f` | Cards, lists, reader, dialogs, title bar         |
| `elevated`        | `#fcf8fa` | `#241e28` | Hover rows, popovers, hints                      |
| `ink`             | `#1c1420` | `#f8f2f6` | Text                                             |
| `muted`           | `#716672` | `#b3a8b3` | Secondary text, labels, quiet icons              |
| `faint`           | `#a69ba5` | `#7d717d` | Placeholders, group titles in the portal         |
| `hairline`        | `#f2e8ee` | `#2c2430` | Dividers, card borders                           |
| `border` (`line`) | `#e9dde4` | `#3a3040` | Button and menu borders                          |
| `control`         | `#8a7d8b` | `#7d7185` | Outline of inputs, switch off (3:1, WCAG 1.4.11) |

## Brand: two pinks

| Token              | Light     | Dark      | Use                                                                       |
| ------------------ | --------- | --------- | ------------------------------------------------------------------------- |
| `pink`             | `#ff4d8d` | `#ff7fac` | **Brand.** Dots, selection, focus, logo                                   |
| `pink-solid`       | `#e11d74` | `#ff7fac` | Fills with text: primary buttons, badges, switch on, the wordmark's "UwU" |
| `pink-solid-hover` | `#c8165f` | `#ff9dbf` | Hover on it                                                               |
| `on-pink`          | `#ffffff` | `#1c1420` | Text on `pink-solid`                                                      |
| `pink-ink`         | `#a3154f` | `#ffa3c4` | Pink text on tints                                                        |
| `pink-tint`        | `#ffe4ef` | `#3a1a2a` | Active row, selected pill, nav item                                       |
| `pink-tint-strong` | `#ffd0e2` | `#4d2338` | Pressed, text selection                                                   |

**Why two pinks?** White text on `#ff4d8d` reaches only 3.1:1. Anything with
text on a pink fill uses `pink-solid` (4.5:1). `pink` reaches 3:1 on
`surface` but not on `canvas`; there it is decoration (logo, sparkles, a dot
next to bold text). A mark that alone carries a state uses `pink-solid`.

## States

Every state has three tokens: the plain one for dots, icons and fills, `-ink`
for text, `-tint` for backgrounds.

| State     | Plain     | `-ink`    | `-tint`   | Means                                     |
| --------- | --------- | --------- | --------- | ----------------------------------------- |
| `success` | `#12a06d` | `#17796a` | `#d8f5e8` | Ready, live, online, saved                |
| `warning` | `#b86e00` | `#8e5510` | `#fdf0d6` | Needs attention (firewall, missing codec) |
| `danger`  | `#d92d44` | `#b4233a` | `#fde4e7` | Failed, delete                            |
| `offline` | `#b3a8b3` | –         | –         | Off, not connected                        |

Pink means "selected" or "focus". It never means "online" or "ok". The one
exception is a pulsing pink dot while something starts (UwUMirror's and
UwURDP's tabs, `StatusDot state="connecting"`).

## Accounts, toasts, stage, art

- **Accounts** (`account-pink|violet|sky|mint|amber|coral`) colour accounts,
  profiles and spaces; `avatar-<colour>` and `avatar-<colour>-ink` are the
  initials chip. The same in both themes.
- **Toast** (`toast`, `toast-ink`, `toast-accent`, `toast-danger`) is
  inverted: dark on a light app, light on a dark app.
- **Stage** (`stage`, `stage-ink`, `stage-muted`, `stage-overlay`,
  `stage-border`): a mirrored phone, a remote desktop, a terminal sits on a
  near-black stage in both themes. The picture is never tinted, filtered or
  rounded.
- **Art** (`tile-from`, `tile-to`, `plum`, `plum-soft`): the app icon tile,
  installers and the website. Fixed, never themed.

## Themes

`applyAppearance()` (or the `useAppearance()` hook) writes three attributes on
`<html>`:

| Attribute       | Values             | Setting                                        |
| --------------- | ------------------ | ---------------------------------------------- |
| `data-theme`    | `light` · `dark`   | Darstellung → Design: System · Hell · Dunkel   |
| `data-contrast` | `normal` · `high`  | Darstellung → Kontrast: System · Normal · Hoch |
| `data-motion`   | `full` · `reduced` | Darstellung → Animationen: System · An · Aus   |

"System" follows `prefers-color-scheme`, `prefers-contrast: more` and
`prefers-reduced-motion`. Put `bootScript(key)` into `index.html` so a dark app
never flashes white. Tailwind's `dark:` follows `data-theme`, and
`contrast-high:` and `motion-reduced:` are variants too.

High contrast (from UwULock) is black on white or white on black, 7:1 for
text, and an accent that is dark or light enough to be text.
`html:root[data-contrast="high"]` outranks a server admin's accent colour
(`branding.css`), so high contrast always wins.

## Don't

- No pink for "online", "ok" or success. No second accent colour.
- No `#hex`, `rgb()` or Tailwind palette colours (`bg-gray-100`) in components.
- Nyu, the app tile and installers are never recoloured, not even in dark mode.
