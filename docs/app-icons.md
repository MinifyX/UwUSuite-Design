# App icons

Every app has five files in its `brand/` folder:

| File                           | What                                                                       | Used for                                                                              |
| ------------------------------ | -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `<app>-app-icon.svg`           | Nyu, slightly tilted, on the pastel tile, with props                       | macOS Dock (`icon.icns`), Windows Store tiles, Android, iOS, website, GitHub, favicon |
| `<app>-taskbar-icon.svg`       | Nyu alone, upright, no tile, white die-cut edge                            | Windows taskbar, window icon, Linux menus (`icon.ico`, `icon.png`, `32…256` PNGs)     |
| `<app>-taskbar-icon-small.svg` | Simplified cut: thicker outlines, no blush, no inner ears, no face details | The 16 and 24 px ICO frames, the tray (`tray.png`)                                    |
| `<app>-symbol.svg`             | Nyu alone with edge, for the app's UI and docs                             | About pages, README                                                                   |
| `<app>-symbol-mono.svg`        | Outlines only in `currentColor`, stroke about 9 on the 256 grid            | Monochrome places: notifications, print, embossing                                    |

## The tile

Start from [`brand/app-icon-template.svg`](../brand/app-icon-template.svg).

- **Tile:** 512 × 512, `rx="116"`. Vertical gradient `#FFF3F8` → `#FFD3E5`,
  the same for every UwU app.
- **Nyu:**
  - The app's shell from the catalogue, with the white die-cut edge.
  - Tilted -6° to -8°.
  - Centred a little below the middle, about 330 px wide (the guide circle).
  - Drop shadow `#C2306F` at 25 %: `dy 10`, blur 10.
- **Props:** two or three, from Nyu's palette: sparkles `#FFD66E`, a heart
  `#FF6FA6`, the app's thing (a phone, a key, a letter). Arrange them
  differently in every app so the icons stay apart at a glance:

| App       | Props                                                               |
| --------- | ------------------------------------------------------------------- |
| UwUMail   | Two sparkles top right and left, a heart                            |
| UwUMirror | A big star top right, a small one left, a heart bottom right        |
| UwUSuite  | A star top right, a small one left, a heart bottom right on the box |

Never put Nyu on a saturated pink tile, which reads as a telecom app. Never use
another tile colour, a photo, or text on the tile.

## Generating the platform files

In the Tauri app folder (it needs `@tauri-apps/cli`):

```sh
pnpm exec uwu-icons --brand ../../brand --name uwumirror --tray --mobile
```

| Source       | Output                                                                                                       |
| ------------ | ------------------------------------------------------------------------------------------------------------ |
| app icon     | `icon.icns`, `StoreLogo.png`, `Square{30…310}x…Logo.png`, and with `--mobile` the `android/` and `ios/` sets |
| taskbar icon | `icon.ico`, `icon.png`, `32x32.png`, `64x64.png`, `128x128.png`, `128x128@2x.png`                            |
| small cut    | the ICO's 16 and 24 px frames, and with `--tray` `tray.png` (32 px)                                          |

A missing taskbar or small file falls back to the next bigger one, with a
warning. Commit the generated files. CI does not regenerate them.

## Web

- Favicon: `<link rel="icon" type="image/svg+xml" href="/<app>-app-icon.svg">`.
- Web manifest: the app icon with `sizes: "any"`, `theme_color: "#ff4d8d"` and
  `background_color: "#fff7fb"`.
- Link previews (`og:image`) show Nyu on the tile gradient, 1200 × 630.
