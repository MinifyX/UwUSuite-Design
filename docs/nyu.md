# Nyu

Nyu is the suite's cat. In every app she is the app's thing, and the thing is
her body (the shell). Her face sits on it: UwU eyes, a `w` mouth and blush.
The ears poke out on top.

| Shell      | App       |                                                          |
| ---------- | --------- | -------------------------------------------------------- |
| `box`      | UwUSuite  | Peeks out of a cardboard box, paws on the edge           |
| `mail`     | UwUMail   | Envelope, the flap is the face (512 grid)                |
| `mirror`   | UwUMirror | Hand mirror, a mint gem on top, a shine across the glass |
| `page`     | UwUNotes  | A sheet with a folded corner and a blinking cursor       |
| `lock`     | UwULock   | Padlock                                                  |
| `terminal` | UwUSSH    | Terminal window with three dots                          |
| `monitor`  | UwURDP    | Monitor with a power light                               |
| `badge`    | UwUAuth   | ID badge on a lanyard                                    |

The catalogue is [`src/nyu/svg.ts`](../src/nyu/svg.ts)
(`@uwusuite/design/nyu-svg`). It works without React, so the website,
installers and build scripts can draw Nyu too. In React, use `<Nyu>`:

```tsx
<Nyu shell="mirror" mood="happy" size={96} />
<Nyu shell="mail" size="1.3em" title="" blink={false} />   // next to the wordmark
```

## Sticker style

| Part                | Colour                            |
| ------------------- | --------------------------------- |
| Outline (plum)      | `#4B1D3F`                         |
| Body                | `#FF6FA6`                         |
| Light face or glass | `#FFB8D3`                         |
| Blush               | `#FF4D8D` at 50 %                 |
| Die-cut edge        | white                             |
| Props: star         | `#FFD66E`                         |
| Props: tear         | `#9ED8FF`                         |
| Props: lilac        | `#CDB8FF`                         |
| Props: mint         | `#B9F0D0`                         |
| Props: sky          | `#BDE6FF`                         |
| Props: kraft        | `#F2C58F` / `#F8DDB8` / `#E3AE6F` |

- **Grid:** the 256 grid, with outlines 9 on the body, 7 to 8 inside, and an
  edge of 20. UwUMail's envelope uses the 512 grid, with outlines 14 and an
  edge of 44.
- **Edge:** `Sticker` draws its children twice, first in white at the edge
  width (`.nyu-edge`, from `nyu.css`), then as they are. Parts with
  `class="no-edge"` (blush, shine, small lights) get no edge.
- **Theme:** the colours are fixed artwork, `NYU` in the catalogue. They are
  the same in dark mode, where the white edge keeps the outlines readable on
  dark ground.

## Moods

| Mood      | Name     | When                                           |
| --------- | -------- | ---------------------------------------------- |
| `uwu`     | uwu      | Default, idle                                  |
| `happy`   | fröhlich | Something worked, welcome                      |
| `cheer`   | jubelt   | Done, set up, sent                             |
| `sparkle` | glitzert | New, AI, a nice surprise                       |
| `sad`     | traurig  | Failed, offline                                |
| `puzzled` | verwirrt | Not found, unknown (no blush)                  |
| `sleepy`  | müde     | Empty, late at night, waiting (does not blink) |

## A new app's Nyu

1. Draw the shell on the 256 grid: the body between about 28–228 × 56–228,
   with the ears from `NyuEars` behind it.
2. Put `<NyuFace mood={mood} />` on top. Eyes sit at y 148 (x 102 and 154), the
   mouth at 128/170 and the blush at 74/182 × 168. Use `dy` to move the face if
   the body sits higher (the box uses -46).
3. Wrap it all in `<Sticker edge={20}>`.
4. Add the shell to the catalogue (`svg.ts`: figure, `VIEWBOX`, `SHELLS`) and
   to the website. Make the five brand files from it (see
   [app-icons.md](app-icons.md)).

## Scenes

Empty, error and onboarding states show a scene: 320 × 220, Nyu at 0.4 to 0.6
scale with props.

- `EmptyState` shows the scene at 240 px, or at 150 px with `compact`
  (sidebars, dialogs, dense layouts).
- Each app keeps its own scenes (`scenes.tsx`): welcome, empty, nothing found,
  offline, load error, done, puzzled, goodbye, sleepy. They use the catalogue's
  helpers and `nyu.css` classes.

## Motion

| Class                                                                                                          | Motion                                                      |
| -------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| `nyu-blink`                                                                                                    | Blinks every 5 s                                            |
| `.nyu-host:hover`                                                                                              | The ears twitch, 480 ms                                     |
| `nyu-logo-hop`                                                                                                 | One hop, 560 ms, for a real event: new mail, not every sync |
| `nyu-flyer`                                                                                                    | Flies off the "sent" toast, 1.1 s                           |
| `nyu-bob`, `nyu-hop`, `nyu-walk`, `nyu-plug`, `nyu-twinkle`, `nyu-cable`, `nyu-zzz`, `nyu-waves`, `nyu-cursor` | Scene loops                                                 |
| `nyu-think-bob`, `nyu-thinking`, `nyu-think-dot`                                                               | Thinking while the AI works                                 |

With `data-motion="reduced"` Nyu holds still and the flyer is hidden.

## Name and tone

- Nyu appears by name only in the playful tone ("Hi! Ich bin Nyu"). The neutral
  tone keeps the pictures and says the app's name.
- A server admin may turn the mascot off (UwUMail branding). Then there is no
  cat, no kaomoji, and the logo becomes the app's line icon in `text-pink`.

## Don't

- Don't recolour, mirror, squash or crop Nyu, or put her on dark ground without
  the edge.
- Don't use Nyu as a button or in actions that delete data. Nyu is never sad
  about something the person did.
- Don't add a second mascot or a "real" cat photo.
