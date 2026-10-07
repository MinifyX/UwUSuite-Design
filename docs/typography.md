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

It has no ligatures: `:3` and `<3` stay as typed. Nyu and the heart only show
where their code point is used. (Until 1.0.1 a `calt` feature turned `:3` into
Nyu and `<3` into a heart. It changed what people wrote, so 1.1.0 dropped it.)

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

Every size is a token, and every token follows the platform and the system's
text size:

```
size = platform points × optical × scale
```

- **Platform points** are the platform's own scale in its system font: macOS
  after the HIG (body 13 pt), iOS and iPadOS after Dynamic Type at its default
  "Large" (body 17 pt), Android after Material 3 (body large 16), Windows and
  Linux the suite's desktop scale (body 14, like Fluent). `<html data-type>`
  picks the table; without it an app keeps the desktop scale, exactly as
  before 1.8.0.
- **Optical** (`--uwu-type-optical`) matches the interface font to the system
  font by x-height. UwU Sans has an x-height of 0.496 em, SF Pro 0.526 and
  Roboto 0.528, so UwU Sans is set 6 % larger on Apple systems and Android:
  13 pt of SF read like 13.8 px of UwU Sans. The picker's fonts have their own
  factors (`FONT_X_HEIGHT`: Manrope 0.540, Rubik 0.520, DM Sans 0.504); the
  system font is 1.
- **Scale** (`--uwu-type-scale`) is the system's text size times the app's
  setting Darstellung → Textgröße.

### Tokens

| Token                | Tailwind       | Windows/Linux | macOS | iOS/iPadOS | Android | Use                                                     |
| -------------------- | -------------- | ------------- | ----- | ---------- | ------- | ------------------------------------------------------- |
| `--uwu-text-large`   | `text-large`   | 28            | 26    | 34         | 32      | Large title (phone pages, start screens)                |
| `--uwu-text-title`   | `text-title`   | 22            | 22    | 28         | 24      | Page title (bold, -0.01em)                              |
| `--uwu-text-section` | `text-section` | 18            | 17    | 20         | 22      | Dialog title, section                                   |
| `--uwu-text-reading` | `text-reading` | 16            | 15    | 17         | 16      | Reading text: mails, notes, explanations (leading 1.55) |
| `--uwu-text-body`    | `text-body`    | 14            | 13    | 17         | 16      | Interface and lists (leading 1.45)                      |
| `--uwu-text-meta`    | `text-meta`    | 13            | 12    | 15         | 14      | Buttons, menus, metadata                                |
| `--uwu-text-caption` | `text-caption` | 12            | 11    | 13         | 12      | Labels and hints under fields, group titles             |
| `--uwu-text-badge`   | `text-badge`   | 11            | 10    | 11         | 11      | Counts, badges                                          |

The numbers are points of the system font; the pixels are × optical × scale.
With UwU Sans at the system's default size that is the same on Windows and
Linux, and on macOS badge 10.6, caption 11.7, meta 12.7, body 13.8, reading
15.9, section 18, title 23.4.

### Roles

The mobile components and anything that should look like the platform's own
text styles use the roles, named after Apple's text styles. Android maps them
onto the nearest Material 3 role.

| Role (`--uwu-type-*`, Tailwind `text-type-*`) | Windows/Linux | macOS | iOS/iPadOS | Android (M3)      |
| --------------------------------------------- | ------------- | ----- | ---------- | ----------------- |
| `large-title`                                 | 28            | 26    | 34         | 32 headline large |
| `title1`                                      | 22            | 22    | 28         | 24 headline small |
| `title2`                                      | 18            | 17    | 22         | 22 title large    |
| `title3`                                      | 16            | 15    | 20         | 18 (no M3 role)   |
| `headline` (semibold)                         | 14            | 13    | 17         | 16 title medium   |
| `body`                                        | 14            | 13    | 17         | 16 body large     |
| `callout`                                     | 13            | 12    | 16         | 14 body medium    |
| `subheadline`                                 | 13            | 11    | 15         | 14 label large    |
| `footnote`                                    | 12            | 10    | 13         | 12 body small     |
| `caption1`                                    | 12            | 10    | 12         | 12 label medium   |
| `caption2`                                    | 11            | 10    | 11         | 11 label small    |

`src/lib/type.ts` holds the same tables (`TEXT_POINTS`, `ROLE_POINTS`); a test
keeps them equal to tokens.css. `MobileShell` carries `data-type="ios"` or
`"android"`, so a phone frame on a desktop page reads like the phone.

### Following the system

```ts
import { useTypeScale } from "@uwusuite/design";

useTypeScale({ font: settings.font, textSize: settings.textSize, platform });
```

`useTypeScale` sets `data-type`, `--uwu-type-optical` and `--uwu-type-scale`
on `<html>` and reads the system again when the app comes back to the front
or the window changes size (that is when someone has just changed the text
size in the system settings). Without React: `resolveType` + `applyType`, and
`readSystemType` for the system's part.

| Platform   | Where the system's text size comes from                                                                                                                                                                                                                                         |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| iOS, iPad  | Dynamic Type: WebKit resolves `font: -apple-system-body` to the body size of the current setting (xSmall 14 … Large 17 … AX5 53). The scale is that ÷ 17, kept between 0.75 and 3.2.                                                                                            |
| macOS      | The same probe, ÷ 13. macOS has no global text size, so this is 1 unless the system enlarges body text.                                                                                                                                                                         |
| Android    | Android's WebView applies the system font size itself, as text zoom on every font size. The page measures it (`measureEngineTextZoom`) but doesn't apply it again (`engineScales`). If an app sets `textZoom` to 100 in native code, the system's size is lost; leave it alone. |
| Win, Linux | None: 1. The app's own setting still applies.                                                                                                                                                                                                                                   |

`currentTypePlatform(build)` decides the table from the user agent. Pass the
platform the app was built for (`TAURI_ENV_PLATFORM` in a Tauri build): an
iPhone or iPad app on an Apple silicon Mac ("Designed for iPad") reports a Mac
without touch, but macOS shows it at 77 %. With the iOS scale it ends up at
macOS sizes (17 × 0.77 ≈ 13); with the macOS scale it would be 10 pt.

### Darstellung → Textgröße

Every app with an appearance page offers it, next to Schrift:
`TEXT_SIZE_CHOICES` with `TEXT_SIZE_LABELS` as a segmented control —
Kleiner (× 0.9) · **System** (× 1, the default) · Größer (× 1.15) · Sehr groß
(× 1.3), on top of the system's size. Stored like the other appearance
settings, on this device.

### Rules for sizes

- Font sizes come from tokens or roles, never from px in an app. Exceptions:
  things with a fixed size, like avatar initials and app icons.
- Layout grows with the text: `min-height` instead of `height` for rows and
  fields, no fixed heights around text.
- Text fields on iOS stay at 16 px or more (`max(16px, …)`), or Safari zooms
  into the page when they get focus.
- `base.css` keeps WebKit from enlarging text on its own
  (`text-size-adjust: 100%`) and from faking bold or italic
  (`font-synthesis: none`).

### Weights

| Weight | Use                                                       |
| ------ | --------------------------------------------------------- |
| 400    | Text, list and sidebar rows, counts, metadata             |
| 500    | Menu items, pills, field labels, the selected sidebar row |
| 600    | Titles, item names, buttons, headline role                |
| 700    | Dialog titles, group titles, badges                       |
| 800    | The wordmark only                                         |

macOS and iOS draw sidebar and list rows in the regular weight and mark the
selection with colour only; UwU Sans is a sturdy face already, so a 500 or 600
row reads bolder than the system's. Group titles are caption, bold, uppercase,
`tracking-wide`, `text-muted`. Counts, dates and times use `tabular-nums`.

## Rules

- Nyu and the heart are characters, not ligatures: write U+E000 or U+2665
  where you want them, never rely on `:3` or `<3` turning into a picture.
- `base.css` keeps JetBrains Mono's code ligatures off (`code`, `pre`, `kbd`,
  `samp`, `.uwu-mono`), so `->`, `!=` and `=>` look the way they were typed.
- Don't use italics for styling. UwU Sans has no italic, so the browser would
  slant it.
- Don't use serif fonts, and don't let the engine's Times show anywhere. Frames
  that render foreign HTML get our font, as UwUMail's mail frame does.
- German quotes „…“ and ‚…‘, the en dash – as a separator, the ellipsis … as one
  character.
