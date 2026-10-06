# Components

React 18.3 or 19, styled with Tailwind v4 through `tailwind.css`. They come
from UwUMail, plus the cards, setting rows, hints and status from UwUMirror.
All of them work with the keyboard, have names for screen readers and use no
raw colours.

| Component                         | What                                                                                | Notes                                                                                                                                                                                                                                                                          |
| --------------------------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `Button`                          | `primary` · `secondary` (default) · `ghost` · `danger`, `sm 32` · `md 40` · `lg 48` | Always a pill, `font-semibold`, press `scale(0.97)`. `busy` shows a spinner (or `busyIndicator`) and disables. `icon` takes a Lucide/suite icon. Wraps on phones instead of overflowing                                                                                        |
| `IconButton`                      | 36 px (`md`) or 32 px (`sm`), round                                                 | `label` is required: it is the name and the tooltip. `active` tints pink                                                                                                                                                                                                       |
| `Field`                           | Label above, control, then error or hint                                            | Render prop gets `(id, describedBy)`                                                                                                                                                                                                                                           |
| `TextInput`, `TextArea`, `Select` | 44 px, radius 10, `control` outline, pink focus ring                                | `aria-invalid` turns the border red                                                                                                                                                                                                                                            |
| `Switch`                          | The bare on/off switch, 44 × 24                                                     | `label` for screen readers when no visible label points at it                                                                                                                                                                                                                  |
| `Toggle`                          | A labelled setting with description and switch                                      |                                                                                                                                                                                                                                                                                |
| `Segmented`                       | 2–4 exclusive choices                                                               | Arrow keys move the choice. `disabled` for the whole control, `disabled` per option. High contrast outlines the choice                                                                                                                                                         |
| `Pill`                            | A filter that is on or off, with an optional `count`                                |                                                                                                                                                                                                                                                                                |
| `Badge`                           | Unread or pending count                                                             | Hidden at 0, `999+` cap, on `pink-solid`                                                                                                                                                                                                                                       |
| `Tag`                             | `neutral` · `pink` · `success` · `warning` · `danger`                               | "Beta", "Neu", "Offline"                                                                                                                                                                                                                                                       |
| `Card`                            | Surface on canvas, hairline, radius 16, no shadow                                   | `icon`, `title`, `subtitle`, `aside` (a switch)                                                                                                                                                                                                                                |
| `SettingRow`                      | One settings line: label and description left, control right                        |                                                                                                                                                                                                                                                                                |
| `Hint`                            | A short note: `info` · `warning` · `danger` · `success`                             |                                                                                                                                                                                                                                                                                |
| `StatusDot`, `StatusLine`         | `online` (mint) · `connecting` (pink pulse) · `offline` (grey) · `error` (amber)    | Always with text that says the same                                                                                                                                                                                                                                            |
| `Avatar`                          | Initials in one of six account colours, or a picture                                | `avatarColor(seed)` is stable per address                                                                                                                                                                                                                                      |
| `Menu`                            | Popup list of actions, `separator`, `{ heading }` sections, `danger`, icons         | Escape, outside click and arrow keys work. A `{ heading: "…" }` entry starts a labelled section (`role="group"`) up to the next heading. Long menus scroll (max `min(75vh, 520px)`); apps add no own max-height                                                                |
| `Dialog`                          | Native `<dialog>`: `sm 420` · `md 560` · `lg 860` · `viewer 1200`, radius 22        | `tone="warning"` for destructive questions, `footer` (primary last; on phones the buttons share the row and wrap). Full screen on phones (except `sm`), `held` while an app lock covers the window. Dialogs opened from inside another stack: Escape closes only the innermost |
| `Toaster` + `createToasts()`      | Bottom centre (top on phones), inverted                                             | 5 s info, 9 s error, at most 4, optional action                                                                                                                                                                                                                                |
| `Tooltip`                         | For inline text (names, addresses)                                                  | Buttons use their `title` instead                                                                                                                                                                                                                                              |
| `EmptyState`                      | Nyu scene, title, body, action                                                      | `compact` for dense places                                                                                                                                                                                                                                                     |
| `Wordmark`                        | Nyu + "UwU" in `pink-solid` + product, weight 800, -0.02em                          | `hop` number makes Nyu hop once                                                                                                                                                                                                                                                |
| `TitleBar`, `TitleBarAction`      | See [window.md](window.md)                                                          |                                                                                                                                                                                                                                                                                |

The component words (close, minimize, …) come from `UwuLabels`. German is the
default, `labels="en"` gives English, or pass your own.

## Shape, space, elevation

| Element                                   | Radius                    |
| ----------------------------------------- | ------------------------- |
| Buttons, pills, badges, switches, avatars | 999 px (pill)             |
| Inputs                                    | 10 px (`rounded-control`) |
| Cards, panes                              | 16 px (`rounded-card`)    |
| Menus, toasts, list rows                  | 16 px (`rounded-2xl`)     |
| Dialogs                                   | 22 px (`rounded-dialog`)  |
| Small chips, code                         | 8 px (`rounded-small`)    |

- **Space:** one 4 px scale (`--uwu-space-1…10`, Tailwind's spacing). A value
  that is not on it is a mistake.
- **Elevation:** shadows only for what floats: menus, dialogs, toasts,
  popovers (`shadow-float`). Primary buttons get `shadow-primary`. Cards have a
  hairline, never a shadow.
- **Focus:** `:focus-visible` gets a 3 px pink ring (`--uwu-focus`). Never
  remove it without a replacement. A primary button swaps its own shadow for
  the ring while focused (`focus-visible:shadow-focus`).

## Layout patterns

- **Canvas and cards:** grey-pink canvas, white surfaces on top. Lists are
  rounded rows with a small gap and no dividers. Hover tints `pink-tint/45`,
  selected is `pink-tint`.
- **Sidebar:**
  - Rows are 36 px, `rounded-xl` and `text-[13.5px]`. Active is
    `bg-pink-tint font-semibold text-pink-ink`.
  - Group titles are 12 px uppercase `text-muted`.
  - The sidebar is 240–264 px and becomes a drawer below 1024 px (web) or
    700 px (apps).
- **Settings:**
  - A dialog (`lg`) with a 170 px nav on the left (active is `pink-tint`) and
    `SettingRow`s on the right. The About page comes last.
  - Groups:
    - **Allgemein:** language, startup, log.
    - **Darstellung:** design, contrast, animations, font, tone.
    - Then app-specific groups.
- **Tabs:**
  - Top tabs for parallel things (streams, sessions). A tab has a device icon
    with a state dot, a title and a close button on hover.
  - Active tabs show a pink top inset (`inset 0 2px 0 var(--uwu-pink)`).
- **Phone:**
  - `phone:` means below 700 px.
  - Toasts move to the top and dialogs go full screen.
  - The sidebar slides in from the left (`animate-drawer`) and details from the
    right (`animate-screen-in`).
- **Selection:** desktop apps put `uwu-app` on `<body>`. Only inputs, content
  and `.selectable` can be selected.

## Writing a new component

Write it in this package first, from tokens and existing components. Then
check four things:

- It works with the keyboard.
- It has names for screen readers.
- It works in a phone layout.
- It works in dark, high contrast and reduced motion.

Add a styleguide example and a test. Release a minor version and bump the apps.
