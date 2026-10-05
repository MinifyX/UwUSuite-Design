<p align="center"><img src="brand/uwusuite-app-icon.svg" width="112" alt=""></p>

<h1 align="center">UwUSuite Design</h1>

<p align="center">One design for the whole UwUSuite: colours, type, icons, Nyu, app icons, components and tone.<br>
Live styleguide: <a href="https://uwu.minifyx.de/design/">uwu.minifyx.de/design</a></p>

`@uwusuite/design` turns UwUMail, UwUMirror, UwUNotes, UwULock, UwUSSH,
UwURDP, UwUAuth and the servers' web UIs into one family. It takes its design
from UwUMail, adds the stage, title bar and state colours from UwUMirror, and
the high-contrast theme from UwULock.

| What                                                                  | Where                                    | Rules                                                      |
| --------------------------------------------------------------------- | ---------------------------------------- | ---------------------------------------------------------- |
| Tokens (light, dark, high contrast), Tailwind v4 theme, base styles   | `src/css/`                               | [color](docs/color.md)                                     |
| UwU Sans (bundled, OFL) + JetBrains Mono, font picker                 | `fonts/`, `src/lib/fonts.ts`             | [typography](docs/typography.md)                           |
| `<Icon>`, the `ICONS` vocabulary (Lucide), suite icons                | `src/icons/`                             | [icons](docs/icons.md)                                     |
| App icon tile, template, `uwu-icons` generator                        | `brand/`, `bin/`                         | [app-icons](docs/app-icons.md)                             |
| Nyu: the catalogue of every app's shell, face kit, motion             | `src/nyu/`, `nyu.css`                    | [nyu](docs/nyu.md)                                         |
| React components (Button … Dialog, Toaster, TitleBar)                 | `src/components/`                        | [components](docs/components.md), [window](docs/window.md) |
| Motion tokens and keyframes                                           | `motion.css`                             | [motion](docs/motion.md)                                   |
| Tone of voice, copy, i18n                                             |                                          | [tone](docs/tone.md)                                       |
| Names, wordmark, licence                                              |                                          | [brand](docs/brand.md)                                     |
| macOS: menu bar, shortcuts, closing and quitting, Dock and tray icons | `src/tauri/`, `crates/uwu-macos`, `bin/` | [macos](docs/macos.md)                                     |
| Moving an app onto the package                                        |                                          | [migration](docs/migration.md)                             |

## Use it

```jsonc
// package.json: the release tarball, no registry needed
"@uwusuite/design": "https://github.com/MinifyX/UwUSuite-Design/releases/download/v1.2.0/uwusuite-design-1.2.0.tgz"
```

```css
/* the app's stylesheet */
@import "tailwindcss";
@import "@uwusuite/design/tailwind.css";
@import "@uwusuite/design/font-picker.css"; /* only with a font picker */
```

```tsx
import { Button, Icon, ICONS, Nyu, Wordmark, useAppearance, applyUiFont } from "@uwusuite/design";
import { useTauriWindow, setMacMenu, onMacQuit } from "@uwusuite/design/tauri";
import { nyuSvg } from "@uwusuite/design/nyu-svg"; // no React needed
```

- **Without Tailwind:** pages that write their own CSS against the tokens
  import `@uwusuite/design/plain.css`.
- **Peer dependencies:**
  - Required: React 18.3 or 19, `lucide-react` 1.x.
  - Optional: Tailwind 4 for the components, `@tauri-apps/api` 2 for
    `/tauri`.

## Develop

```sh
pnpm install
pnpm styleguide        # live styleguide on http://localhost:5173
pnpm lint && pnpm typecheck && pnpm test && pnpm build
cargo clippy --workspace --all-targets -- -D warnings && cargo test --workspace   # crates/uwu-macos
```

The tests check WCAG contrast for every token pair in all four themes, the
icon rules, the Nyu catalogue and the components. They run in about 3 seconds.

## Release

1. Bump `version` in `package.json` and in `Cargo.toml` (the crate and the
   `tag` in its comment; a test checks they match).
2. Add a `## <version>` section to `CHANGELOG.md`.
3. Run `pnpm release`. It runs the checks, then tags and pushes. The release
   workflow packs `uwusuite-design-<version>.tgz` and publishes it as a GitHub
   release.
4. Bump the URL in the apps.

The styleguide goes to the website with
`node scripts/publish-styleguide.mjs ../UwUSuite-Website` and the website's
deploy.

## Licence

| Part                                 | Licence                                             |
| ------------------------------------ | --------------------------------------------------- |
| Code                                 | MIT ([LICENSE](LICENSE))                            |
| UwU Sans                             | SIL OFL 1.1 ([fonts/OFL.txt](fonts/OFL.txt))        |
| Nyu, the app icons and the wordmarks | MinifyX's marks, see [docs/brand.md](docs/brand.md) |
