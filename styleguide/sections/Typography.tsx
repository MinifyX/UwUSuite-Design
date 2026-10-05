import { Rules, Section, Sub, Panel } from "./ui";

const SCALE: [string, string, string, string][] = [
  ["title · 22", "text-title", "font-bold tracking-[-0.01em]", "Seitentitel"],
  ["section · 18", "text-section", "font-bold", "Dialogtitel, Abschnitte"],
  ["reading · 16", "text-reading", "", "Lesetext: Mails, Notizen, Erklärungen"],
  ["body · 14", "text-body", "", "Standard für Oberfläche und Listen"],
  ["meta · 13", "text-meta", "", "Buttons, Menüs, Metadaten"],
  ["caption · 12", "text-caption", "", "Hinweise unter Feldern, Gruppentitel"],
  ["badge · 11", "text-badge", "font-bold", "Zähler und Abzeichen"],
];

export function Typography() {
  return (
    <Section
      id="schrift"
      title="Schrift"
      lead={
        <>
          <strong>UwU Sans</strong> ist die Schrift der ganzen Suite: Atkinson Hyperlegible Next mit Nyu (U+E000), einem
          Herz und Pfeilen. Sie ist variabel von 200 bis 800, rund 48 KB groß, steht unter der OFL und ist gebündelt.{" "}
          <strong>JetBrains Mono</strong> ist die Schrift für Code, Adressen, Fingerabdrücke und Versionen. Die
          Schriftauswahl darf zusätzlich Manrope, Rubik, DM Sans und die Systemschrift anbieten. Probier es oben aus.
        </>
      }
    >
      <Panel className="flex flex-col gap-4">
        <p className="text-[56px] leading-none font-extrabold tracking-[-0.02em]">Hallo, ich bin Nyu {"\uE000"}</p>
        <p className="text-reading">
          Franz jagt im komplett verwahrlosten Taxi quer durch Bayern. <span className="tabular-nums">0123456789</span>{" "}
          · äöü ß ÄÖÜ · „Zitat“ – Gedankenstrich … ← ↑ → ↓ ♥
        </p>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-reading">
          {[200, 300, 400, 500, 600, 700, 800].map((weight) => (
            <span key={weight} style={{ fontWeight: weight }}>
              {weight} Nyu
            </span>
          ))}
        </div>
      </Panel>
      <Sub title="Größen">
        <div className="flex flex-col divide-y divide-hairline rounded-card border border-hairline bg-surface">
          {SCALE.map(([name, size, extra, use]) => (
            <div key={name} className="flex flex-wrap items-baseline gap-x-6 gap-y-1 px-5 py-3">
              <code className="w-28 shrink-0 text-caption text-muted">{name}</code>
              <span className={`${size} ${extra} min-w-0 flex-1`}>Die Katze im Umschlag</span>
              <span className="text-caption text-muted">{use}</span>
            </div>
          ))}
        </div>
      </Sub>
      <Sub title="Nyu und Herz">
        <div className="grid gap-3 sm:grid-cols-2">
          <Panel className="flex flex-col gap-2">
            <p className="text-section">Nyu {"\uE000"} · Herz ♥ · Pfeile ← ↑ → ↓</p>
            <p className="text-meta text-muted">
              Nyu und das Herz gibt es nur als eigene Zeichen: <code>U+E000</code> und <code>U+2665</code>. Wer sie
              zeigen will, setzt genau diese Zeichen.
            </p>
          </Panel>
          <Panel className="flex flex-col gap-2">
            <p className="text-section">Bis gleich :3 und danke &lt;3</p>
            <p className="text-meta text-muted">
              UwU Sans hat keine Ligaturen. <code>:3</code> und <code>&lt;3</code> bleiben, wie sie getippt wurden, denn
              ein Bild statt der Zeichen würde ihre Bedeutung ändern.
            </p>
          </Panel>
        </div>
      </Sub>
      <Sub title="Mono">
        <Panel className="uwu-mono text-meta">
          SHA256:4f2a…9c1e · 192.0.2.17:7000 · v1.0.0-beta.1 · ssh nyu@example.com
        </Panel>
      </Sub>
      <Rules
        items={[
          [
            true,
            "Überall UwU Sans über --font-ui. Die Laufweite steht in --tracking-ui (-0,008em), nie in der Schrift selbst.",
          ],
          [true, "Zahlen in Listen, Zählern und Zeiten mit tabular-nums."],
          [
            true,
            "Gewichte: 400 Text, 500 Menüs, 600 Titel und Buttons, 700 Dialogtitel und Labels, 800 nur die Wortmarke.",
          ],
          [true, "Gruppentitel: 12 px, fett, Großbuchstaben, gesperrt, muted."],
          [false, "Keine Schrift aus dem Netz, keine eigene Kopie von UwU Sans in einer App."],
          [
            false,
            "Kein Kursiv als Gestaltung (UwU Sans hat keins, der Browser würde es schräg rechnen), keine Serifen.",
          ],
        ]}
      />
    </Section>
  );
}
