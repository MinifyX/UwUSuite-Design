# Motion

Motion is short and soft, with a little spring. It explains where something
comes from. It is never the point, and it can always be turned off.

## Tokens

| Token                   | Value                               | Use                                             |
| ----------------------- | ----------------------------------- | ----------------------------------------------- |
| `--uwu-duration-fast`   | 150 ms                              | Colour changes, hover, buttons (`duration-150`) |
| `--uwu-duration-base`   | 200 ms                              | Switches, avatars fading in                     |
| `--uwu-duration-enter`  | 220 ms                              | Things coming in (toast, drawer)                |
| `--uwu-duration-count`  | 600ms                               | Numbers counting up, bars filling               |
| `--uwu-duration-reveal` | 480ms                               | The circle reveal                               |
| `--uwu-stagger-step`    | 40ms                                | Delay between staggered cards (max. 8 steps)    |
| `--uwu-ease-out`        | `cubic-bezier(0.2, 0.9, 0.3, 1)`    | Default                                         |
| `--uwu-ease-pop`        | `cubic-bezier(0.2, 0.9, 0.3, 1.3)`  | Popups with a little overshoot                  |
| `--uwu-ease-spring`     | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Website, installer, Nyu                         |

## Animations (Tailwind)

| Utility              | Keyframes                                 | Use                                               |
| -------------------- | ----------------------------------------- | ------------------------------------------------- |
| `animate-pop`        | `uwu-pop` 180 ms, scale 0.94 → 1 and fade | Menus, dialogs (`open:animate-pop`), empty states |
| `animate-slide-up`   | `uwu-slide-up` 220 ms, 12 px              | Toasts                                            |
| `animate-fade`       | `uwu-fade` 160 ms                         | Cross-fades                                       |
| `animate-drawer`     | `uwu-drawer` 220 ms                       | Phone sidebar from the left                       |
| `animate-screen-in`  | `uwu-screen-in` 220 ms                    | Phone detail screen from the right                |
| `animate-wiggle`     | `uwu-wiggle` 600 ms, ±6°                  | "Something's missing here"                        |
| `animate-pulse-soft` | `uwu-pulse` 1 s                           | Connecting dots                                   |
| `animate-spin`       |                                           | Spinners                                          |

Pressed buttons use `active:scale-[0.97]`. For Nyu's motion, see
[nyu.md](nyu.md).

## Page and dashboard motion (1.15)

Four effects that make an app feel alive without getting in the way. All of them are static
under reduced motion and never delay input.

| Effect            | How                                                                                                                                                                                                                                                                                          | Where                                                                    |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| Circle reveal     | `revealFrom(target, origin?)`: `target` is uncovered by a circle growing from `origin` (an element, a point, or the first `[data-uwu-reveal-origin]`), over `--uwu-reveal-backdrop`.                                                                                                         | Once: app start, after unlocking, after signing in. Never on every page. |
| Count-up and fill | `StatTile` with a numeric `value` (optional `format`) counts up via `CountUp`; `ProgressBar` fills from 0 the first time. Changes animate from the old value. Screen readers get only the final value.                                                                                       | Overviews, quotas, dashboards.                                           |
| Page change       | Give the element that changes per page `key={route}` and `className="uwu-page"` (fade); put `uwu-stagger` on a grid or list so its children come in one after the other.                                                                                                                     | Main content area. Not lists that page or scroll.                        |
| Sliding pill      | Put `<NavIndicator />` inside the nav. It finds the row with `aria-current` or `aria-selected="true"`, draws the active background as one pill and slides it. The rows' own active background goes transparent while it is there; text colour, weight and high-contrast outline stay theirs. | Sidebars, rails, header navs, segmented tabs.                            |

## Reduced motion

Darstellung → Animationen: System · An · Aus resolves against
`prefers-reduced-motion` into `<html data-motion="full|reduced">`. With
`reduced`:

- every animation and transition collapses to 1 ms and runs once (`base.css`),
- Nyu holds still and the flying Nyu is hidden (`nyu.css`),
- smooth scrolling is off.

## Don't

- Don't hop on every sync, and don't run endless loops outside Nyu scenes and
  "connecting" dots.
- Don't make anything wait for an animation before it accepts input.
- Don't use durations outside the tokens, or an animation that `data-motion`
  doesn't turn off.
