# UwUSuite-Design (@uwusuite/design)

The suite's design package: tokens (`src/css/tokens.css`), CSS parts (`src/css/*.css`), Tailwind theme, UwU Sans,
icons, React components, mobile patterns, Nyu, the website's sticker classes, the `uwu-icons` tool and the Rust crate
`uwu-macos`. The whole system is described in `DESIGN.md`; the German styleguide lives in `styleguide/`. Apps consume
the package as a release tarball URL; shared UI is changed here first, released, then bumped in the apps.

## Accessibility (required for every change)

Everything this package ships must let apps and pages meet **WCAG 2.2 AA** (7:1 for text in high contrast). Every new
or changed token, CSS class or component meets these rules before the commit:

- **Tokens only:** colours, radii, shadows and spacing come from `--uwu-*` tokens. No raw hex values in components or
  their CSS (`tests/tokens.test.ts` checks the components, `mobile.css` and `sticker.css`). A missing colour becomes a
  token in `tokens.css`, defined for light and dark, and for high contrast whenever the light value would not reach 7:1.
  Every colour token also gets a Tailwind name in `tailwind.css` (tested).
- **Contrast test for every new pair:** add each new text/background pair to `TEXT` and each mark/outline pair to
  `MARKS` in `tests/contrast.test.ts`. It runs in all four themes (light, dark, high-light, high-dark): text ≥4.5:1
  (≥7:1 in high contrast), marks and control outlines ≥3:1. Use tested pairs at full strength; opacity modifiers
  (`/60`) break the ratio.
- **Focus:** every interactive element shows the `--uwu-focus` ring (opaque 3 px, ≥3:1 on canvas, surface and
  elevated, tested). Never `outline: none` or `box-shadow: none` on `:focus-visible` without a replacement; check
  high-contrast overrides do not remove it.
- **Semantics and keyboard:** buttons are `<button>`, links `<a href>`; no click handlers on `div`/`span`. Everything
  works with Tab, Shift+Tab, Enter, Space, Esc and arrows where the pattern expects them; no keyboard traps. Icon-only
  buttons need a label, toggles `aria-pressed` or `aria-expanded`. Decorative icons and Nyu are `aria-hidden` / `alt=""`
  unless they carry meaning.
- **Target size:** at least 24×24 px (WCAG 2.5.8); the package's defaults are 32 px desktop minimum, 36 px default,
  44 px on touch.
- **Motion:** every animation and transition runs only under `prefers-reduced-motion: no-preference` and without
  `<html data-motion="reduced">`. Anything that moves for longer than 5 s can be paused (ticker: pause button with
  `aria-pressed`, pause on hover and focus). Copies that only exist for an animation loop are `aria-hidden="true"`. No
  flashing, no sound.
- **Not by colour alone:** status dots come with text; selected states get an outline in high contrast.
- **Reflow:** the styleguide has no horizontal scrolling at 375 px (and nothing ships that forces it at 320 px); text
  scales with `--uwu-type-scale`.
- **CSP-safe CSS:** classes must work under `script-src 'self'` and without inline styles. Dynamic values are custom
  properties set through CSSOM (`el.style.setProperty`), never `style` attributes or inline scripts. Vite builds use
  `assetsInlineLimit: 0` (no `data:` fonts).
- **No CDN fonts or assets:** fonts are bundled (`fonts/`, `@fontsource-variable/*`), never loaded from Google Fonts or
  any CDN; no hotlinked images.
- **Language:** the styleguide and user-facing labels are German; docs, comments and `DESIGN.md` are English.

How to check: `pnpm test` (contrast and token tests), `pnpm build:styleguide`, then axe-core via Playwright in Docker
(`mcr.microsoft.com/playwright`, light, dark and high contrast, 375 px and 1440 px, reduced motion) plus a keyboard
pass over the changed section. axe errors are blockers.

## Commands

- `pnpm lint` (eslint, prettier, icon check) · `pnpm typecheck` · `pnpm test` · `pnpm build`
- `pnpm styleguide` (dev server) · `pnpm build:styleguide` (to `dist-styleguide/`)
- Publish the styleguide to the website: `node scripts/publish-styleguide.mjs ../UwUSuite-Website`
- Rust: `cargo fmt --all --check` · `cargo clippy --workspace --all-targets --locked -- -D warnings` ·
  `cargo test --workspace --locked`
- Release: bump `package.json`, `Cargo.toml` (version and the tag in the line-2 comment) and `Cargo.lock`, add
  `## <version>` to `CHANGELOG.md`, then `pnpm release` (tags after the checks).
