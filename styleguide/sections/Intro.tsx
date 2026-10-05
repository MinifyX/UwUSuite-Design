import { Nyu } from "../../src";
import { Code, Rules, Section } from "./ui";

export function Intro() {
  return (
    <>
      <div className="flex flex-col items-start gap-6 rounded-[28px] border border-hairline bg-gradient-to-b from-[var(--uwu-tile-from)] to-[var(--uwu-tile-to)] p-8 text-[var(--uwu-plum)] sm:flex-row sm:items-center">
        <Nyu shell="box" mood="happy" size={150} title="Nyu in der UwUSuite-Kiste" />
        <div className="flex flex-col gap-3">
          <h1 className="text-[36px] leading-tight font-extrabold tracking-[-0.02em]">
            Ein Design für die ganze UwUSuite
          </h1>
          <p className="max-w-[620px] text-reading">
            Hell, weich und aufgeräumt, mit einem Augenzwinkern. Große runde Karten, feine Linien, Pillen, viel Luft und
            ein selbstbewusstes Bubblegum-Pink. Dieses Paket macht aus UwUMail, UwUMirror und allen anderen Apps eine
            Familie: dieselben Farben, dieselbe Schrift, dieselben Icons, dieselbe Katze.
          </p>
        </div>
      </div>
      <Section
        id="grundsaetze"
        title="Grundsätze"
        lead="Sechs Sätze, an denen sich jede Entscheidung messen lässt. Im Zweifel gewinnt der obere."
      >
        <ol className="grid gap-3 sm:grid-cols-2">
          {[
            [
              "Information zuerst.",
              "Was passiert ist und was jetzt zu tun ist, steht immer da. Der Witz kommt dazu, nie stattdessen.",
            ],
            [
              "Niedlich, nicht kindisch.",
              "Nyu, Pastell und Kaomoji ja, aber Abläufe, Wörter und Abstände sind so ernsthaft wie in jeder Profi-App.",
            ],
            [
              "Einfach zuerst, mächtig auf Wunsch.",
              "Die erste Ansicht reicht für die meisten. Mehr gibt es eine Ebene tiefer, nie im Weg.",
            ],
            [
              "Lesbar für alle.",
              "WCAG AA in jedem Design, AAA im hohen Kontrast. Tastatur überall, Bewegung abschaltbar.",
            ],
            [
              "Eine Familie.",
              "Neue Apps erfinden nichts neu, was es hier gibt. Fehlt etwas, kommt es in dieses Paket, nicht in die App.",
            ],
            ["Lokal und still.", "Keine Schrift, kein Icon und kein Bild aus dem Netz. Alles ist gebündelt."],
          ].map(([title, text], index) => (
            <li key={index} className="flex gap-3 rounded-card border border-hairline bg-surface p-4">
              <span className="grid size-7 shrink-0 place-items-center rounded-full bg-pink-tint text-meta font-bold text-pink-ink">
                {index + 1}
              </span>
              <span className="flex flex-col gap-1">
                <strong className="text-body">{title}</strong>
                <span className="text-meta text-muted">{text}</span>
              </span>
            </li>
          ))}
        </ol>
      </Section>
    </>
  );
}

export function Usage() {
  return (
    <Section
      id="nutzung"
      title="Nutzung"
      lead="Das Paket heißt @uwusuite/design und kommt als Release-Tarball von GitHub. Es bringt Tokens, Schriften, das Tailwind-Theme, Komponenten, Icons, Nyu und das Icon-Werkzeug mit."
    >
      <Code>{`# package.json der App
"@uwusuite/design": "https://github.com/MinifyX/UwUSuite-Design/releases/download/v1.0.0/uwusuite-design-1.0.0.tgz"

/* styles/app.css */
@import "tailwindcss";
@import "@uwusuite/design/tailwind.css";
@import "@uwusuite/design/font-picker.css"; /* nur mit Schriftauswahl */

// main.tsx
import { Button, Icon, ICONS, Nyu, useAppearance, applyUiFont } from "@uwusuite/design";
import { useTauriWindow } from "@uwusuite/design/tauri";

# App-Icons (im Tauri-App-Ordner)
pnpm exec uwu-icons --brand ../../brand --name uwumirror --tray --mobile`}</Code>
      <Rules
        items={[
          [true, "Farben nur über Tokens: bg-surface, text-muted, border-line oder var(--uwu-…)."],
          [true, "Fehlt ein Token, eine Komponente oder ein Icon: hier ergänzen, neue Version, in den Apps anheben."],
          [false, "Keine Hex-Werte in Komponenten, keine eigene Kopie von tokens.css oder UwU Sans in einer App."],
          [
            false,
            "Keine Schrift, kein Icon-Set und keine Komponente aus einer anderen Bibliothek, wenn es sie hier gibt.",
          ],
        ]}
      />
    </Section>
  );
}
