import { useState, type CSSProperties } from "react";
import {
  resolveType,
  ROLE_POINTS,
  Segmented,
  TEXT_POINTS,
  TEXT_SIZE_CHOICES,
  TEXT_SIZE_LABELS,
  tokenSize,
  TYPE_ROLES,
  type TextSizeChoice,
  type TextToken,
  type TypePlatform,
} from "../../src";
import { Rules, Section, Sub, Panel } from "./ui";

const PLATFORMS: { value: TypePlatform; label: string }[] = [
  { value: "desktop", label: "Windows/Linux" },
  { value: "macos", label: "macOS" },
  { value: "ios", label: "iOS" },
  { value: "android", label: "Android" },
];

const PLATFORM_NOTES: Record<TypePlatform, string> = {
  desktop: "Fluent-nah: Text 14. Bleibt wie bisher.",
  macos: "HIG: body 13 pt SF. UwU Sans hat die kleinere x-Höhe, darum × 1,06.",
  ios: "Dynamic Type „Large“: body 17 pt, folgt der Textgröße des Systems.",
  android: "Material 3: body large 16. Die WebView vergrößert selbst nach der Systemschrift.",
};

const SCALE: [TextToken, string, string, string][] = [
  ["large", "text-large", "font-bold tracking-[-0.015em]", "Großer Titel (Handy, Startseiten)"],
  ["title", "text-title", "font-bold tracking-[-0.01em]", "Seitentitel"],
  ["section", "text-section", "font-semibold", "Dialogtitel, Abschnitte"],
  ["reading", "text-reading", "", "Lesetext: Mails, Notizen, Erklärungen"],
  ["body", "text-body", "", "Standard für Oberfläche und Listen"],
  ["meta", "text-meta", "", "Buttons, Menüs, Metadaten"],
  ["caption", "text-caption", "", "Hinweise unter Feldern, Gruppentitel"],
  ["badge", "text-badge", "font-semibold", "Zähler und Abzeichen"],
];

function PlatformScale() {
  const [platform, setPlatform] = useState<TypePlatform>("macos");
  const [size, setSize] = useState<TextSizeChoice>("system");
  const resolved = resolveType({ platform, textSize: size });
  const frame = {
    "--uwu-type-optical": resolved.optical,
    "--uwu-type-scale": resolved.scale,
  } as CSSProperties;
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <Segmented label="Plattform" value={platform} onChange={setPlatform} options={PLATFORMS} />
        <Segmented
          label="Textgröße"
          value={size}
          onChange={setSize}
          options={TEXT_SIZE_CHOICES.map((value) => ({ value, label: TEXT_SIZE_LABELS.de[value] }))}
        />
      </div>
      <p className="text-meta text-muted">{PLATFORM_NOTES[platform]}</p>
      <div
        data-type={platform}
        style={frame}
        className="flex flex-col divide-y divide-hairline rounded-card border border-hairline bg-surface"
      >
        {SCALE.map(([token, utility, extra, use]) => (
          <div key={token} className="flex flex-wrap items-baseline gap-x-6 gap-y-1 px-5 py-3">
            <code className="w-36 shrink-0 text-caption text-muted">
              {token} · {TEXT_POINTS[platform][token]} → {tokenSize(token, resolved).toFixed(1)}
            </code>
            <span className={`${utility} ${extra} min-w-0 flex-1`}>Die Katze im Umschlag</span>
            <span className="text-caption text-muted">{use}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function RoleTable() {
  return (
    <div className="overflow-x-auto rounded-card border border-hairline bg-surface">
      <table className="w-full text-left text-meta tabular-nums">
        <thead className="text-caption text-muted">
          <tr>
            <th className="px-4 py-2 font-semibold">Rolle (--uwu-type-*)</th>
            {PLATFORMS.map((platform) => (
              <th key={platform.value} className="px-4 py-2 font-semibold">
                {platform.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-hairline">
          {[...TYPE_ROLES].reverse().map((role) => (
            <tr key={role}>
              <td className="px-4 py-1.5">
                <code>{role}</code>
              </td>
              {PLATFORMS.map((platform) => (
                <td key={platform.value} className="px-4 py-1.5">
                  {ROLE_POINTS[platform.value][role]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

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
          Die Größen folgen der Plattform und der Textgröße des Systems.
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
      <Sub title="Größen je Plattform">
        <PlatformScale />
      </Sub>
      <Sub title="Rollen">
        <RoleTable />
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
            "Gewichte: 400 Text, Zeilen und Zähler, 500 Menüs und Labels, 600 Titel und Buttons, 700 Dialogtitel und Gruppentitel, 800 nur die Wortmarke.",
          ],
          [true, "Gruppentitel: caption, fett, Großbuchstaben, gesperrt, muted."],
          [
            true,
            "Größen nur über Tokens (text-body, --uwu-type-headline …). Sie folgen der Plattform und der Textgröße des Systems.",
          ],
          [
            false,
            "Keine festen px-Schriftgrößen in Apps, außer an Dingen mit fester Größe (Avatar-Initialen, App-Icons).",
          ],
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
