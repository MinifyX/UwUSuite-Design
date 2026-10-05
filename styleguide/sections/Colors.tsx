import { useEffect, useState } from "react";
import { Rules, Section, Sub } from "./ui";

type Swatch = [token: string, use: string];

const GROUPS: [string, Swatch[]][] = [
  [
    "Flächen und Text",
    [
      ["--uwu-canvas", "Hintergrund der App"],
      ["--uwu-surface", "Karten, Listen, Leser, Dialoge"],
      ["--uwu-elevated", "Hover, Popover, Hinweise"],
      ["--uwu-ink", "Text"],
      ["--uwu-muted", "Zweiter Text, Labels, Icons"],
      ["--uwu-faint", "Platzhalter, Gruppentitel"],
      ["--uwu-hairline", "Trennlinien, Kartenrand"],
      ["--uwu-border", "Rand von Buttons und Menüs"],
      ["--uwu-control", "Rand von Eingaben (3:1)"],
    ],
  ],
  [
    "Marke: zwei Pinks",
    [
      ["--uwu-pink", "Marke: Punkte, Auswahl, Fokus, Logo"],
      ["--uwu-pink-solid", "Gefüllte Buttons mit Text, Badges, „UwU“"],
      ["--uwu-pink-solid-hover", "Hover darauf"],
      ["--uwu-on-pink", "Text auf pink-solid"],
      ["--uwu-pink-ink", "Pinker Text auf Tönung"],
      ["--uwu-pink-tint", "Aktive Zeile, gewählte Pille"],
      ["--uwu-pink-tint-strong", "Gedrückt, Textauswahl"],
    ],
  ],
  [
    "Zustände",
    [
      ["--uwu-success", "Bereit, live, erledigt (Punkte, Icons)"],
      ["--uwu-success-ink", "… als Text"],
      ["--uwu-warning", "Braucht Aufmerksamkeit"],
      ["--uwu-warning-ink", "… als Text"],
      ["--uwu-danger", "Fehler, Löschen"],
      ["--uwu-danger-ink", "… als Text"],
      ["--uwu-offline", "Aus, nicht verbunden"],
    ],
  ],
  [
    "Konten und Personen",
    [
      ["--uwu-account-pink", "Pink"],
      ["--uwu-account-violet", "Violett"],
      ["--uwu-account-sky", "Himmel"],
      ["--uwu-account-mint", "Minze"],
      ["--uwu-account-amber", "Bernstein"],
      ["--uwu-account-coral", "Koralle"],
    ],
  ],
  [
    "Bühne (immer dunkel)",
    [
      ["--uwu-stage", "Gespiegelter Bildschirm, Remote-Desktop, Terminal"],
      ["--uwu-stage-ink", "Text darauf"],
      ["--uwu-stage-muted", "Leiser Text darauf"],
    ],
  ],
  [
    "Kunst (fest, nie umgefärbt)",
    [
      ["--uwu-tile-from", "Kachel oben"],
      ["--uwu-tile-to", "Kachel unten"],
      ["--uwu-plum", "Nyus Kontur, Installer-Text"],
    ],
  ],
];

function useTokenValues(deps: unknown) {
  const [values, setValues] = useState<Record<string, string>>({});
  useEffect(() => {
    const read = () => {
      const style = getComputedStyle(document.documentElement);
      const next: Record<string, string> = {};
      for (const [, swatches] of GROUPS)
        for (const [token] of swatches) next[token] = style.getPropertyValue(token).trim();
      setValues(next);
    };
    read();
    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme", "data-contrast"] });
    return () => observer.disconnect();
  }, [deps]);
  return values;
}

function luminance(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  const channel = (v: number) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel((n >> 16) & 255) + 0.7152 * channel((n >> 8) & 255) + 0.0722 * channel(n & 255);
}

/** The build minifies #ffffff to #fff; widen it again. */
function hex(value?: string) {
  if (!value) return null;
  if (/^#[0-9a-f]{3}$/i.test(value)) return "#" + [...value.slice(1)].map((c) => c + c).join("");
  return /^#[0-9a-f]{6}$/i.test(value) ? value : null;
}

function ratio(x?: string, y?: string) {
  const a = hex(x);
  const b = hex(y);
  if (!a || !b) return null;
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
}

const PAIRS: [string, string, string][] = [
  ["--uwu-ink", "--uwu-canvas", "Text"],
  ["--uwu-muted", "--uwu-surface", "Zweiter Text"],
  ["--uwu-on-pink", "--uwu-pink-solid", "Primärer Button"],
  ["--uwu-on-pink", "--uwu-pink", "Weiß auf Marken-Pink"],
  ["--uwu-pink-ink", "--uwu-pink-tint", "Aktive Zeile"],
  ["--uwu-success-ink", "--uwu-surface", "„Bereit“"],
  ["--uwu-warning-ink", "--uwu-surface", "Hinweis"],
  ["--uwu-danger-ink", "--uwu-surface", "Fehler"],
];

export function Colors() {
  const values = useTokenValues(null);
  return (
    <Section
      id="farben"
      title="Farben"
      lead="Alle Farben sind Tokens in tokens.css. Komponenten benutzen nie Hex-Werte. Ein Pink trägt die Marke, Zustände haben eigene Farben, und jede Textfarbe besteht WCAG AA. Ein Test prüft das bei jedem Build. Schalte oben auf Dunkel oder hohen Kontrast: Die Werte hier lesen live mit."
    >
      {GROUPS.map(([title, swatches]) => (
        <Sub key={title} title={title}>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(210px,1fr))] gap-3">
            {swatches.map(([token, use]) => (
              <div
                key={token}
                className="flex items-center gap-3 rounded-control border border-hairline bg-surface p-2.5"
              >
                <span
                  className="size-11 shrink-0 rounded-[10px] border border-hairline"
                  style={{ background: `var(${token})` }}
                />
                <span className="flex min-w-0 flex-col">
                  <code className="truncate text-[11.5px] font-semibold">{token.replace("--uwu-", "")}</code>
                  <span className="uwu-mono text-[11px] text-muted">{values[token]}</span>
                  <span className="text-[11.5px] text-muted">{use}</span>
                </span>
              </div>
            ))}
          </div>
        </Sub>
      ))}
      <Sub title="Kontrast, live gemessen">
        <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-3">
          {PAIRS.map(([fg, bg, label]) => {
            const value = ratio(values[fg], values[bg]);
            const ok = value !== null && value >= 4.5;
            return (
              <div
                key={label}
                className="flex items-center justify-between gap-3 rounded-control border border-hairline p-3"
                style={{ background: `var(${bg})`, color: `var(${fg})` }}
              >
                <span className="text-body font-semibold">{label}</span>
                <span className="rounded-full bg-surface px-2 py-0.5 text-caption font-bold text-ink tabular-nums">
                  {value ? `${value.toFixed(1)} : 1 ${ok ? "✓" : "✗"}` : "–"}
                </span>
              </div>
            );
          })}
        </div>
      </Sub>
      <Rules
        items={[
          [true, "Text mit Pink-Füllung immer auf pink-solid. Das Marken-Pink schafft mit weißem Text nur 3,1 : 1."],
          [true, "Text in einer Zustandsfarbe nimmt die -ink-Variante, Punkte und Icons die einfache."],
          [true, "Pink heißt „ausgewählt“ oder „Fokus“. „Online“ und „fertig“ sind Minze, „Achtung“ ist Bernstein."],
          [true, "Bühnen (Spiegelbild, Remote-Desktop, Terminal) bleiben in beiden Designs dunkel."],
          [false, "Kein Pink für „online“, „ok“ oder Erfolg, keine zweite Akzentfarbe neben Pink."],
          [false, "Nyu, die App-Kachel und Installer werden nie umgefärbt, auch nicht im dunklen Design."],
        ]}
      />
    </Section>
  );
}
