# Icons

The base is **[Lucide](https://lucide.dev)** (`lucide-react`, a peer
dependency). What Lucide lacks, the suite draws itself by the same rules, in
[`src/icons/suite.ts`](../src/icons/suite.ts). Every icon goes through
`<Icon>`, and every meaning has exactly one icon in `ICONS`.

```tsx
import { Icon, ICONS, IconButton } from "@uwusuite/design";

<Icon icon={ICONS.settings} />                       // 16 px, stroke 1.8, aria-hidden
<Icon icon={ICONS.warning} size="xl" label="Achtung" /> // stands alone → has a name
<IconButton icon={ICONS.delete} label="Löschen" />   // label = name + tooltip
```

## Sizes and stroke

| Size | px  | Stroke | Use                                                  |
| ---- | --- | ------ | ---------------------------------------------------- |
| `xs` | 14  | 2      | In dense text, chips, badges                         |
| `sm` | 16  | 1.8    | Buttons, menu items, list rows, fields (**default**) |
| `md` | 18  | 1.8    | Icon buttons, navigation, title bar                  |
| `lg` | 20  | 1.8    | Touch toolbars, tabs with a device, card lead icons  |
| `xl` | 24  | 1.6    | Setting groups, a dialog's lead icon                 |

Small icons get a slightly heavier stroke so they don't thin out. Big ones get
a lighter stroke so they don't shout. Inside a filled `Button` the icon is
drawn at 2.2 so it holds up against the pink. Apps never pick their own stroke
width. A new need becomes a new size here.

## Vocabulary: one meaning, one icon

`ICONS` maps meanings to glyphs: `settings` is the gear, `delete` the bin,
`close` the cross, `more` the horizontal ellipsis, `back` the arrow left,
`refresh` the circular arrows, `ai` the sparkles, and so on. Apps import the
meaning, not a Lucide name, so a bin never means "close" in one app and a
cross never means "delete" in another. A test makes sure each glyph is used
for one meaning only.

The groups: navigation and structure, actions, files and editing (file,
folder, save, print, compare, replace, outline, bookmark, notebook, restore
from the bin, sidebar show/hide; from UwUNotes), state and feedback, settings
pages (with sound on/off), vault and secrets, remote access, sessions, mail, calendar and contacts, and the suite
icons below.

Vault and secrets (from UwULock): `vault` (all items), item kinds `website`,
`card`, `identity`, `note`, `sshKey`, `wifi`; `passkey` (the person with a
key), `securityKey` (a hardware key), `fingerprint` (host keys, known hosts),
`masterPassword` (asks for the master password again; `locked` stays the
state of a locked vault), `oneTimeCode` (TOTP), `generate` (the dice of a
generator), `maskedAddress`, `inbox` (file requests, incoming uploads),
`travelMode`, `securityCheck` (password health), `review` (go through a list
one by one), `reminder` (a due date the user set; `notifications` stays the
app's notifications), `organization`, `collection`, `qrCode`, `import` (take
something in as an item), `image`, `moveUp`/`moveDown` (reorder). Remote
access: `terminal` (SSH, snippets), `computer` (a desktop host, RDP),
`network` (the local network, a device on it).

Sessions and files on a host (from UwUSSH and UwURDP): `server` (a server
or a sync server, the remote side of a file browser), `connect` and
`disconnect` (open or end a session; plug and unplug), `tunnel` (SSH port
forwarding), `admin` (root or administrator rights, `sudo`), `keyboard` (send
keys, like Ctrl+Alt+Del), `fit` (fit a remote desktop into the window;
`fullscreen` stays fullscreen), `overview` (all open sessions as tiles;
`collection` stays a collection), `files` (a file browser, SFTP),
`parentFolder` (one level up), `drive` (a local disk, all drives),
`permissions` (file rights, chmod). Also `start`/`stop` (a tunnel, a
transfer), `export` (into a file; the counterpart of `import`), `signIn`
(the counterpart of `signOut`) and `work` (the work space; `home` is also the
private space and a home folder).

Mail, calendar and contacts (from UwUMail): `mail` (an e-mail, an address,
the mail section), `compose` (write a new mail, continue a draft), `reply`,
`replyAll`, `forward`, `drafts`, `allMailboxes` (the unified view), `unread`
(the read state: one icon for "mark read" and "mark unread", the label says
which way, like a toggle), `move` (into a folder), `label` (put a label on)
and `labels` (labels as a whole: settings, grouping, suggestions), `spam`,
`notSpam`, `spamCheck` (is this spam? also the "suspicious" verdict),
`block` (a sender or a domain), `attachment`, `signature`, `sendLater`,
`imagesBlocked` (remote images held back), `redirect` (a link that goes via
another address, Safe Links), `quote`, `rules` (mail rules), `select` and
`selectAll`, `automatic` (set by itself: rule labels, push mail), `offline`,
`verified` (the sender passed SPF/DKIM), `score` (a spam filter score).
Writing: `bold`, `italic`, `bulletList`, `addImage`, `insert` (put text into
the draft). The assistant: `summary`, `rewrite` (a style preset), `adjust`,
`proofread`, `localModel` (a model on this computer), `experimental`; `ai`
stays the sparkles. Calendar: `calendar`, `agenda`, `addEvent`, `findEvent`
(dates in a mail), `invitation`, `removeEvent`, `time` (when: a date and
time, a time zone), `repeat`, `location`, `description`, `videoCall`,
`comment`, `maybe` (neither yes nor no: a tentative answer). Contacts:
`contacts` (the contacts section, an address book), `contact` (one person's
card), `addContact`, `people` (several people: attendees, shared with, a
shared mailbox), `profile` (your own name and picture; `account` stays the
account), `phone`, `birthday`, `anniversary`, `celebration`, `camera`. Kinds
of files: `document`, `imageFile`, `codeFile`, `spreadsheet`, `audioFile`,
`videoFile`, `archiveFile` (`file` stays any other file). App settings:
`appearance`, `addons`, `layout`, `device` (this phone or computer, as
opposed to `server`), `loading` (a spinner that turns), `zoomIn`, `zoomOut`,
`mixed` (a check box where some are checked).

Close neighbours: `pending` (the clock) is waiting for something, `time` is
a point in time, `sendLater` is a mail that waits for its time, `history` is
the past ("first seen"). `share` is the action, `people` who it is shared
with. `delete` is also "empty the bin". `warning` covers security warnings
(an unconfirmed sender, a dangerous attachment); `spam` is only spam.

`secret` (the round key) is a password or a secret value. A key that is a
file or a format, like an SSH key, is `sshKey`.

Need a new meaning? Add it to `ICONS` (`src/icons/vocabulary.ts`) in this
package, not in the app.

## Suite icons

| Name           | Export        | For                                                                         |
| -------------- | ------------- | --------------------------------------------------------------------------- |
| `android`      | `Android`     | Android devices: the robot head in our stroke, not the logo                 |
| `paw`          | `Paw`         | Nyu settings, pets, easter eggs                                             |
| `nyu`          | `NyuFaceIcon` | Nyu as a line icon (menus, "about", mascot setting), the same cat as U+E000 |
| `hand-mirror`  | `HandMirror`  | UwUMirror in suite menus                                                    |
| `devices-sync` | `DevicesSync` | Sync between devices                                                        |
| `tunnel`       | `Tunnel`      | SSH tunnels (port forwarding): an arch over the ground line                 |

### Drawing a suite icon

1. Use the 24 × 24 grid with 2 px padding. Everything lies within 1…23, and
   the optical size matches Lucide's.
2. Use strokes only: `path`, `circle`, `ellipse`, `rect`, `line`, `polyline`.
   Round caps and joins come from `<Icon>`. Give rectangles `rx="2"`.
3. Set no `fill`, `stroke`, `stroke-width`, `style` or `transform` of its own,
   and no text.
4. Give every node a unique `key`.
5. Add it to `SUITE_ICON_NODES`, export it with `createLucideIcon`, and add a
   meaning to `ICONS`.
6. `pnpm lint` runs `scripts/check-icons.mjs`, which checks steps 1 to 4.

## Colour and state

- Always `currentColor`.
  - Quiet icons are `text-muted`, `text-ink` on hover, `text-pink-ink` when
    active (`IconButton active`).
  - State icons use the state's `-ink` colour: `text-success-ink`,
    `text-warning-ink`, `text-danger-ink`.
- Fills are only for a state: a starred star (`fill-pink`), a remembered heart.
  Never as decoration.

## Accessibility

- Decorative icons (next to text) are `aria-hidden`. `<Icon>` does that by
  default.
- An icon that stands alone gets a `label`. An icon-only button gets
  `IconButton label`, which becomes its name and tooltip.
- Hit targets are at least 32 px (`IconButton size="sm"`), 36 px by default.

## Don't

- Don't use a second icon set, emoji as icons, or icon fonts.
- Don't use Nyu as a control. Nyu is the brand: logo, scenes and app icons
  (see [nyu.md](nyu.md)). The `nyu` line icon is the only exception, for
  places that are about Nyu.
- Don't use other companies' logos as icons (Apple, Google, Microsoft). Name
  the thing instead ("iPhone", "Android") and use a neutral device icon.
- Don't use gradients, duotone or shadows in icons.

## Title bar and window controls

Title bar actions are 30 px round buttons with an 18 px icon (`md`). The window
controls are their own 10 × 10 glyphs at stroke 1, drawn by `TitleBar`. Don't
use Lucide icons for minimize, maximize and close (see
[window.md](window.md)).
