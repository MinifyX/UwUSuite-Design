# Moving an app onto the package

UwUNotes is on the package (0.7.0, design 1.3.0); the other apps are not
yet. This is the order, app by app. One PR per app,
with no release of its own: the change ships with the app's next release.

## Steps for every app

1. **Add the dependency** in the app's `package.json`:
   `"@uwusuite/design": "https://github.com/MinifyX/UwUSuite-Design/releases/download/v1.12.0/uwusuite-design-1.12.0.tgz"`.
   After `pnpm install`, check that the package's entry in `pnpm-lock.yaml`
   keeps `tarball: https://github.com/…` in its `resolution`. pnpm 11 can
   rewrite it as `integrity` only when the URL changes; then a fresh install
   in CI asks the npm registry and fails with a 404.
2. **CSS:**
   - Replace the app's `tokens.css`, `fonts.css`, the base layer, the Nyu edge
     and blink CSS and the keyframes with
     `@import "tailwindcss"; @import "@uwusuite/design/tailwind.css";`. Add
     `font-picker.css` if the app has a font picker.
   - Delete the app's copy of `UwUSans[wght].woff2`.
   - Delete the app's `font-variant-ligatures: no-contextual` and `"calt"`
     rules that were there for UwU Sans's `:3`/`<3` ligatures. Since 1.1.0 the
     font has none; text that showed Nyu or a heart through them now shows
     `:3`/`<3`, so put U+E000 or U+2665 where the picture is wanted.
   - Remove `@fontsource-variable/*` from the app.
3. **Tokens that changed:**
   - Text in a state colour moves to `-ink`: `text-danger` → `text-danger-ink`,
     `text-success` → `text-success-ink`, `text-warning` → `text-warning-ink`.
   - Mirror and Lock `--uwu-online` → `--uwu-success-ink` (text) or
     `--uwu-success` (dot), and `--uwu-alarm` → `--uwu-warning-ink`.
   - Badges move to `bg-pink-solid text-on-pink`.
   - `--uwu-font` → `--font-ui`, `--uwu-tracking` → `--tracking-ui`.
4. **Settings:**
   - Theme, contrast and motion go through `useAppearance()`, and the inline
     script through `bootScript()`.
   - The font goes through `applyUiFont()`. `FONT_CHOICES` adds Manrope; keep
     an old stored value working with `isFontChoice` and fall back to `uwu`.
5. **Components:** replace `components/ui/*` with the package's components,
   including `Dialog` (`labelledBy` for a scene with its own heading),
   `SettingRow` (a function child gets `{ id, describedBy }`), `StatTile`,
   `ProgressBar` and `ResizeHandle`. What stays in the app, built from
   package parts and tokens:
   - Things that need the app's data or router: the logo from the brand store,
     sender pictures on `Avatar`/`AvatarBlob`, router tabs, `ThreadRow`.
   - Scenes and their words: confirmation dialogs with a Nyu scene, Nyu
     scenes, cameos and hats. The envelope Nyu on the 512 grid stays with the
     UwUMail apps, drawn with the package's `NYU` palette and `Sticker`.
   - Adapters: a toast store with the app's own effects (a countdown, the
     sent flyer) feeding the package `Toaster`, and a context menu that opens
     the controlled package `Menu` at the pointer.
   - Patterns of one app only, such as `ArmedButton`.
6. **Icons:**
   - Replace direct `lucide-react` imports and inline `Icon.tsx` path maps with
     `Icon` + `ICONS`.
   - An icon the vocabulary lacks goes into the package first.
7. **Nyu:**
   - Keep the app's scenes.
   - Take `Sticker`, `NyuFace`, `NyuEars`, the palette and `nyu.css` from the
     package.
   - Rename the logo hop class `animate-nyu-hop` to `nyu-logo-hop`.
8. **Window:** use `TitleBar` + `useTauriWindow()` with native macOS chrome.
   On macOS ([macos.md](macos.md)):
   - Move the title bar's actions into `setMacMenu()`; settings go to ⌘,.
   - `hideWindowOnClose()` and `RunEvent::Reopen`, so ⌘W keeps the app in the
     Dock.
   - The `uwu-macos` crate and `onMacQuit()`, so quitting saves first.
     UwUNotes has this already (`quit.rs`, `menu.rs`); it can move to the
     crate and `setMacMenu()` when it migrates.
   - Tooltips through `withShortcut()`.
9. **Icons script:** replace `scripts/icons.mjs` with
   `pnpm exec uwu-icons --brand ../../brand --name <app> [--tray] [--mobile]`,
   regenerate and commit the icons. The Dock icon shrinks into Apple's grid
   (UwUNotes has that since 0.6), and apps with a tray get `tray-template.png`
   for the macOS menu bar.
10. **Docs:** cut `docs/design.md` down to what is special about the app, and
    link here for the rest.

## Per app

| App                          | Today                                                                            | Notable work                                                                                                                                                                                                                                                                          |
| ---------------------------- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| UwUMirror                    | Manrope, own `Icon.tsx` (stroke 1.8), plain CSS, no Tailwind in desktop          | Add Tailwind v4, move to UwU Sans, move CSS classes to components. The stage stays (`stage-*` tokens). Good pilot: small app, its TitleBar is the model                                                                                                                               |
| UwUMail-Client               | UwU Sans + picker, lucide (stroke 2), Tailwind                                   | Closest to the package. Stroke 2 → 1.8 through `Icon`. Toast tokens. The font source has moved here: delete `brand/fonts/uwu-sans` after the switch. Its icon meanings are in `ICONS` since 1.6.0                                                                                     |
| UwUMail-Webmail              | UwU Sans, lucide, local copies of tokens and `components/ui`                     | Follow the client: `Icon` + `ICONS`, package components and CSS, the toast and context menu adapters. Keep the mail frame font injection                                                                                                                                              |
| UwUMail-Server web           | On the package (UwU Sans, `Card`, `Dialog`, `Icon`), a few local components left | Delete the local `Dialog`, `StatusDot`, `SettingRow`, `ProgressBar` and `StatTile`/`MeterBar` (`ProgressBar kind="usage"`), and the direct lucide imports (the portal meanings in [icons.md](icons.md)). Keeps `PageHeader`, `KeyValue`, `CopyButton`, router tabs and the brand logo |
| UwUNotes-Client              | Done: 0.7.0 on design 1.1, design 1.3.0 since PR #31                             | Keeps `code.css`, `--uwu-deep`, UwU Console and the Nyu notebook in the app. Its menu bar and quit guard (`menu.rs`, `quit.rs`) can move to `setMacMenu()` and `uwu-macos`                                                                                                            |
| UwULock-Client / Server web  | UwU Sans + picker, high contrast, spacing tokens                                 | These are the source of high contrast and spacing. Map `--uwu-text-*` (12.5/13/14 px) to the package scale. The browser extension bundles the font from the package. Its icon meanings are in `ICONS` since 1.4.0                                                                     |
| UwUSSH-Client, UwURDP-Client | Manrope, own icons, tokens copy                                                  | Terminal and remote area use the `stage-*` tokens. Keygen gets `TitleBar` too. Their icon meanings are in `ICONS` since 1.5.0; OsIcon (Nyu OS stickers) and the xterm ANSI palette stay in UwUSSH                                                                                     |
| UwUAuth-Server web           | Manrope                                                                          | Switch to UwU Sans and the package components                                                                                                                                                                                                                                         |
| UwUSuite-Website             | Own `site.css`, Manrope, `nyu.mjs`                                               | Take the Nyu catalogue from `@uwusuite/design/nyu-svg` and UwU Sans. The site keeps its own page CSS                                                                                                                                                                                  |

Suggested order: UwUMirror (pilot), UwUMail-Client and Webmail, UwUNotes,
UwULock, UwUSSH and UwURDP, the server web UIs, the website.
