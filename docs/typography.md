# Typography

## Fonts

| Role                                    | Font                    | Where it comes from                                      |
| --------------------------------------- | ----------------------- | -------------------------------------------------------- |
| Interface (default)                     | **UwU Sans**            | `fonts/UwUSans[wght].woff2`, weight 200–800, about 48 KB |
| Code, addresses, fingerprints, versions | **JetBrains Mono**      | `@fontsource-variable/jetbrains-mono`                    |
| Picker choices                          | Manrope, Rubik, DM Sans | `@fontsource-variable/*`, through `font-picker.css`      |
| Picker choice                           | System font             | none                                                     |

UwU Sans is Atkinson Hyperlegible Next with its letters untouched, plus:

- Nyu (U+E000)
- a heart (U+2665)
- arrows (U+2190–2193)
- `calt` ligatures that turn `:3` into Nyu and `<3` into a heart, never next
  to a letter or digit. `10:30`, `x<3` and `1<35` stay as typed.

The license is SIL OFL 1.1. The source and build are in
[`fonts/uwu-sans-source`](../fonts/uwu-sans-source). Every app gets the font
from this package (`fonts.css`), and no app keeps its own copy. Nothing is
loaded from the network.

## Picker

Darstellung → Schrift offers `FONT_CHOICES`: UwU Sans (the default), Manrope,
Rubik, DM Sans or the system font. The choice is stored on this device only.

`applyUiFont(choice)` sets `--font-ui`, `--tracking-ui` and `data-font` on
`<html>`. Import `font-picker.css` only in apps that show the picker. The
browser fetches only the font in use.

Tracking is set in CSS, never baked into a font:

| Font             | `--tracking-ui` |
| ---------------- | --------------- |
| UwU Sans         | -0.008em        |
| Manrope, DM Sans | -0.004em        |
| Rubik, system    | 0em             |

## Scale

| Token                | Tailwind       | Size | Use                                                     |
| -------------------- | -------------- | ---- | ------------------------------------------------------- |
| `--uwu-text-title`   | `text-title`   | 22   | Page title (bold, -0.01em)                              |
| `--uwu-text-section` | `text-section` | 18   | Dialog title, section                                   |
| `--uwu-text-reading` | `text-reading` | 16   | Reading text: mails, notes, explanations (leading 1.55) |
| `--uwu-text-body`    | `text-body`    | 14   | Interface and lists (leading 1.45)                      |
| `--uwu-text-meta`    | `text-meta`    | 13   | Buttons, menus, metadata                                |
| `--uwu-text-caption` | `text-caption` | 12   | Hints under fields, group titles                        |
| `--uwu-text-badge`   | `text-badge`   | 11   | Counts, badges                                          |

Weights:

| Weight | Use                                   |
| ------ | ------------------------------------- |
| 400    | Text                                  |
| 500    | Menu items, pills                     |
| 600    | Titles, sender names, buttons, labels |
| 700    | Dialog titles, group titles, badges   |
| 800    | The wordmark only                     |

Group titles are 12 px, bold, uppercase, `tracking-wide`, `text-muted`.
Counts, dates and times use `tabular-nums`.

## Rules

- `base.css` turns the ligatures off where people type or read code (`input`,
  `textarea`, `select`, `[contenteditable]`, `code`, `pre`, `kbd`, `samp`,
  `.uwu-mono`).
- The body sets `font-feature-settings: "calt" 1` because Blink drops
  contextual alternates when letter-spacing is not 0.
- Don't use italics for styling. UwU Sans has no italic, so the browser would
  slant it.
- Don't use serif fonts, and don't let the engine's Times show anywhere. Frames
  that render foreign HTML get our font, as UwUMail's mail frame does.
- German quotes „…“ and ‚…‘, the en dash – as a separator, the ellipsis … as one
  character.
