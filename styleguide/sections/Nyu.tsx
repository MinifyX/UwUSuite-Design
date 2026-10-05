import { useState } from "react";
import { MOODS, Nyu, NYU, Segmented, SHELLS, type NyuMood } from "../../src";
import { keyScene, letterScene, serverScene } from "../../src/nyu/svg";
import { Panel, Rules, Section, Sub } from "./ui";

const SHELL_NAMES: Record<(typeof SHELLS)[number], string> = {
  box: "UwUSuite · Kiste",
  mail: "UwUMail · Umschlag",
  mirror: "UwUMirror · Handspiegel",
  page: "UwUNotes · Blatt",
  lock: "UwULock · Schloss",
  terminal: "UwUSSH · Terminal",
  monitor: "UwURDP · Monitor",
  badge: "UwUAuth · Ausweis",
};

const MOOD_NAMES: Record<NyuMood, string> = {
  uwu: "uwu",
  happy: "fröhlich",
  cheer: "jubelt",
  sparkle: "glitzert",
  sad: "traurig",
  puzzled: "verwirrt",
  sleepy: "müde",
};

export function NyuSection() {
  const [mood, setMood] = useState<NyuMood>("uwu");
  return (
    <Section
      id="nyu"
      title="Nyu"
      lead="Nyu ist die Katze der Suite. In jeder App steckt sie in einer anderen Hülle: Die Hülle ist das Ding der App, ihr Gesicht sitzt darauf. Augen, Mund und Wangen liegen in jeder Hülle an derselben Stelle, so passen alle sieben Stimmungen und alle Szenen."
    >
      <Panel className="flex flex-col gap-5">
        <Segmented
          label="Stimmung"
          value={mood}
          onChange={setMood}
          options={MOODS.map((value) => ({ value, label: MOOD_NAMES[value] }))}
          className="flex-wrap"
        />
        <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-5">
          {SHELLS.map((shell) => (
            <figure key={shell} className="flex flex-col items-center gap-2 text-center">
              <Nyu shell={shell} mood={mood} size={110} title={SHELL_NAMES[shell]} />
              <figcaption className="text-caption text-muted">{SHELL_NAMES[shell]}</figcaption>
            </figure>
          ))}
        </div>
      </Panel>
      <Sub title="Szenen">
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            serverScene({ label: "Nyu auf dem Server" }),
            keyScene({ label: "Nyu bewacht einen Schlüssel" }),
            letterScene({ label: "Nyu verschickt einen Brief" }),
          ].map((svg, index) => (
            <Panel key={index} className="grid place-items-center [&>span>svg]:h-[150px] [&>span>svg]:w-auto">
              <span className="nyu-host" dangerouslySetInnerHTML={{ __html: svg }} />
            </Panel>
          ))}
        </div>
      </Sub>
      <Sub title="Palette (feste Kunst, in beiden Designs gleich)">
        <div className="flex flex-wrap gap-2">
          {Object.entries(NYU).map(([name, value]) => (
            <span
              key={name}
              className="flex items-center gap-2 rounded-full border border-hairline bg-surface py-1 pr-3 pl-1"
            >
              <span className="size-6 rounded-full border border-hairline" style={{ background: value }} />
              <code className="text-[11.5px]">
                {name} {value}
              </code>
            </span>
          ))}
        </div>
      </Sub>
      <Rules
        items={[
          [true, "Sticker-Stil: Kontur Pflaume #4B1D3F, Körper #FF6FA6, helle Fläche #FFB8D3, weißer Stanzrand."],
          [
            true,
            "Neue App: eigene Hülle auf dem 256er Raster, darauf NyuFace und NyuEars. Danach kommt sie in den Katalog.",
          ],
          [
            true,
            "Nyu blinzelt, zuckt beim Hover mit den Ohren und hüpft bei echten Ereignissen. Bei „Animationen aus“ steht sie still.",
          ],
          [true, "Leere und Fehlerzustände zeigen eine Szene (320 × 220) mit 240 px Breite, kompakt mit 150 px."],
          [false, "Nyu nie umfärben, spiegeln, verzerren oder ohne Stanzrand auf dunklen Grund setzen."],
          [
            false,
            "Nyu nicht als Button-Icon, nicht in Aktionen, die Daten löschen, und nur im verspielten Ton mit Namen.",
          ],
        ]}
      />
    </Section>
  );
}
