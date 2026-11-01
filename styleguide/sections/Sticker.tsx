import { useState, type CSSProperties } from "react";
import { Nyu } from "../../src";
import { Code, Panel, Rules, Section, Sub } from "./ui";

/** The sticker sheet's small stickers: app icon, place on the sheet, tilt. */
const STICKERS: [app: string, place: string, tilt: string][] = [
  ["uwumail", "left-[6%] top-[7%] w-[21%]", "-9deg"],
  ["uwulock", "right-[6%] top-[9%] w-[19%]", "8deg"],
  ["uwussh", "bottom-[9%] left-[5%] w-[20%]", "7deg"],
  ["uwunotes", "right-[7%] bottom-[7%] w-[22%]", "-6deg"],
  ["uwurdp", "bottom-[4%] left-[41%] w-[16%]", "-3deg"],
];

const TICKER = [
  "UwUMail 0.23 · Server",
  "UwULock 0.6.0-beta.8 · Client",
  "UwUNotes 0.7.2",
  "UwUSSH 0.3.0-beta.4",
  "UwUSuite Design 1.10.0",
];

/** Every class with what it is for. */
const CLASSES: [name: string, use: string][] = [
  [
    ".uwu-dotgrid",
    "Hintergrund der ganzen Seite: Punktraster (22 px) auf canvas. Schneidet seitlich ab, was gekippte Teile überstehen lassen.",
  ],
  [
    ".uwu-sheet",
    "Stickerbogen für den Hero: surface-Karte mit gestrichelter Stanzlinie. Kinder legt die Seite selbst absolut darauf.",
  ],
  [
    ".uwu-sticker",
    "Um ein img oder svg: weißer Stanzrand und Schatten, gekippt um --tilt (Standard 4°). Wird bei Hover und Fokus gerade.",
  ],
  [".uwu-sticker--l", "Kippt in die andere Richtung (negativ). Für Paare, die nicht gleich schief stehen sollen."],
  [".uwu-tape", "Gelbes Klebeband, nur für Ticker. data-paused hält es an, Hover und Fokus ebenso."],
  [".uwu-tape__window", "Der sichtbare Ausschnitt des Bands: schneidet ab und blendet die Enden aus."],
  [
    ".uwu-tape__track",
    "Die Zeile, die läuft. Enthält die Einträge zweimal, die Kopie mit aria-hidden. Ohne Bewegung eine feste Liste.",
  ],
  [".uwu-chip", "Kleine Pille in Mono: Version, Plattform, Datum."],
  [".uwu-chip--beta", "Für Betas und Vorschauen, pink getönt."],
  [".uwu-chip--new", "Für „Neu“ auf pink-solid. Höchstens einer pro Karte."],
  [".uwu-fact", "Große Faktenpille im Hero: <b>Zahl</b> und Wort."],
  [".uwu-tilt", "Karte in einem Raster, kippt abwechselnd ±0,7°, gerade bei Hover und Fokus."],
  [".uwu-mark", "Textmarker in Überschrift oder Fließtext, ein bis drei Wörter."],
  [".uwu-hop", "Lässt ein .nyu darin einmal hüpfen. Klasse setzen, bei animationend wieder entfernen."],
];

/** React sets these through CSSOM (style.setProperty), so they pass a strict CSP. */
const tilt = (value: string) => ({ "--tilt": value }) as CSSProperties;

export function Sticker() {
  const [paused, setPaused] = useState(false);
  const [hop, setHop] = useState(false);
  return (
    <Section
      id="stickerbogen"
      title="Stickerbogen"
      lead="Der Look der Website und anderer Werbeseiten: ein Punktraster als Unterlage, Nyu und die App-Icons als Sticker auf einem Bogen, ein gelbes Klebeband für Neuigkeiten. Nur für Marketingseiten, nie in einer App. Alles ist reines CSS (sticker.css) und läuft unter einer strengen CSP."
    >
      <div className="uwu-dotgrid flex flex-col gap-10 rounded-card border border-hairline px-4 py-8 sm:px-8">
        <div className="grid items-center gap-8 md:grid-cols-[1.05fr_0.95fr]">
          <div className="flex flex-col gap-5">
            <p className="text-[clamp(30px,5vw,48px)] leading-[1.08] font-extrabold tracking-[-0.03em] text-balance">
              Kleine Apps, die ich <mark className="uwu-mark">für mich</mark> baue.
            </p>
            <ul className="flex flex-wrap gap-2.5">
              <li className="uwu-fact">
                <b>11</b> Programme
              </li>
              <li className="uwu-fact">
                <b>0</b> Telemetrie
              </li>
              <li className="uwu-fact">
                <b>1</b> Katze
              </li>
            </ul>
          </div>
          <div className="uwu-sheet aspect-[1/0.92] w-full max-w-[460px] justify-self-center">
            {STICKERS.map(([app, place, angle]) => (
              <span key={app} className={`uwu-sticker absolute ${place}`} style={tilt(angle)}>
                <img src={`./apps/${app}-app-icon.svg`} alt="" />
              </span>
            ))}
            <button
              type="button"
              aria-label="Nyu streicheln"
              className={`uwu-sticker absolute top-[16%] left-[25%] w-[50%] cursor-pointer rounded-full ${hop ? "uwu-hop" : ""}`}
              style={tilt("0deg")}
              onClick={() => setHop(true)}
              onAnimationEnd={() => setHop(false)}
            >
              <Nyu shell="box" mood="happy" size="auto" title="" className="w-full [&>svg]:h-auto [&>svg]:w-full" />
            </button>
          </div>
        </div>

        <section className="uwu-tape" data-paused={paused || undefined} aria-labelledby="sg-tape-h">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-2.5">
            <h3 id="sg-tape-h" className="text-[15px] font-extrabold whitespace-nowrap">
              Frisch erschienen
            </h3>
            <div className="uwu-tape__window">
              <ul className="uwu-tape__track font-semibold">
                {[false, true].flatMap((copy) =>
                  TICKER.map((item) => (
                    <li key={`${copy}${item}`} aria-hidden={copy || undefined}>
                      ✦ {item}
                    </li>
                  )),
                )}
              </ul>
            </div>
            <button
              type="button"
              aria-pressed={paused}
              onClick={() => setPaused((value) => !value)}
              className="min-h-9 cursor-pointer rounded-full border-2 border-current px-3 text-meta font-semibold"
            >
              Anhalten
            </button>
          </div>
        </section>

        <ul className="grid gap-5 sm:grid-cols-3">
          {[
            ["UwUMail", "Mail, Kalender, Kontakte.", "0.23", ""],
            ["UwULock", "Passwörter mit Ende-zu-Ende.", "0.6.0-beta.8", "beta"],
            ["UwUNotes", "Notizen in Markdown.", "0.7.2", "new"],
          ].map(([name, text, version, kind]) => (
            <li
              key={name}
              className="uwu-tilt flex flex-col gap-2 rounded-[22px] border border-hairline bg-surface p-5"
            >
              <h3 className="text-[19px] font-extrabold">{name}</h3>
              <p className="text-meta text-muted">{text}</p>
              <span className="flex flex-wrap gap-2">
                <span className="uwu-chip">{version}</span>
                {kind === "beta" && <span className="uwu-chip uwu-chip--beta">Beta</span>}
                {kind === "new" && <span className="uwu-chip uwu-chip--new">Neu</span>}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <Sub title="Klassen">
        <dl className="grid divide-y divide-hairline rounded-card border border-hairline bg-surface">
          {CLASSES.map(([name, use]) => (
            <div key={name} className="grid gap-1 px-5 py-3 text-meta sm:grid-cols-[180px_1fr] sm:gap-6">
              <dt>
                <code className="font-semibold">{name}</code>
              </dt>
              <dd>{use}</dd>
            </div>
          ))}
        </dl>
      </Sub>

      <Sub title="Tokens">
        <Panel className="flex flex-wrap gap-3 text-meta">
          <span className="rounded-full bg-tape px-3 py-1 font-semibold text-tape-ink">
            --uwu-tape / --uwu-tape-ink
          </span>
          <span className="rounded-full border border-line px-3 py-1">--uwu-dot</span>
          <span className="rounded-full border border-line px-3 py-1">--uwu-sticker-edge</span>
          <span className="rounded-full border border-line px-3 py-1">--uwu-sticker-shadow</span>
          <span className="rounded-full border border-line px-3 py-1">--uwu-tilt-sm 0,7° · --uwu-tilt-md 4°</span>
        </Panel>
      </Sub>

      <Sub title="Einbinden">
        <Code>{`/* Ohne Tailwind (Website): Tokens, Schrift und die Sticker-Klassen */
@import "@uwusuite/design/tokens.css";
@import "@uwusuite/design/fonts.css";
@import "@uwusuite/design/sticker.css";

<section class="uwu-tape" aria-labelledby="t">
  <h2 id="t">Frisch erschienen</h2>
  <div class="uwu-tape__window">
    <ul class="uwu-tape__track">
      <li>UwUMail 0.23</li> …
      <li aria-hidden="true">UwUMail 0.23</li> …   <!-- Kopie für die Schleife -->
    </ul>
  </div>
  <button type="button" aria-pressed="false">Anhalten</button>  <!-- setzt data-paused -->
</section>

// Kippen nur per CSSOM, nie per style-Attribut (CSP):
sticker.style.setProperty("--tilt", "-9deg");`}</Code>
      </Sub>

      <Rules
        items={[
          [true, "Nur auf der Website und Werbeseiten. Apps bleiben gerade und ruhig."],
          [true, "Sticker höchstens 10° gekippt, Karten 0,7°. Text auf Stickern bleibt gerade."],
          [true, "Klebeband nur für Ticker und höchstens einmal pro Seite. Anhalten-Knopf mit aria-pressed."],
          [
            true,
            "Bewegung nur bei prefers-reduced-motion: no-preference; sonst steht alles, das Band wird eine Liste.",
          ],
          [
            false,
            "Keine gekippten Überschriften, Formulare oder Knöpfe. Nichts, was man lesen oder treffen muss, steht schief.",
          ],
          [false, "Kein --tilt per style-Attribut und keine Inline-Skripte: Die Website hat script-src 'self'."],
        ]}
      />
    </Section>
  );
}
