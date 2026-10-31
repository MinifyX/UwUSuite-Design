---
version: alpha
name: UwUSuite
description: "The design system of the UwUSuite (UwUMail, UwUMirror, UwUNotes, UwULock, UwUSSH, UwURDP, UwUAuth and the servers' web UIs), shipped as @uwusuite/design. A soft, warm, grey-pink canvas (#f8f4f6) carries white surfaces with hairline borders; one brand pink in two strengths does all the accent work: #ff4d8d for dots, selection, focus and the logo, #e11d74 for every fill that carries text. Plum-black ink (#1c1420), never pure black. Type is UwU Sans (Atkinson Hyperlegible Next plus Nyu and a heart), bundled, never loaded from the network, with a size scale that follows the platform and the system's text size. Buttons are pills, cards are 16 px rounded rectangles without shadows, only floating things cast shadows. Motion is short with a little spring. Nyu the cat is the mascot, drawn as a die-cut sticker. Playful words by default, plain when it matters. Light, dark and high contrast are first-class themes, all checked against WCAG AA."

colors:
  # Light theme (the default, <html data-theme="light">). Every name is a --uwu-* custom property
  # in src/css/tokens.css and a Tailwind colour in src/css/tailwind.css (border → `line`).
  primary: "#e11d74" # = pink-solid: the colour of the one primary action
  canvas: "#f8f4f6"
  surface: "#ffffff"
  elevated: "#fcf8fa"
  ink: "#1c1420"
  muted: "#716672"
  faint: "#a69ba5"
  hairline: "#f2e8ee"
  border: "#e9dde4"
  control: "#8a7d8b"
  pink: "#ff4d8d"
  pink-solid: "#e11d74"
  pink-solid-hover: "#c8165f"
  on-pink: "#ffffff"
  pink-ink: "#a3154f"
  pink-tint: "#ffe4ef"
  pink-tint-strong: "#ffd0e2"
  success: "#12a06d"
  success-ink: "#17796a"
  success-tint: "#d8f5e8"
  warning: "#b86e00"
  warning-ink: "#8e5510"
  warning-tint: "#fdf0d6"
  danger: "#d92d44"
  danger-ink: "#b4233a"
  danger-tint: "#fde4e7"
  offline: "#b3a8b3"
  toast: "#1c1420"
  toast-ink: "#ffffff"
  toast-accent: "#ff7fac"
  toast-danger: "#ff8096"
  backdrop: "rgb(28 20 32 / 0.35)"
  scrim: "rgb(25 10 20 / 0.3)"
  # Dark theme (<html data-theme="dark">): the same roles, other values.
  canvas-dark: "#141016"
  surface-dark: "#1c171f"
  elevated-dark: "#241e28"
  ink-dark: "#f8f2f6"
  muted-dark: "#b3a8b3"
  faint-dark: "#7d717d"
  hairline-dark: "#2c2430"
  border-dark: "#3a3040"
  control-dark: "#7d7185"
  pink-dark: "#ff7fac"
  pink-solid-dark: "#ff7fac"
  pink-solid-hover-dark: "#ff9dbf"
  on-pink-dark: "#1c1420"
  pink-ink-dark: "#ffa3c4"
  pink-tint-dark: "#3a1a2a"
  pink-tint-strong-dark: "#4d2338"
  success-dark: "#3ddc97"
  success-ink-dark: "#5cc7ac"
  success-tint-dark: "#123a2a"
  warning-dark: "#f5b94a"
  warning-ink-dark: "#d8a25c"
  warning-tint-dark: "#3a2a0c"
  danger-dark: "#ff6b7e"
  danger-ink-dark: "#ff8a99"
  danger-tint-dark: "#3d1a20"
  offline-dark: "#6d6474"
  toast-dark: "#f8f2f6"
  toast-ink-dark: "#1c1420"
  toast-accent-dark: "#a3154f"
  toast-danger-dark: "#b4233a"
  backdrop-dark: "rgb(0 0 0 / 0.5)"
  scrim-dark: "rgb(0 0 0 / 0.5)"
  # The same in every theme.
  account-pink: "#ff4d8d"
  account-violet: "#8b5cf6"
  account-sky: "#0ea5e9"
  account-mint: "#10b981"
  account-amber: "#f59e0b"
  account-coral: "#f97360"
  stage: "#0c0a0d"
  stage-ink: "#f8f2f6"
  stage-muted: "#b3a8b3"
  stage-overlay: "rgb(28 23 31 / 0.92)"
  stage-border: "#3a3040"
  tile-from: "#fff3f8"
  tile-to: "#ffd3e5"
  plum: "#4b1d3f"
  plum-soft: "#7a5670"

typography:
  # Desktop scale (Windows and Linux, and every app without <html data-type>). macOS, iOS/iPadOS
  # and Android use other point sizes for the same tokens; see "Typography" below.
  large-title:
    fontFamily: UwU Sans
    fontSize: 28px
    fontWeight: 750
    lineHeight: 1.15
    letterSpacing: -0.01em
  title:
    fontFamily: UwU Sans
    fontSize: 22px
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: -0.01em
  section:
    fontFamily: UwU Sans
    fontSize: 18px
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: -0.008em
  reading:
    fontFamily: UwU Sans
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: -0.008em
  body:
    fontFamily: UwU Sans
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.45
    letterSpacing: -0.008em
  headline:
    fontFamily: UwU Sans
    fontSize: 14px
    fontWeight: 600
    lineHeight: 1.45
    letterSpacing: -0.008em
  meta:
    fontFamily: UwU Sans
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.45
    letterSpacing: -0.008em
  label:
    fontFamily: UwU Sans
    fontSize: 13px
    fontWeight: 600
    lineHeight: 1.45
    letterSpacing: -0.008em
  menu-item:
    fontFamily: UwU Sans
    fontSize: 13px
    fontWeight: 500
    lineHeight: 1.45
    letterSpacing: -0.008em
  caption:
    fontFamily: UwU Sans
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.45
    letterSpacing: -0.008em
  group-title:
    fontFamily: UwU Sans
    fontSize: 12px
    fontWeight: 700
    lineHeight: 1.45
    letterSpacing: 0.025em
  tag:
    fontFamily: UwU Sans
    fontSize: 12px
    fontWeight: 600
    lineHeight: 1.45
    letterSpacing: -0.008em
  badge:
    fontFamily: UwU Sans
    fontSize: 11px
    fontWeight: 700
    lineHeight: 1.45
    letterSpacing: -0.008em
  button-sm:
    fontFamily: UwU Sans
    fontSize: 13px
    fontWeight: 600
    lineHeight: 1.45
    letterSpacing: -0.008em
  button-md:
    fontFamily: UwU Sans
    fontSize: 14px
    fontWeight: 600
    lineHeight: 1.45
    letterSpacing: -0.008em
  button-lg:
    fontFamily: UwU Sans
    fontSize: 15px
    fontWeight: 600
    lineHeight: 1.45
    letterSpacing: -0.008em
  wordmark:
    fontFamily: UwU Sans
    fontSize: 14px
    fontWeight: 800
    lineHeight: 1.45
    letterSpacing: -0.02em
  mono:
    fontFamily: JetBrains Mono
    fontSize: 0.92em
    fontWeight: 400
    lineHeight: 1.45
    letterSpacing: 0em

rounded:
  small: 8px # --uwu-radius-small: small chips, code, tooltips (rounded-lg)
  control: 10px # --uwu-radius-control: inputs, selects, hints
  xl: 12px # Tailwind rounded-xl: menu items, sidebar rows, a card's icon tile
  card: 16px # --uwu-radius-card: cards, panes; also menus and toasts (rounded-2xl)
  dialog: 22px # --uwu-radius-dialog
  full: 999px # --uwu-radius-pill: buttons, pills, badges, tags, switches, avatars

spacing:
  # --uwu-space-*: one 4 px scale, equal to Tailwind's spacing steps 1…10.
  space-1: 4px
  space-2: 8px
  space-3: 12px
  space-4: 16px
  space-5: 20px
  space-6: 24px
  space-8: 32px
  space-10: 40px
  titlebar-height: 38px
  titlebar-mac-inset: 78px
  phone-breakpoint: 700px

components:
  button-primary:
    backgroundColor: "{colors.pink-solid}"
    textColor: "{colors.on-pink}"
    typography: "{typography.button-md}"
    rounded: "{rounded.full}"
    height: 40px
    padding: 0 16px
  button-primary-hover:
    backgroundColor: "{colors.pink-solid-hover}"
    textColor: "{colors.on-pink}"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    borderColor: "{colors.border}"
    typography: "{typography.button-md}"
    rounded: "{rounded.full}"
    height: 40px
    padding: 0 16px
  button-secondary-hover:
    backgroundColor: "{colors.elevated}"
    textColor: "{colors.ink}"
  button-ghost:
    backgroundColor: transparent
    textColor: "{colors.ink}"
    typography: "{typography.button-md}"
    rounded: "{rounded.full}"
    height: 40px
    padding: 0 16px
  button-ghost-hover:
    backgroundColor: "color-mix(in srgb, #ffe4ef 60%, transparent)"
    textColor: "{colors.ink}"
  button-danger:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.danger-ink}"
    borderColor: "{colors.border}"
    typography: "{typography.button-md}"
    rounded: "{rounded.full}"
    height: 40px
    padding: 0 16px
  button-danger-hover:
    backgroundColor: "{colors.danger-tint}"
    textColor: "{colors.danger-ink}"
  button-sm:
    typography: "{typography.button-sm}"
    height: 32px
    padding: 0 12px
  button-lg:
    typography: "{typography.button-lg}"
    height: 48px
    padding: 0 24px
  icon-button:
    backgroundColor: transparent
    textColor: "{colors.muted}"
    rounded: "{rounded.full}"
    size: 36px
  icon-button-hover:
    backgroundColor: "color-mix(in srgb, #ffe4ef 60%, transparent)"
    textColor: "{colors.ink}"
  icon-button-active:
    backgroundColor: "{colors.pink-tint}"
    textColor: "{colors.pink-ink}"
  text-input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    borderColor: "color-mix(in srgb, #8a7d8b 60%, transparent)"
    typography: "{typography.body}"
    rounded: "{rounded.control}"
    height: 44px
    padding: 0 14px
  text-input-focus:
    borderColor: "{colors.pink}"
  text-input-invalid:
    borderColor: "{colors.danger}"
  field-label:
    textColor: "{colors.muted}"
    typography: "{typography.label}"
  switch-on:
    backgroundColor: "{colors.pink-solid}"
    rounded: "{rounded.full}"
    width: 44px
    height: 24px
  switch-off:
    backgroundColor: "color-mix(in srgb, #8a7d8b 70%, transparent)"
    rounded: "{rounded.full}"
    width: 44px
    height: 24px
  segmented:
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.full}"
    padding: 4px
  segmented-option:
    backgroundColor: transparent
    textColor: "{colors.muted}"
    typography: "{typography.button-sm}"
    rounded: "{rounded.full}"
    height: 32px
    padding: 0 16px
  segmented-option-selected:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.pink-ink}"
  pill:
    backgroundColor: transparent
    textColor: "{colors.muted}"
    borderColor: "{colors.border}"
    typography: "{typography.menu-item}"
    rounded: "{rounded.full}"
    height: 32px
    padding: 0 14px
  pill-active:
    backgroundColor: "{colors.pink-tint}"
    textColor: "{colors.pink-ink}"
  badge:
    backgroundColor: "{colors.pink-solid}"
    textColor: "{colors.on-pink}"
    typography: "{typography.badge}"
    rounded: "{rounded.full}"
    height: 18px
    padding: 0 6px
  tag-neutral:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.muted}"
    typography: "{typography.tag}"
    rounded: "{rounded.full}"
    height: 22px
    padding: 0 10px
  tag-pink:
    backgroundColor: "{colors.pink-tint}"
    textColor: "{colors.pink-ink}"
  tag-success:
    backgroundColor: "{colors.success-tint}"
    textColor: "{colors.success-ink}"
  tag-warning:
    backgroundColor: "{colors.warning-tint}"
    textColor: "{colors.warning-ink}"
  tag-danger:
    backgroundColor: "{colors.danger-tint}"
    textColor: "{colors.danger-ink}"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    borderColor: "{colors.hairline}"
    rounded: "{rounded.card}"
    padding: 20px
  card-icon-tile:
    backgroundColor: "{colors.pink-tint}"
    textColor: "{colors.pink-ink}"
    rounded: "{rounded.xl}"
    size: 38px
  hint-info:
    backgroundColor: "{colors.elevated}"
    textColor: "{colors.ink}"
    borderColor: "{colors.hairline}"
    typography: "{typography.meta}"
    rounded: "{rounded.control}"
    padding: 10px 14px
  hint-warning:
    backgroundColor: "{colors.warning-tint}"
    textColor: "{colors.warning-ink}"
  hint-danger:
    backgroundColor: "{colors.danger-tint}"
    textColor: "{colors.danger-ink}"
  hint-success:
    backgroundColor: "{colors.success-tint}"
    textColor: "{colors.success-ink}"
  menu:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    borderColor: "{colors.border}"
    rounded: "{rounded.card}"
    padding: 6px
  menu-item:
    textColor: "{colors.ink}"
    typography: "{typography.menu-item}"
    rounded: "{rounded.xl}"
    padding: 8px 12px
  menu-item-hover:
    backgroundColor: "color-mix(in srgb, #ffe4ef 60%, transparent)"
  menu-item-danger:
    textColor: "{colors.danger-ink}"
  dialog:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    borderColor: "{colors.border}"
    rounded: "{rounded.dialog}"
    width: 560px
  dialog-sm:
    width: 420px
  dialog-lg:
    width: 860px
  dialog-viewer:
    width: 1200px
  toast:
    backgroundColor: "{colors.toast}"
    textColor: "{colors.toast-ink}"
    typography: "{typography.menu-item}"
    rounded: "{rounded.card}"
    padding: 10px 8px 10px 16px
  tooltip:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.canvas}"
    typography: "{typography.caption}"
    rounded: "{rounded.small}"
    padding: 4px 10px
  avatar:
    backgroundColor: "{colors.pink-tint}"
    textColor: "{colors.pink-ink}"
    rounded: "{rounded.full}"
    size: 36px
  status-dot:
    rounded: "{rounded.full}"
    size: 8px
  titlebar:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    borderColor: "{colors.hairline}"
    height: 38px
    padding: 0 0 0 14px
  titlebar-action:
    textColor: "{colors.muted}"
    rounded: "{rounded.full}"
    size: 30px
  window-control:
    width: 46px
  window-control-hover:
    backgroundColor: "{colors.elevated}"
  window-control-close-hover:
    backgroundColor: "{colors.pink-solid}"
    textColor: "{colors.on-pink}"
---

# UwUSuite Design

This file describes the UwUSuite look for coding agents and design tools, in
the [DESIGN.md format](https://github.com/google-labs-code/design.md). The
tokens above are a snapshot of `src/css/tokens.css` and the components in
`src/components/` at version 1.8.1. **The package is the source of truth:** if
this file and the code disagree, the code wins. Build UI by importing
`@uwusuite/design`, not by copying these values (see [For agents](#for-agents)).

The detailed rules live in [`docs/`](docs/): [color](docs/color.md),
[typography](docs/typography.md), [motion](docs/motion.md),
[components](docs/components.md), [icons](docs/icons.md),
[nyu](docs/nyu.md), [window](docs/window.md), [macos](docs/macos.md),
[mobile](docs/mobile.md), [tone](docs/tone.md), [brand](docs/brand.md),
[app-icons](docs/app-icons.md). Live styleguide:
[uwu.minifyx.de/design](https://uwu.minifyx.de/design/).

## Overview

The UwUSuite is a family of privacy-minded tools (mail, notes, passwords, SSH,
remote desktop, screen mirroring, sign-in) that should feel **cute, calm and
trustworthy at the same time**. Cute comes from the pink, the round shapes, Nyu
the cat and the playful words. Calm comes from a quiet, low-contrast frame:
a grey-pink canvas, white surfaces, hairlines instead of shadows and one accent
colour only. Trustworthy comes from legible type, strict contrast and plain
words whenever safety, sharing or deleting is involved.

Every app looks like the same family on Windows, Linux, macOS, iPhone, iPad
and Android, and at the same time like it belongs on that platform: a custom
title bar on Windows and Linux, the native title bar and menu bar on macOS,
Liquid Glass on iOS 26, Material 3 on Android.

**Key characteristics**

- **One accent: pink, in two strengths.** `pink` (#ff4d8d) for marks without
  text: dots, selection, focus, the logo. `pink-solid` (#e11d74) for every fill
  that carries text. No second accent colour.
- **Warm neutrals with a pink cast.** Canvas #f8f4f6, ink #1c1420 (a plum
  black), muted #716672. Never pure grey, never pure black (except in high
  contrast).
- **Canvas and cards.** White `surface` cards on the `canvas`, 16 px radius,
  1 px `hairline`, no shadow.
- **Pills everywhere you click.** Buttons, pills, badges, tags, switches and
  avatars are fully round.
- **Shadows only for what floats:** menus, dialogs, toasts, popovers.
- **UwU Sans**, a highly legible sans, bundled with the package. Sizes follow
  the platform and the system's text size.
- **Soft motion with a little spring**, 150–220 ms, always switchable off.
- **Nyu**, a die-cut sticker cat whose body is each app's object.
- **Three themes, all first-class:** light, dark, high contrast (light and
  dark), plus reduced motion.

## Colors

All colours are `--uwu-*` custom properties in `src/css/tokens.css`, mapped to
Tailwind names in `src/css/tailwind.css` (`--uwu-surface` → `bg-surface`,
`--uwu-border` → `border-line`, `--uwu-pink-ink` → `text-pink-ink`).
Components never use raw hex values; a missing colour becomes a new token in
the package. `tests/contrast.test.ts` checks every text pair against 4.5:1,
every mark (dots, outlines, switches) against 3:1 and high contrast against
7:1, in all four themes.

### Surfaces and text

| Token             | Light     | Dark      | Role                                                       |
| ----------------- | --------- | --------- | ---------------------------------------------------------- |
| `canvas`          | `#f8f4f6` | `#141016` | App background                                             |
| `surface`         | `#ffffff` | `#1c171f` | Cards, lists, reader, dialogs, title bar                   |
| `elevated`        | `#fcf8fa` | `#241e28` | Hover rows, popovers, hints                                |
| `ink`             | `#1c1420` | `#f8f2f6` | Text                                                       |
| `muted`           | `#716672` | `#b3a8b3` | Secondary text, labels, quiet icons                        |
| `faint`           | `#a69ba5` | `#7d717d` | Placeholders, chevrons; never for text that must be read   |
| `hairline`        | `#f2e8ee` | `#2c2430` | Dividers, card borders                                     |
| `border` (`line`) | `#e9dde4` | `#3a3040` | Button, menu and dialog borders                            |
| `control`         | `#8a7d8b` | `#7d7185` | Outline of what takes input, switch off (3:1, WCAG 1.4.11) |

### Brand: two pinks

| Token              | Light     | Dark      | Role                                                                     |
| ------------------ | --------- | --------- | ------------------------------------------------------------------------ |
| `pink`             | `#ff4d8d` | `#ff7fac` | **Brand.** Dots, selection, focus ring, logo, sparkles                   |
| `pink-solid`       | `#e11d74` | `#ff7fac` | Fills with text: primary button, badge, switch on, the "UwU" of the logo |
| `pink-solid-hover` | `#c8165f` | `#ff9dbf` | Hover on `pink-solid`                                                    |
| `on-pink`          | `#ffffff` | `#1c1420` | Text on `pink-solid` (dark text in dark mode)                            |
| `pink-ink`         | `#a3154f` | `#ffa3c4` | Pink text, mostly on tints                                               |
| `pink-tint`        | `#ffe4ef` | `#3a1a2a` | Active row, selected pill, nav item; hover at 45–60 %                    |
| `pink-tint-strong` | `#ffd0e2` | `#4d2338` | Pressed, text selection (`::selection`)                                  |

White text on `#ff4d8d` reaches only 3.1:1, so text on a pink fill always uses
`pink-solid` (4.5:1). `pink` reaches 3:1 on `surface` but not on `canvas`;
there it is decoration only (logo, sparkles, a dot next to bold text). A mark
that alone carries a state uses `pink-solid`.

**Pink means "selected" or "focus".** It never means "online", "ok" or
success. The only exception: a pulsing pink dot while something is starting
(`StatusDot state="connecting"`).

### States

The plain token is for dots, icons and fills, `-ink` for text, `-tint` for
backgrounds.

| State     | Plain (light / dark)  | `-ink` (light / dark) | `-tint` (light / dark) | Means                      |
| --------- | --------------------- | --------------------- | ---------------------- | -------------------------- |
| `success` | `#12a06d` / `#3ddc97` | `#17796a` / `#5cc7ac` | `#d8f5e8` / `#123a2a`  | Ready, live, online, saved |
| `warning` | `#b86e00` / `#f5b94a` | `#8e5510` / `#d8a25c` | `#fdf0d6` / `#3a2a0c`  | Needs attention            |
| `danger`  | `#d92d44` / `#ff6b7e` | `#b4233a` / `#ff8a99` | `#fde4e7` / `#3d1a20`  | Failed, delete             |
| `offline` | `#b3a8b3` / `#6d6474` | –                     | –                      | Off, not connected         |

### Accounts and avatars

Accounts, profiles and spaces get one of six fixed colours, the same in both
themes: `account-pink` #ff4d8d, `account-violet` #8b5cf6, `account-sky`
#0ea5e9, `account-mint` #10b981, `account-amber` #f59e0b, `account-coral`
#f97360. The initials chip (`Avatar`, colour from `avatarColor(seed)`, stable
per address) uses a tint and an ink per colour, which do change with the theme:

| Colour | Light tint / ink      | Dark tint / ink       |
| ------ | --------------------- | --------------------- |
| pink   | `#ffe4ef` / `#a3154f` | `#3a1a2a` / `#ffa3c4` |
| violet | `#ede5ff` / `#5b32c7` | `#2a2142` / `#c4b1ff` |
| sky    | `#dff3fc` / `#0b6591` | `#10293a` / `#8fd6f8` |
| mint   | `#d8f5e8` / `#0b6e4c` | `#123a2a` / `#6ee7b7` |
| amber  | `#fdf0d6` / `#8a5606` | `#3a2a0c` / `#f5c453` |
| coral  | `#fde6e2` / `#a8392a` | `#3d1d18` / `#ffab9d` |

### Toast, backdrop, stage, art

- **Toast** is inverted: `toast` #1c1420 with `toast-ink` #ffffff, accent
  #ff7fac, danger #ff8096 on a light app; #f8f2f6 with #1c1420, #a3154f,
  #b4233a on a dark one.
- **Backdrop** behind modal dialogs: `rgb(28 20 32 / 0.35)` light,
  `rgb(0 0 0 / 0.5)` dark. **Scrim** behind sheets and context menus:
  `rgb(25 10 20 / 0.3)` light, `rgb(0 0 0 / 0.5)` dark.
- **Stage:** a mirrored phone, a remote desktop or a terminal sits on a
  near-black stage in both themes: `stage` #0c0a0d, `stage-ink` #f8f2f6,
  `stage-muted` #b3a8b3, `stage-overlay` `rgb(28 23 31 / 0.92)`,
  `stage-border` #3a3040. The picture itself is never tinted, filtered or
  rounded.
- **Art** (app icon tile, installers, website), fixed, never themed:
  `tile-from` #fff3f8 → `tile-to` #ffd3e5, `plum` #4b1d3f, `plum-soft`
  #7a5670.

### High contrast

`<html data-contrast="high">` (Darstellung → Kontrast, or
`prefers-contrast: more`) switches to black on white or white on black, text
and borders at 7:1 or more, and an accent dark or light enough to be text.
`html:root[data-contrast="high"]` outranks a server admin's accent colour, so
high contrast always wins.

| Token                     | High, light | High, dark |
| ------------------------- | ----------- | ---------- |
| `canvas` / `surface`      | `#ffffff`   | `#000000`  |
| `elevated`                | `#eeeeee`   | `#1f1f1f`  |
| `ink`                     | `#000000`   | `#ffffff`  |
| `muted`                   | `#333333`   | `#e6e6e6`  |
| `faint`                   | `#595959`   | `#a8a8a8`  |
| `hairline`                | `#595959`   | `#8c8c8c`  |
| `border`                  | `#333333`   | `#d9d9d9`  |
| `control`                 | `#000000`   | `#ffffff`  |
| `pink` / `pink-solid`     | `#8a0046`   | `#ffa6c9`  |
| `pink-solid-hover`        | `#6e0038`   | `#ffc2d9`  |
| `on-pink`                 | `#ffffff`   | `#000000`  |
| `pink-ink`                | `#7a003c`   | `#ffc2d9`  |
| `pink-tint`               | `#ffe4ef`   | `#4a0f2c`  |
| `pink-tint-strong`        | `#ffc2d9`   | `#5c1236`  |
| `danger` / `danger-ink`   | `#8a0017`   | `#ff9aa8`  |
| `success` / `success-ink` | `#00564a`   | `#7fe0c6`  |
| `warning` / `warning-ink` | `#5c3d00`   | `#ffd08a`  |
| `offline`                 | `#595959`   | `#a8a8a8`  |
| focus ring                | `#000000`   | `#ffffff`  |

### Themes

`applyAppearance()` or the `useAppearance()` hook writes three attributes on
`<html>`; "System" follows the matching media query.

| Attribute       | Values             | Setting                                        |
| --------------- | ------------------ | ---------------------------------------------- |
| `data-theme`    | `light` · `dark`   | Darstellung → Design: System · Hell · Dunkel   |
| `data-contrast` | `normal` · `high`  | Darstellung → Kontrast: System · Normal · Hoch |
| `data-motion`   | `full` · `reduced` | Darstellung → Animationen: System · An · Aus   |

Tailwind's `dark:` follows `data-theme`; `contrast-high:`, `motion-reduced:`
and `phone:` (below 700 px) are variants too. `bootScript(key)` in
`index.html` (or as a file such as `public/boot.js` under a strict CSP) keeps a
dark app from flashing white.

## Typography

| Role                                    | Font                                                           |
| --------------------------------------- | -------------------------------------------------------------- |
| Interface (default)                     | **UwU Sans**: `fonts/UwUSans[wght].woff2`, weights 200–800     |
| Code, addresses, fingerprints, versions | **JetBrains Mono** (`@fontsource-variable/jetbrains-mono`)     |
| Font picker (Darstellung → Schrift)     | Manrope, Rubik, DM Sans or the system font (`font-picker.css`) |

UwU Sans is Atkinson Hyperlegible Next with its letters untouched, plus Nyu
(U+E000), a heart (U+2665) and arrows (U+2190–2193). It has no ligatures (`:3`
and `<3` stay as typed) and **no italic**. Both fonts are bundled; nothing is
loaded from the network.

Fallback stack: `"UwU Sans", system-ui, -apple-system, "Segoe UI", Roboto,
"Helvetica Neue", "Noto Sans", Arial, sans-serif`. Mono:
`"JetBrains Mono Variable", "JetBrains Mono", ui-monospace, "Cascadia Mono",
Consolas, monospace`. Tracking is set in CSS (`--tracking-ui`): UwU Sans
-0.008em, Manrope and DM Sans -0.004em, Rubik and the system font 0. Code
keeps `letter-spacing: 0` and its contextual ligatures off, so `->` and `!=`
look as typed.

### Size scale

Every size is a token, and every token follows the platform and the system's
text size: **size = platform points × optical × scale**. `<html data-type>`
(`macos`, `ios`, `android`; none for Windows and Linux) picks the points.
Optical (`--uwu-type-optical`) matches UwU Sans to the system font by
x-height: 1.06 on Apple systems and Android. Scale (`--uwu-type-scale`) is the
system's text size times Darstellung → Textgröße (Kleiner × 0.9 · System × 1
· Größer × 1.15 · Sehr groß × 1.3). `useTypeScale()` sets all three.

| Token (`--uwu-text-*`) | Tailwind       | Win/Linux | macOS | iOS/iPadOS | Android | Use                                      |
| ---------------------- | -------------- | --------- | ----- | ---------- | ------- | ---------------------------------------- |
| `large`                | `text-large`   | 28        | 26    | 34         | 32      | Large title (phone pages, start)         |
| `title`                | `text-title`   | 22        | 22    | 28         | 24      | Page title, bold, -0.01em                |
| `section`              | `text-section` | 18        | 17    | 20         | 22      | Dialog title, section                    |
| `reading`              | `text-reading` | 16        | 15    | 17         | 16      | Mails, notes, explanations, leading 1.55 |
| `body`                 | `text-body`    | 14        | 13    | 17         | 16      | Interface and lists, leading 1.45        |
| `meta`                 | `text-meta`    | 13        | 12    | 15         | 14      | Small buttons, menus, metadata           |
| `caption`              | `text-caption` | 12        | 11    | 13         | 12      | Hints under fields, group titles         |
| `badge`                | `text-badge`   | 11        | 10    | 11         | 11      | Counts, badges                           |

Mobile components and anything that should look like the platform's own text
styles use the **roles** (`--uwu-type-*`, Tailwind `text-type-*`), named after
Apple's text styles:

| Role          | Win/Linux | macOS | iOS/iPadOS | Android (M3)      |
| ------------- | --------- | ----- | ---------- | ----------------- |
| `large-title` | 28        | 26    | 34         | 32 headline large |
| `title1`      | 22        | 22    | 28         | 24 headline small |
| `title2`      | 18        | 17    | 22         | 22 title large    |
| `title3`      | 16        | 15    | 20         | 18                |
| `headline`    | 14        | 13    | 17         | 16 title medium   |
| `body`        | 14        | 13    | 17         | 16 body large     |
| `callout`     | 13        | 12    | 16         | 14 body medium    |
| `subheadline` | 13        | 11    | 15         | 14 label large    |
| `footnote`    | 12        | 10    | 13         | 12 body small     |
| `caption1`    | 12        | 10    | 12         | 12 label medium   |
| `caption2`    | 11        | 10    | 11         | 11 label small    |

Line heights: `--uwu-leading` 1.45 (body), `--uwu-leading-reading` 1.55,
`--uwu-leading-tight` 1.25. The iOS large title is weight 750, line height
1.15, -0.01em.

### Weights

| Weight | Use                                                                     |
| ------ | ----------------------------------------------------------------------- |
| 400    | Text, list and sidebar rows, counts, metadata                           |
| 500    | Menu items, pills, toasts                                               |
| 600    | Item names, buttons, field labels, segmented choices, the headline role |
| 700    | Card, dialog and group titles, badges                                   |
| 750    | The iOS large title                                                     |
| 800    | The wordmark only                                                       |

Group titles are caption, bold, uppercase, `tracking-wide`, `text-muted`.
Counts, dates and times use `tabular-nums`. Sidebar and list rows stay regular
and mark the selection with colour; UwU Sans is sturdy enough already.

## Layout

- **Spacing:** one 4 px scale, `--uwu-space-1…10` = 4, 8, 12, 16, 20, 24, 32,
  40 px (Tailwind's spacing steps). The components also use Tailwind's half
  steps 6, 10 and 14 px (`gap-1.5`, `py-2.5`, `px-3.5`) for padding inside
  controls; don't go off the 2 px grid.
- **Canvas and cards:** grey-pink canvas, white cards on it. Lists are rounded
  rows with a small gap and no dividers. Hover tints `pink-tint` at 45 %,
  selected is `pink-tint`.
- **Sidebar:** 240–264 px; rows 36 px, `rounded-xl`, active
  `bg-pink-tint text-pink-ink`. Group titles 12 px uppercase `text-muted`.
  Below 1024 px (web) or 700 px (apps) the sidebar becomes a drawer that
  slides in from the left.
- **Settings:** a large dialog with a 170 px nav on the left (active is
  `pink-tint`) and `SettingRow`s on the right. Groups: Allgemein (language,
  startup, log), Darstellung (design, contrast, animations, font, text size,
  tone), then the app's own; About comes last.
- **Tabs:** top tabs for parallel things (streams, sessions): device icon with
  a state dot, title, close button on hover. Active tabs show a pink top inset
  (`inset 0 2px 0 var(--uwu-pink)`).
- **Windows:** default 1180 × 760 for tools, 1280 × 820 for content apps (mail,
  notes); minimum 640 × 440. Below 700 px wide the phone layout applies
  (`phone:`): toasts move to the top, dialogs (except `sm`) go full screen,
  footer buttons share the row and wrap.
- **Full screen** (streams, remote desktops): all chrome hidden; a bar slides
  in from the top edge on hover, max 640 px wide, bottom radii 16 px, on
  `stage-overlay`.
- **Text grows:** rows and fields use `min-height`, never a fixed height
  around text. German compounds wrap (`overflow-wrap: break-word`).
- **Selection:** desktop apps put `class="uwu-app"` on `<body>`; the window
  never scrolls as a whole and only inputs, content and `.selectable` can be
  selected.

## Elevation & Depth

Depth comes from **tone, not shadow**: canvas → surface → elevated, separated
by 1 px `hairline` or `border`. Cards never have a shadow.

| Token                  | Light                                                              | Dark                                                        | For                                        |
| ---------------------- | ------------------------------------------------------------------ | ----------------------------------------------------------- | ------------------------------------------ |
| `--uwu-shadow-float`   | `0 12px 32px rgb(28 20 32 / 0.12), 0 2px 8px rgb(28 20 32 / 0.06)` | `0 12px 32px rgb(0 0 0 / 0.45), 0 2px 8px rgb(0 0 0 / 0.3)` | Menus, dialogs, toasts, popovers, tooltips |
| `--uwu-shadow-primary` | `0 2px 10px rgb(225 29 116 / 0.25)`                                | `0 2px 10px rgb(255 127 172 / 0.2)`                         | The primary button                         |
| `--uwu-shadow-nyu`     | `0 6px 10px rgb(194 48 111 / 0.12)`                                | (same)                                                      | Nyu (`drop-shadow-nyu`)                    |
| `--uwu-focus`          | `0 0 0 3px rgb(255 77 141 / 0.35)`                                 | `0 0 0 3px rgb(255 127 172 / 0.4)`                          | Focus ring (`shadow-focus`)                |

Modal dialogs sit on `backdrop` with a 2 px backdrop blur. Layers:
`--uwu-z-sticky` 30, `--uwu-z-menu` 40, `--uwu-z-cameo` 45, `--uwu-z-toast`
50, `--uwu-z-tooltip` 60; modal dialogs use the browser's top layer above all
of these.

**Liquid Glass** (iOS 26, `.uwu-glass`) is the only translucent material: the
`--uwu-glass` fill (`rgb(255 255 255 / 0.56)` light, `rgb(44 36 48 / 0.52)`
dark) over `backdrop-filter: blur(16px) saturate(1.9)`, a 0.5 px
`--uwu-glass-edge`, a bright top highlight and a soft shade
(`0 8px 26px -6px var(--uwu-glass-shade)`). Only for what floats: tab bar,
search button, toolbar buttons, toasts, context menus, the iPad sidebar. Text
on glass is `ink`. Without `backdrop-filter`, with reduced transparency or in
high contrast it turns solid.

## Shapes

Round where you touch, softly rounded where you read.

| Element                                         | Radius                               |
| ----------------------------------------------- | ------------------------------------ |
| Buttons, pills, badges, tags, switches, avatars | 999 px (`rounded-full`)              |
| Inputs, selects, hints                          | 10 px (`rounded-control`)            |
| Menu items, sidebar rows, a card's icon tile    | 12 px (`rounded-xl`)                 |
| Cards, panes                                    | 16 px (`rounded-card`)               |
| Menus, toasts                                   | 16 px (`rounded-2xl`)                |
| Dialogs                                         | 22 px (`rounded-dialog`)             |
| Small chips, code, tooltips                     | 8 px (`rounded-small`, `rounded-lg`) |
| App icon tile                                   | `rx="116"` on 512 × 512              |

Mobile: iOS grouped lists 26 px (inset 16 px from the edges), iOS sheets
38 px, iOS toolbar buttons 44 px circles, the Android FAB 56 px with 16 px
radius, the Android navigation indicator a 64 × 32 pill.

## Motion

Short and soft, with a little spring. Motion explains where something comes
from; it is never the point, and it can always be turned off.

| Token                  | Value                               | Use                              |
| ---------------------- | ----------------------------------- | -------------------------------- |
| `--uwu-duration-fast`  | 150ms                               | Colour changes, hover, buttons   |
| `--uwu-duration-base`  | 200ms                               | Switches, avatars fading in      |
| `--uwu-duration-enter` | 220ms                               | Things coming in (toast, drawer) |
| `--uwu-ease-out`       | `cubic-bezier(0.2, 0.9, 0.3, 1)`    | Default (`ease-uwu`)             |
| `--uwu-ease-pop`       | `cubic-bezier(0.2, 0.9, 0.3, 1.3)`  | Popups with a little overshoot   |
| `--uwu-ease-spring`    | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Website, installer, Nyu          |

| Utility              | Keyframes                                       | Use                                |
| -------------------- | ----------------------------------------------- | ---------------------------------- |
| `animate-pop`        | `uwu-pop` 180ms ease-pop, scale 0.94 → 1 + fade | Menus, dialogs, empty states       |
| `animate-slide-up`   | `uwu-slide-up` 220ms, from 12 px below + fade   | Toasts                             |
| `animate-fade`       | `uwu-fade` 160ms ease-out                       | Cross-fades                        |
| `animate-drawer`     | `uwu-drawer` 220ms, from -100 % x               | Phone sidebar from the left        |
| `animate-screen-in`  | `uwu-screen-in` 220ms, from 24 % x, opacity 0.6 | Phone detail screen from the right |
| `animate-wiggle`     | `uwu-wiggle` 600ms, ±6°                         | "Something's missing here"         |
| `animate-pulse-soft` | `uwu-pulse` 1s, opacity 1 → 0.35, infinite      | Connecting dots                    |
| `animate-spin`       | `uwu-spin`                                      | Spinners                           |

Pressed buttons scale to 0.97 (`active:scale-[0.97]`). The mobile sheets and
pushed pages have their own curves in `mobile.css` (`--uwu-ease-sheet`
`cubic-bezier(0.2, 0.9, 0.25, 1)`, `--uwu-ease-push`
`cubic-bezier(0.2, 0.85, 0.25, 1)`, 300–420 ms) to match iOS.

With `data-motion="reduced"` every animation and transition collapses to 1 ms
and runs once, Nyu holds still, the flying Nyu is hidden and gestures finish
without animating. Nothing ever waits for an animation before it accepts
input.

## Iconography

- **Lucide** (`lucide-react`) is the base; the suite draws what Lucide lacks by
  the same rules (`src/icons/suite.ts`: `android`, `paw`, `nyu`,
  `hand-mirror`, `devices-sync`, `tunnel`).
- **Always through `<Icon>`** and **always by meaning** from `ICONS`
  (`ICONS.settings`, `ICONS.delete`, `ICONS.close` …): one meaning, one glyph,
  across all apps. A new meaning goes into `src/icons/vocabulary.ts` in this
  package.
- **Sizes and strokes** (apps never pick their own stroke):

  | Size | px  | Stroke | Use                                              |
  | ---- | --- | ------ | ------------------------------------------------ |
  | `xs` | 14  | 2      | Dense text, chips, badges                        |
  | `sm` | 16  | 1.8    | Buttons, menu items, list rows, fields (default) |
  | `md` | 18  | 1.8    | Icon buttons, navigation, title bar              |
  | `lg` | 20  | 1.8    | Touch toolbars, device tabs, card lead icons     |
  | `xl` | 24  | 1.6    | Setting groups, a dialog's lead icon             |

  Inside a filled `Button` the icon is drawn at stroke 2.2.

- **Colour:** always `currentColor`. Quiet icons `text-muted`, `text-ink` on
  hover, `text-pink-ink` when active; state icons the state's `-ink`. Fills
  only for a state (a starred star in `fill-pink`), never as decoration.
- **Drawing a suite icon:** 24 × 24 grid, 2 px padding, strokes only, round
  caps and joins from `<Icon>`, rectangles `rx="2"`, no own fill, stroke,
  transform or text. `pnpm lint` checks it.
- **Window controls** (minimize, maximize, close) are `TitleBar`'s own 10 × 10
  glyphs at stroke 1, not Lucide icons.

## Components

React 18.3 or 19, styled with Tailwind v4 through `tailwind.css`. Every
component works with the keyboard, has a name for screen readers, works in a
phone layout and in dark, high contrast and reduced motion. The `components`
tokens above give the light-theme values; dark and high contrast come from the
same tokens.

### Buttons

**`Button`**: always a pill, `font-semibold`, transitions 150 ms, presses to
`scale(0.97)`, disabled at 55 % opacity. Sizes `sm` 32 px (`px-3`,
`text-meta`), `md` 40 px (`px-4`, `text-body`, default), `lg` 48 px (`px-6`,
body + 1 px). On phones it grows in height and wraps instead of overflowing.

- `primary`: `pink-solid` with `on-pink` and `shadow-primary`; hover
  `pink-solid-hover`. **One per view**; it carries the action the view is for.
  While focused the ring replaces its shadow.
- `secondary` (default): `surface`, 1 px `border`, `ink`; hover `elevated`
  and a border of `faint` at 50 %.
- `ghost`: no fill, `ink`; hover `pink-tint` at 60 %.
- `danger`: `surface`, 1 px `border`, `danger-ink`; hover `danger-tint`.
- `busy` shows a spinner (or a `busyIndicator` such as Nyu thinking) and
  disables the button; `aria-busy` is set.

**`IconButton`**: round, 36 px (`md`, 18 px icon) or 32 px (`sm`, 16 px icon),
`muted`; hover `pink-tint` at 60 % and `ink`; `active` is `pink-tint` with
`pink-ink` and `aria-pressed`. `label` is required: it is the accessible name
and the tooltip.

### Inputs and forms

- **`Field`**: label above (`text-meta`, 600, `muted`), the control, then an
  error (`text-meta`, `danger-ink`, `role="alert"`) or a hint (`text-caption`,
  `muted`), 6 px apart. The render prop receives `(id, describedBy)`.
- **`TextInput`, `TextArea`, `Select`**: 44 px high (text area at least 96 px),
  `rounded-control`, `surface`, 1 px outline in `control` at 60 %, 14 px side
  padding, `text-body`, placeholder in `faint`. Focus: border `pink` plus the
  3 px focus ring. `aria-invalid` turns the border `danger`. Disabled at 55 %.
  On iOS text fields stay at 16 px or more, or Safari zooms in.
- **`Switch`**: 44 × 24 (`sm` 36 × 20), on `pink-solid`, off `control` at
  70 %, a white 20 px knob that slides 20 px in 200 ms. `role="switch"`.
- **`Toggle`**: a labelled setting (label 600, description `text-meta`
  `muted`) with a switch on the right.
- **`Segmented`**: 2–4 exclusive choices on a `canvas` pill with 4 px padding;
  options 32 px, `text-meta` 600, `muted`; the chosen one is `surface` with
  `pink-ink` and a small shadow (in high contrast an `ink` outline). Arrow keys
  move the choice.

### Selection and status

- **`Pill`**: a filter that is on or off, 32 px, `text-meta` 500, optional
  count. Off: 1 px `border`, `muted`, hover `ink`. On: `pink-tint`, `pink-ink`.
- **`Badge`**: unread or pending count on `pink-solid` with `on-pink`, 18 px
  high, `text-badge` bold, `tabular-nums`; hidden at 0, capped at `999+`.
- **`Tag`**: what something is ("Beta", "Neu", "Offline", "Admin"), 22 px,
  `text-caption` 600: `neutral` (`canvas`/`muted`), `pink`, `success`,
  `warning`, `danger` (each `-tint` with `-ink`).
- **`StatusDot`, `StatusLine`**: an 8 px dot, `online` in `success`,
  `connecting` in `pink` with a soft pulse, `offline` in `offline`, `error` in
  `warning`. **Always with text** that says the same.
- **`Avatar`**: initials in one of the six account tints, or a picture; 28,
  36 or 48 px, bold.

### Containers

- **`Card`**: `surface` on `canvas`, 1 px `hairline`, `rounded-card`, 20 px
  padding, 14 px gaps, **no shadow**. Optional header: a 38 px `pink-tint`
  icon tile (`rounded-xl`, 20 px icon in `pink-ink`), a bold title (body
  - 1 px), a `muted` subtitle, an `aside` (often a switch). Buttons in a card
    keep their own width.
- **`SettingRow`**: label (600) and description (`muted`) left, the control
  right, rows divided by `hairline`.
- **`Hint`**: a short note, `rounded-control`, `text-meta`, 10 × 14 px
  padding. `info` is `elevated` with a `hairline`; `warning`, `danger`,
  `success` are the state's `-tint` with its `-ink` and a border of the state
  colour at 40 %.
- **`EmptyState`**: a Nyu scene (240 px, or 150 px with `compact`), a bold
  title, a `muted` body, an action.

### Overlays

- **`Menu`**: `surface`, 1 px `border`, `rounded-2xl`, `shadow-float`, 6 px
  padding, 200–360 px wide, scrolls beyond `min(75vh, 520px)`, opens 6 px from
  its trigger with `animate-pop`. Items `rounded-xl`, 8 × 12 px, `text-meta`
  500, icon in `muted`; hover and focus `pink-tint` at 60 %; `danger` items in
  `danger-ink`. Section headings are `text-badge`, bold, uppercase, `muted`.
  Escape, outside click and arrow keys work.
- **`Dialog`**: the native `<dialog>`, `surface`, 1 px `border`,
  `rounded-dialog`, `shadow-float`, opens with `animate-pop`. Widths `sm` 420
  (confirmations), `md` 560 (forms), `lg` 860 (settings), `viewer` 1200 (full
  height). Header `text-section` bold, footer with the primary button last
  above a `hairline`. `tone="warning"` adds a 4 px `warning` top border and a
  `warning-ink` title for destructive questions. Full screen on phones except
  `sm`.
- **`Toaster`** (`createToasts()`): bottom centre (top on phones), at most
  440 px wide, inverted `toast` colours, `rounded-2xl`, `shadow-float`,
  `animate-slide-up`. 5 s for info, 9 s for errors, at most 4, one optional
  action in `toast-accent`.
- **`Tooltip`**: for inline text such as names and addresses; `ink` with
  `canvas` text, `text-caption` 500, `rounded-lg`, `shadow-float`. Buttons use
  their `title` instead.

### Brand and window

- **`Wordmark`**: Nyu (the app's shell, 1.35 em, no blink), 8 px gap, "UwU" in
  `pink-solid`, the product in `ink`; weight 800, -0.02em. 14 px in the title
  bar, 19 px in a sidebar, 22–36 px on pages. `hop={n}` makes Nyu hop once on a
  real event.
- **`TitleBar`** (Windows, Linux): 38 px, `surface` with a `hairline` below,
  14 px left padding; brand left (a drag region), optional tabs or search in
  the middle, 30 px round actions with 18 px `muted` icons (`ink` on hover),
  window controls 46 px wide with 10 px glyphs; hover `elevated`, close hover
  `pink-solid` with `on-pink`. Renders nothing on macOS.

Component words (Schließen, Minimieren, Zurück …) come from `UwuLabels`:
German by default, `labels="en"` for English.

## Nyu

Nyu is the suite's cat. In every app her body is the app's thing (the
**shell**) with her face on it: UwU eyes, a `w` mouth, blush, ears poking out
on top.

| Shell    | App       | Shell      | App     |
| -------- | --------- | ---------- | ------- |
| `box`    | UwUSuite  | `lock`     | UwULock |
| `mail`   | UwUMail   | `terminal` | UwUSSH  |
| `mirror` | UwUMirror | `monitor`  | UwURDP  |
| `page`   | UwUNotes  | `badge`    | UwUAuth |

```tsx
<Nyu shell="mirror" mood="happy" size={96} />
```

`@uwusuite/design/nyu-svg` (`nyuSvg`) draws her without React for websites,
installers and build scripts.

- **Sticker style**, fixed artwork that is never themed: outline plum
  `#4B1D3F`, body `#FF6FA6`, light face or glass `#FFB8D3`, blush `#FF4D8D` at
  50 % (`#FF7FB0` on the mail envelope), a white die-cut edge. Props: star
  `#FFD66E`, tear `#9ED8FF`, lilac `#CDB8FF`, mint `#B9F0D0`, sky `#BDE6FF`,
  kraft `#F2C58F` / `#F8DDB8` / `#E3AE6F`. The white edge keeps her readable
  on dark ground.
- **Moods:** `uwu` (idle), `happy` (it worked, welcome), `cheer` (done, sent),
  `sparkle` (new, AI, a nice surprise), `sad` (failed, offline), `puzzled`
  (not found, no blush), `sleepy` (empty, waiting, no blink).
- **Scenes** for empty, error and onboarding states: 320 × 220, Nyu at 0.4–0.6
  scale with props; each app keeps its own `scenes.tsx`.
- **Motion:** blinks every 5 s, ears twitch on hover (480 ms), one hop
  (560 ms) for a real event such as new mail, never on every sync; flies off
  the "sent" toast (1.1 s); thinking dots while the AI works.
- **App icons:** Nyu tilted -6° to -8° on the pastel tile (512 × 512,
  `rx="116"`, vertical gradient `#FFF3F8` → `#FFD3E5`), about 330 px wide, drop
  shadow `#C2306F` at 25 % (dy 10, blur 10), two or three props. Never on a
  saturated pink tile, never another tile colour, a photo or text.
  `uwu-icons` generates the platform files.
- **Mascot off:** a server admin can turn her off. Then there is no cat and no
  kaomoji, and the logo becomes the app's line icon in `text-pink`.

## Platforms

### Windows and Linux

`"decorations": false` and the package's `TitleBar` (see Components).
Double-click on the empty bar maximizes; fixed-size windows (installers) pass
`maximizable={false}`. Installers are always light: the tile gradient, `plum`
text, a translucent white card with `backdrop-filter: blur(10px)`, Nyu packing
the box, a striped pink progress bar.

### macOS

A suite app on a Mac feels like a Mac app:

- The **native title bar** with traffic lights (`"decorations": true`,
  `"titleBarStyle": "Visible"`). No second bar, no fake traffic lights, no menu
  row inside the window. The title bar's buttons move into the **menu bar**
  (`setMacMenu()`): the gear becomes App → Einstellungen … (⌘,). The skeleton
  is the same in every app: App, Ablage, Bearbeiten (always, or ⌘C and ⌘V break
  in the web view), Darstellung, the app's own menus, Fenster, Hilfe.
- **Shortcuts in Mac style** (⌘, ⌥, ⇧, ⌃) in menus and tooltips:
  `shortcutText()`, `withShortcut()`.
- **⌘W hides** the window and the app stays in the Dock; ⌘Q, the Dock and
  logging out save first (`uwu-macos`, `onMacQuit()`).
- The Dock icon sits in Apple's grid (`uwu-icons` → `icon.icns`), the menu bar
  icon is a template made from the mono symbol.
- Type follows the HIG: `data-type="macos"`, body 13 pt.

### iPhone, iPad, Android

One web view app runs everywhere (Tauri 2). Wrap mobile UI in `<MobileShell>`;
`useDeviceKind()` returns `phone-ios`, `phone-android`, `ipad` or `desktop`
(a phone is a touch device under 700 px). Gate mobile UI by device kind, not
by width alone; the desktop layout does not change.

- **Pattern:** a bottom tab bar with 3–5 tabs (settings last), an overview
  page of grouped lists instead of a drawer, "+" top right on iOS or a FAB on
  Android, the account avatar top left on iOS or at the end of the search bar
  on Android, grouped inset lists for detail and edit (tap copies, with a toast
  and a haptic tick), swipe back, swipe actions, long press for a context
  menu, pull to sync.
- **iPhone (iOS 26):** a floating Liquid Glass tab bar capsule with a round
  glass search button; a large title (34 pt, 750) that collapses into a small
  centred title; 44 px round glass toolbar buttons, the sheet's primary action
  pink; grouped inset lists (radius 26, 16 px from the edges, hairlines that
  start where the text starts, chevrons); bottom sheets with a grabber and
  `medium`/`large` detents; glass toasts at the top.
- **iPad (iPadOS 26):** glass tab bar at the top centre, `SplitView` with
  sidebar | list | detail, details beside the list (never a pushed page),
  centred 560 px form sheets, ⌘F and ⌘N.
- **Android (Material 3):** a full-width bottom navigation bar with a 64 × 32
  pill indicator in `m3-indicator`, a search bar on root pages and a 64 px top
  app bar on pushed pages, surfaces in pink-derived tones (`m3-surface`
  #fff8fa, `m3-container` #f9eef3, `m3-container-high` #f4e6ec, `m3-indicator`
  #ffd9e5; dark #191115, #261c21, #31252b, #5c1f39), rows with 2 px gaps and no
  chevrons, pink section headers, a 56 px FAB, full-screen edit dialogs,
  snackbars with one action, predictive back.
- **Gestures** (`gestures.ts`): 8 px slop; long press 480 ms; iOS back from
  within 26 px of the left edge, past 110 px or a 0.5 px/ms flick; Android back
  past 28 % of the width; swipe actions 76 px each; pull to refresh arms past
  66 px. Every swipe action is also in the row's context menu or detail page.
- **Haptics** (`haptic(kind)`) confirm a copy, a step, an armed pull, a long
  press or a committed swipe; never on scroll, never in a loop, always
  switchable off.
- **Safe areas:** `--uwu-safe-top|bottom|left|right` (`viewport-fit=cover`);
  every bar and sheet reads them.
- **Native SwiftUI sheets** (AutoFill, extensions) copy the token hex values as
  dynamic light/dark colours; there is no Swift package yet.

## Tone of Voice

Playful by default: kaomoji, warm little jokes, soft animations. Darstellung →
Ton (Verspielt · Neutral) switches the words only, never the layout or
colours. German is the source language and we say "du"; English is required.

1. **Information first.** The joke never replaces what happened or what to do:
   "Nicht gesendet (╥﹏╥) Der Server sagt, das Passwort stimmt nicht."
2. **Short.** At most one kaomoji per message, and never in buttons that act on
   data: Löschen, Senden, Speichern stay plain verbs.
3. **Kind.** Never mock the person; the app laughs at itself. Nyu is never sad
   about something the person did.
4. **Plain about safety.** Who may connect, what is shared and what gets
   deleted is said plainly, in both tones.
5. **Always both.** Every string exists in neutral; the playful one is
   optional and falls back to it.

| Situation   | Neutral                         | Verspielt                                     |
| ----------- | ------------------------------- | --------------------------------------------- |
| Empty inbox | Du bist auf dem neuesten Stand. | Posteingang leer! Zeit für einen Tee (っ˘ω˘ς) |
| Sent        | Nachricht gesendet.             | Und weg ist sie ✉︎ ~                           |
| Deleted     | In den Papierkorb verschoben.   | Tschüss (｡•́︿•̀｡)                              |

Copy typography: German quotes „…" and ‚…', English "…", the en dash – as a
separator, the ellipsis … as one character, a narrow no-break space before
units, placeholders as `{name}`, `keepKaomojiTogether()` so a face never
breaks across lines. Names: UwUMail, UwULock … (one word, product
capitalised), the family is the UwUSuite, the cat is Nyu; never "Uwu Mail" or
"UWUMAIL" in text.

## Accessibility

The suite targets **WCAG 2.1 AA** everywhere, and 7:1 in high contrast.

- **Contrast:** text 4.5:1, marks and outlines 3:1, enforced by
  `tests/contrast.test.ts` for every token pair in all four themes (including
  the Material 3 tones). Use the tested pairs: `-ink` tokens for text, `on-pink`
  only on `pink-solid`, `faint` never for text that must be read.
- **Not by colour alone:** a status dot always comes with text; the selected
  segment gets an outline in high contrast.
- **Focus:** every interactive element shows the 3 px `--uwu-focus` ring on
  `:focus-visible`. Never remove it without a replacement.
- **Names:** icon-only buttons need `label`; decorative icons are
  `aria-hidden` (the default of `<Icon>`); a standalone icon gets a `label`.
- **Targets:** at least 32 px on the desktop (`IconButton size="sm"`), 36 px by
  default, 44 px on touch.
- **Keyboard:** menus, segmented controls, dialogs and steppers work with
  arrows, Enter and Escape; Escape closes only the innermost dialog.
- **Text size:** sizes follow the system's text size and Darstellung →
  Textgröße; layouts grow with the text.
- **Motion and transparency:** `data-motion="reduced"` and reduced
  transparency are honoured; nothing essential is only animated.

## Do's and Don'ts

### Do

- Do build from `@uwusuite/design`: its components, its Tailwind names
  (`bg-surface`, `text-muted`, `border-line`, `rounded-card`, `shadow-float`)
  or its `--uwu-*` custom properties.
- Do use `pink-solid` for any pink fill with text, and `pink` only for marks
  without text.
- Do keep one primary button per view, and put it last in a dialog footer.
- Do use `success` for "online", "ok" and "saved"; keep pink for selection and
  focus.
- Do use `canvas` behind, `surface` cards with a `hairline` on top, `elevated`
  for hover rows and popovers.
- Do pick icons by meaning from `ICONS`, at the `<Icon>` sizes.
- Do check every new screen in light, dark, high contrast, reduced motion, a
  phone width and with a larger text size.
- Do write every string in neutral first, in German and English.
- Do use only reserved placeholder domains (`example.com`, `*.test` …) and
  documentation IP ranges (`192.0.2.0/24`, `2001:db8::/32` …) in examples.

### Don't

- Don't use raw `#hex`, `rgb()` or Tailwind palette colours (`bg-gray-100`) in
  app code.
- Don't use pink for "online", "ok" or success, and don't add a second accent
  colour.
- Don't put shadows on cards, and don't use gradients, duotone or shadows in
  icons.
- Don't use font sizes in px; use the size tokens or roles (exceptions: avatar
  initials, app icons).
- Don't use italics for styling (UwU Sans has no italic) and never a serif.
- Don't load fonts, icons or scripts from a CDN or another server.
- Don't use a second icon set, emoji as icons, icon fonts or other companies'
  logos.
- Don't recolour, mirror, squash or crop Nyu, use her as a button or in
  actions that delete data, or add a second mascot.
- Don't put kaomoji in buttons that act on data, or jokes in safety messages.
- Don't draw a custom title bar or fake traffic lights on macOS.
- Don't use durations outside the motion tokens, endless loops outside Nyu
  scenes and connecting dots, or animations `data-motion` can't turn off.
- Don't put body text on Liquid Glass.

## For Agents

Rules for coding agents that build or change UI in any UwU app, server web UI
or UwU website.

1. **Import, don't copy.** Add the package as its release tarball and import
   from it:

   ```jsonc
   // package.json
   "@uwusuite/design": "https://github.com/MinifyX/UwUSuite-Design/releases/download/v1.8.1/uwusuite-design-1.8.1.tgz"
   ```

   ```css
   @import "tailwindcss";
   @import "@uwusuite/design/tailwind.css"; /* without Tailwind: @uwusuite/design/plain.css */
   ```

   ```tsx
   import { Button, Card, Dialog, Icon, ICONS, Nyu, useAppearance, useTypeScale } from "@uwusuite/design";
   import { setMacMenu, onMacQuit, useTauriWindow } from "@uwusuite/design/tauri";
   ```

   Use the components first, then the Tailwind names, then `var(--uwu-*)`.
   The hex values in this file are for reading and for places that cannot
   import CSS (native SwiftUI sheets); never paste them into app code. Check
   the current version in the package's `CHANGELOG.md` before you bump.

2. **Shared UI changes the design package first.** A missing colour, icon
   meaning, component or behaviour that more than one app could use goes into
   UwUSuite-Design (token in `tokens.css`, meaning in `vocabulary.ts`,
   component in `src/components/` or `src/mobile/`, with a styleguide example,
   a test and the docs). Release a minor version there, then bump the tarball
   URL in the apps. Don't rebuild it inside an app.
3. **No external fonts, CDNs or trackers.** UwU Sans and JetBrains Mono come
   from the package and are served by the app itself. No Google Fonts, no
   font or icon CDNs, no third-party scripts or styles: the suite's pages run
   GDPR-compliant without a cookie banner, and uwu.minifyx.de has a strict CSP
   (`script-src`/`font-src 'self'`, so no inline scripts; ship `bootScript`
   as a file).
4. **WCAG 2.1 AA, always.** Use tested token pairs, keep the focus ring, give
   every icon-only control a name, keep targets at 32 px or more (44 px on
   touch), never signal state by colour alone, let layouts grow with the text.
   If you add a token, add its pairs to `tests/contrast.test.ts`.
5. **Respect the settings.** Wire `useAppearance()` (theme, contrast, motion)
   and `useTypeScale()` (font, text size, platform) and add `bootScript` to
   `index.html`. Offer Design, Kontrast, Animationen, Schrift, Textgröße and
   Ton under Darstellung.
6. **Platform first.** Native title bar and menu bar on macOS, `TitleBar` on
   Windows and Linux, `MobileShell` and the mobile components on phones and
   tablets.
7. **Verify** in the package with `pnpm lint && pnpm typecheck && pnpm test`
   (about 3 seconds), and look at the screen in light, dark and high contrast.

### Prompt cheatsheet

- "Build a settings card": `Card` with `icon`, `title`, `subtitle`, a
  `Toggle` or `SettingRow`s inside; `surface`, `hairline`, 16 px radius, no
  shadow.
- "Add a confirmation": `Dialog width="sm"` with a `secondary` cancel and the
  `primary` (or `danger` for deleting, with `tone="warning"`) action last.
- "Show that it worked": `toasts.show(...)` with a neutral sentence; the
  playful variant may add one kaomoji.
- "Empty list": `EmptyState` with the app's Nyu scene, a short title and one
  action.

## Known Gaps

- The `components` tokens describe the light theme; dark and high contrast
  values come from the same tokens, listed in [Colors](#colors).
- `TextInput`, `TextArea` and `Select` draw their outline in `control` at 60 %
  and the `Switch` track off in `control` at 70 %. That is about 2.1:1 and
  2.4:1 on `surface`, below the 3:1 the full `control` token is tested for.
  Until the package changes, custom controls should use `control` at full
  strength.
- The `Switch` knob is Tailwind's `bg-white` and the Android FAB's shadow raw
  `rgb()` values; both are outside the token set.
- `--uwu-leading-reading` and `--uwu-leading-tight` are defined but not mapped
  to Tailwind names yet.
- There is no Swift package for the tokens; native sheets copy the hex values.
