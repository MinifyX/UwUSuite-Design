import { useState } from "react";
import { Button, ICONS, Icon, keepKaomojiTogether, Nyu, TitleBar, TitleBarAction, Wordmark } from "../../src";
import { macShortcut } from "../../src/lib/shortcuts";
import { macMenuSpec } from "../../src/tauri/mac-menu";
import { Code, Panel, Rules, Section, Sub } from "./ui";

export function Window() {
  const [maximized, setMaximized] = useState(false);
  const controls = {
    maximized,
    minimize: () => {},
    toggleMaximize: () => setMaximized((value) => !value),
    close: () => {},
  };
  return (
    <Section
      id="fenster"
      title="Fenster"
      lead="Unter Windows und Linux haben die Apps eine eigene Titelleiste, unter macOS die native. So passt die App zu Windows und Linux, und auf dem Mac fühlt sie sich wie ein Mac an."
    >
      <div className="overflow-hidden rounded-card border border-line shadow-float">
        <TitleBar
          brand={<Wordmark product="Mirror" shell="mirror" />}
          controls={controls}
          actions={
            <TitleBarAction label="Einstellungen (Strg+,)" onClick={() => {}}>
              <Icon icon={ICONS.settings} size="md" />
            </TitleBarAction>
          }
        />
        <div className="grid h-[180px] place-items-center bg-canvas text-meta text-muted">Inhalt der App</div>
      </div>
      <Sub title="Tauri-Konfiguration">
        <Code>{`// tauri.conf.json (Windows, Linux)
{ "app": { "windows": [{ "decorations": false, "shadow": true,
  "width": 1180, "height": 760, "minWidth": 640, "minHeight": 440, "center": true }] } }

// tauri.macos.conf.json
{ "app": { "windows": [{ "decorations": true, "titleBarStyle": "Visible" }] } }

// App
<TitleBar platform={detectPlatform()} controls={useTauriWindow()}
  brand={<Wordmark product="Mirror" shell="mirror" />} actions={…} />`}</Code>
      </Sub>
      <Rules
        items={[
          [
            true,
            "Titelleiste 38 px auf surface mit Haarlinie: Nyu (22 px) und Wortmarke links, Aktionen und Fensterknöpfe rechts.",
          ],
          [
            true,
            "Fensterknöpfe 46 px breit, Schließen wird beim Hover pink-solid. Doppelklick auf die leere Leiste maximiert.",
          ],
          [true, "macOS: native Titelleiste mit Ampel und die System-Menüleiste, siehe unten."],
          [true, "Mindestgröße 640 × 440. Unter 700 px Breite gilt das Telefon-Layout (Variante phone:)."],
          [false, "Keine nachgebauten Ampel-Knöpfe auf Windows/Linux, keine Windows-Knöpfe auf dem Mac."],
          [
            false,
            "Keine Bedienelemente in der Drag-Region ohne eigenes Klickziel, nichts Wichtiges nur in der Titelleiste.",
          ],
        ]}
      />
      <MacWindow />
    </Section>
  );
}

/** The shortcuts AppKit gives its own items, for the preview. */
const SYSTEM_KEYS: Record<string, string> = {
  Hide: "⌘H",
  HideOthers: "⌥⌘H",
  Quit: "⌘Q",
  CloseWindow: "⌘W",
  Undo: "⌘Z",
  Redo: "⇧⌘Z",
  Cut: "⌘X",
  Copy: "⌘C",
  Paste: "⌘V",
  SelectAll: "⌘A",
  Minimize: "⌘M",
  Fullscreen: "⌃⌘F",
};

const noop = () => {};
const PREVIEW = macMenuSpec({
  appName: "UwUMirror",
  onSettings: noop,
  app: [{ text: "Nach Updates suchen …", action: noop }],
  file: [{ text: "Neue Verbindung …", accelerator: "CmdOrCtrl+N", action: noop }],
  view: [{ text: "Seitenleiste", accelerator: "CmdOrCtrl+Alt+S", checked: true, action: noop }],
  menus: [{ text: "Verbindung", items: [{ text: "Trennen", accelerator: "CmdOrCtrl+Shift+D", action: noop }] }],
  help: [{ text: "UwUMirror-Website", action: noop }],
});

function MacWindow() {
  return (
    <Sub title="macOS">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {PREVIEW.map((menu) => (
          <Panel key={menu.text} className="flex flex-col gap-1 p-3">
            <strong className="px-2 text-meta">{menu.text}</strong>
            <ul className="flex flex-col text-[13px]">
              {menu.items.map((item, at) => {
                if ("item" in item && item.item === "Separator")
                  return <li key={at} aria-hidden="true" className="mx-2 my-1 border-t border-hairline" />;
                const key =
                  "item" in item ? (typeof item.item === "string" ? SYSTEM_KEYS[item.item] : undefined) : undefined;
                const accelerator = "accelerator" in item && item.accelerator ? macShortcut(item.accelerator) : key;
                return (
                  <li key={at} className="flex justify-between gap-3 rounded-md px-2 py-0.5">
                    <span>
                      {"checked" in item && item.checked ? "✓ " : ""}
                      {item.text}
                    </span>
                    {accelerator && <span className="text-muted">{accelerator}</span>}
                  </li>
                );
              })}
              {menu.role === "help" && <li className="px-2 py-0.5 text-muted">(Suchfeld von macOS)</li>}
            </ul>
          </Panel>
        ))}
      </div>
      <Code>{`import { hideWindowOnClose, onMacQuit, setMacMenu } from "@uwusuite/design/tauri";

await setMacMenu({ appName: "UwUMirror", onSettings: openSettings,
  file: [{ text: "Neue Verbindung …", accelerator: "CmdOrCtrl+N", action: newConnection }] });
await hideWindowOnClose();          // ⌘W: Fenster weg, App bleibt im Dock
await onMacQuit(() => saveAll());   // ⌘Q, Dock, Abmelden: erst speichern

// src-tauri: uwu-macos (Crate in diesem Repo) + RunEvent::Reopen, siehe docs/macos.md`}</Code>
      <Rules
        items={[
          [
            true,
            "Einstellungen stehen im App-Menü unter „Einstellungen …“ (⌘,), Über/Ausblenden/Beenden ebenfalls dort. Das Zahnrad der Titelleiste gibt es auf dem Mac nicht.",
          ],
          [
            true,
            "Menüs in Apples Reihenfolge: App, Ablage, Bearbeiten, Darstellung, eigene Menüs, Fenster, Hilfe. Standardeinträge sind die von macOS.",
          ],
          [true, "Kürzel als Accelerator schreiben (CmdOrCtrl+N), angezeigt als ⌘N: shortcutText() in Tooltips."],
          [
            true,
            "⌘W und die rote Ampel schließen nur das Fenster; die App bleibt im Dock, ein Klick aufs Dock-Icon holt es zurück.",
          ],
          [true, "⌘Q, Beenden im Dock und Abmelden speichern vorher (uwu-macos + onMacQuit)."],
          [false, "Keine eigene Titelleiste, keine nachgebauten Ampeln, kein Menü im Fenster auf dem Mac."],
        ]}
      />
    </Sub>
  );
}

const MOTION: [string, string, string][] = [
  ["animate-pop", "180 ms, ease-pop", "Menüs, Dialoge, leere Zustände erscheinen"],
  ["animate-slide-up", "220 ms, ease-out", "Toasts kommen von unten"],
  ["animate-fade", "160 ms", "Überblendungen"],
  ["animate-drawer", "220 ms", "Seitenleiste am Telefon"],
  ["animate-wiggle", "600 ms", "„Hier fehlt was“"],
  ["nyu-logo-hop", "560 ms", "Nyu hüpft bei einem echten Ereignis (neue Mail)"],
];

export function Motion() {
  const [key, setKey] = useState(0);
  return (
    <Section
      id="bewegung"
      title="Bewegung"
      lead="Kurz, weich und mit einem kleinen Federn. Bewegung erklärt, woher etwas kommt. Sie ist nie Selbstzweck und lässt sich überall abschalten: Bei „Animationen: Aus“ oder prefers-reduced-motion schrumpft alles auf 1 ms, und Nyu steht still."
    >
      <Panel className="flex flex-wrap items-center gap-6">
        <Button onClick={() => setKey((value) => value + 1)}>Abspielen</Button>
        <div key={key} className="flex flex-wrap items-center gap-6">
          <span className="animate-pop rounded-full bg-pink-tint px-3 py-1 text-meta font-semibold text-pink-ink">
            pop
          </span>
          <span className="animate-slide-up rounded-full bg-pink-tint px-3 py-1 text-meta font-semibold text-pink-ink">
            slide-up
          </span>
          <span className="animate-wiggle rounded-full bg-pink-tint px-3 py-1 text-meta font-semibold text-pink-ink">
            wiggle
          </span>
          <span className={key > 0 ? "nyu-logo-hop inline-flex" : "inline-flex"}>
            <Nyu shell="mail" size={40} title="" blink={false} />
          </span>
        </div>
      </Panel>
      <div className="flex flex-col divide-y divide-hairline rounded-card border border-hairline bg-surface">
        {MOTION.map(([name, timing, use]) => (
          <div key={name} className="flex flex-wrap gap-x-6 gap-y-1 px-5 py-3 text-meta">
            <code className="w-40 font-semibold">{name}</code>
            <span className="w-36 text-muted">{timing}</span>
            <span>{use}</span>
          </div>
        ))}
      </div>
      <Rules
        items={[
          [true, "Übergänge 150 ms (Farben, Hover), 200 ms (Schalter), 220 ms (Hereinkommen). Gedrückt: scale 0,97."],
          [true, "Endlose Schleifen nur in Nyu-Szenen und für „verbindet …“-Punkte."],
          [false, "Kein Hüpfen bei jeder Synchronisierung, keine Animation, die auf Eingaben warten lässt."],
          [false, "Keine Animation ohne Abschaltung über data-motion, keine eigenen Dauern außerhalb der Tokens."],
        ]}
      />
    </Section>
  );
}

const EXAMPLES: [string, string, string][] = [
  ["Posteingang leer", "Du bist auf dem neuesten Stand.", "Posteingang leer! Zeit für einen Tee (っ˘ω˘ς)"],
  ["Gesendet", "Nachricht gesendet.", "Und weg ist sie ✉︎ ~"],
  [
    "Offline",
    "Du bist offline. Gespeicherte Mails werden angezeigt.",
    "Kein Internet (・_・;) Ich zeig dir, was ich gespeichert hab.",
  ],
  [
    "Fehler",
    "Nicht gesendet: Der Server lehnt das Passwort ab.",
    "Nicht gesendet (╥﹏╥) Der Server sagt, das Passwort stimmt nicht.",
  ],
  ["Bereit", "Empfangsbereit als „Wohnzimmer“.", "Bereit zum Spiegeln als „Wohnzimmer“ ✨"],
];

export function Tone() {
  return (
    <Section
      id="ton"
      title="Ton"
      lead="Standardmäßig verspielt: Kaomoji, kleine Witze, weiche Animationen. „Ton: Neutral“ tauscht nur die Wörter, nie Layout oder Farben. Deutsch ist die Ausgangssprache, wir duzen."
    >
      <div className="overflow-x-auto rounded-card border border-hairline bg-surface">
        <table className="w-full min-w-[640px] text-left text-meta">
          <thead className="text-caption font-bold tracking-wide text-muted uppercase">
            <tr className="border-b border-hairline">
              <th className="px-5 py-3">Situation</th>
              <th className="px-5 py-3">Neutral</th>
              <th className="px-5 py-3">Verspielt</th>
            </tr>
          </thead>
          <tbody>
            {EXAMPLES.map(([situation, neutral, playful]) => (
              <tr key={situation} className="border-b border-hairline last:border-b-0">
                <td className="px-5 py-3 font-semibold">{situation}</td>
                <td className="px-5 py-3">{neutral}</td>
                <td className="px-5 py-3">{keepKaomojiTogether(playful)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Rules
        items={[
          [true, "Information zuerst: Was ist passiert, was ist zu tun. Der Witz kommt dazu."],
          [true, "Kurz, freundlich, du. Deutsche Anführungszeichen „…“, Gedankenstrich –, Auslassung …"],
          [true, "Höchstens ein Kaomoji pro Meldung, mit Wortverbindern, damit es nicht umbricht."],
          [
            true,
            "Alles, was mit Sicherheit zu tun hat (wer sich verbinden darf, was gelöscht wird), ist schlicht und klar.",
          ],
          [false, "Nie über die Person lachen, die App lacht über sich selbst."],
          [false, "Kein Kaomoji in Buttons, Fehlercodes nur zusätzlich zur Erklärung."],
        ]}
      />
    </Section>
  );
}
