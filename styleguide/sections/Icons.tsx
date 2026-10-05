import { Bell, Heart, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { macMasterSvg, trayTemplateSvg } from "../../bin/mac-icon.mjs";
import { Icon, ICON_SIZES, ICONS, IconButton, SUITE_ICON_NODES, type IconSize } from "../../src";
import { Panel, Rules, Section, Sub } from "./ui";

const SIZE_USE: Record<IconSize, string> = {
  xs: "In dichtem Text, Chips, Badges",
  sm: "Buttons, Menüs, Listen, Felder (Standard)",
  md: "Icon-Buttons, Navigation, Titelleiste",
  lg: "Werkzeugleisten zum Tippen, Tabs mit Gerät",
  xl: "Karten, Einstellungsgruppen, Dialog-Icon",
};

export function Icons() {
  return (
    <Section
      id="icons"
      title="Icons"
      lead={
        <>
          Die Grundlage ist <strong>Lucide</strong>. Fehlt dort etwas, zeichnen wir es selbst nach denselben Regeln.
          Jedes Icon läuft durch <code>&lt;Icon&gt;</code>, das Größe und Strich festlegt. Jede Bedeutung hat genau ein
          Icon in <code>ICONS</code>, damit „Löschen“ überall derselbe Papierkorb ist.
        </>
      }
    >
      <Sub title="Größen und Strich">
        <div className="grid grid-cols-[repeat(auto-fill,minmax(190px,1fr))] gap-3">
          {(Object.keys(ICON_SIZES) as IconSize[]).map((size) => (
            <Panel key={size} className="flex flex-col gap-3 !p-4">
              <div className="flex items-end gap-3 text-ink">
                <Icon icon={Settings} size={size} />
                <Icon icon={Bell} size={size} />
                <Icon icon={ICONS.nyu} size={size} />
              </div>
              <div>
                <p className="text-meta font-bold">
                  {size} · {ICON_SIZES[size].px} px · Strich {String(ICON_SIZES[size].stroke).replace(".", ",")}
                </p>
                <p className="text-caption text-muted">{SIZE_USE[size]}</p>
              </div>
            </Panel>
          ))}
        </div>
      </Sub>
      <Sub title="Vokabular: eine Bedeutung, ein Icon">
        <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-2">
          {Object.entries(ICONS).map(([meaning, glyph]) => (
            <div
              key={meaning}
              className="flex items-center gap-2.5 rounded-control border border-hairline bg-surface px-3 py-2"
            >
              <Icon icon={glyph} size="md" className="text-muted" />
              <code className="truncate text-[11.5px]">{meaning}</code>
            </div>
          ))}
        </div>
      </Sub>
      <Sub title="Eigene Suite-Icons">
        <div className="flex flex-wrap gap-3">
          {Object.keys(SUITE_ICON_NODES).map((name) => {
            return (
              <Panel key={name} className="flex w-[150px] flex-col items-center gap-2 !p-4">
                <svg
                  viewBox="0 0 24 24"
                  width={48}
                  height={48}
                  className="rounded-small bg-[repeating-linear-gradient(0deg,transparent_0_1.95px,var(--uwu-hairline)_1.95px_2px),repeating-linear-gradient(90deg,transparent_0_1.95px,var(--uwu-hairline)_1.95px_2px)] text-ink"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <rect
                    x="2"
                    y="2"
                    width="20"
                    height="20"
                    fill="none"
                    stroke="var(--uwu-pink-tint-strong)"
                    strokeWidth={0.3}
                    strokeDasharray="1 1"
                  />
                  {SUITE_ICON_NODES[name as keyof typeof SUITE_ICON_NODES].map(([tag, attrs]) => {
                    const { key, ...rest } = attrs as Record<string, string>;
                    const Tag = tag as "path";
                    return <Tag key={key} {...rest} />;
                  })}
                </svg>
                <code className="text-[11.5px]">{name}</code>
              </Panel>
            );
          })}
        </div>
      </Sub>
      <Sub title="Zustand und Farbe">
        <Panel className="flex flex-wrap items-center gap-3">
          <IconButton icon={ICONS.favorite} label="Normal" />
          <IconButton icon={ICONS.favorite} label="Aktiv" active />
          <span className="inline-flex items-center gap-1.5 text-meta text-success-ink">
            <Icon icon={ICONS.success} /> Gespeichert
          </span>
          <span className="inline-flex items-center gap-1.5 text-meta text-warning-ink">
            <Icon icon={ICONS.warning} /> Firewall prüfen
          </span>
          <span className="inline-flex items-center gap-1.5 text-meta text-danger-ink">
            <Icon icon={ICONS.error} /> Nicht gesendet
          </span>
          <span className="inline-flex items-center gap-1.5 text-meta text-pink">
            <Icon icon={Heart} className="fill-pink" /> Gefüllt nur als Zustand
          </span>
        </Panel>
      </Sub>
      <Rules
        items={[
          [
            true,
            "24 × 24 Raster, 2 px Rand (Inhalt 1…23), nur Striche, runde Enden und Ecken, Radius 2 an Rechtecken.",
          ],
          [true, "Farbe immer currentColor. Leise Icons nehmen muted, beim Hover ink, aktiv pink-ink."],
          [true, "Icons ohne Text sind Icon-Buttons mit label. Das label ist Name und Tooltip."],
          [true, "Neue Bedeutung: in ICONS eintragen. Neues Icon: in src/icons/suite.ts, check-icons muss grün sein."],
          [
            false,
            "Keine Füllung außer für einen Zustand (Stern markiert, Herz gemerkt), kein Text, keine Farbverläufe.",
          ],
          [
            false,
            "Kein zweites Icon-Set, keine Emoji als Icon, kein Nyu als Bedienelement (Nyu ist Marke, siehe unten).",
          ],
          [
            false,
            "Keine Marken-Logos fremder Firmen als Icon: Android ist der Roboterkopf in unserem Strich, kein Logo.",
          ],
          [false, "Keine eigene Strichstärke pro App. Abweichungen nur über ICON_SIZES."],
        ]}
      />
    </Section>
  );
}

const APPS = [
  ["uwumail", "UwUMail", "Umschlag"],
  ["uwumirror", "UwUMirror", "Handspiegel"],
  ["uwunotes", "UwUNotes", "Notizblatt"],
  ["uwulock", "UwULock", "Vorhängeschloss"],
  ["uwussh", "UwUSSH", "Terminal"],
  ["uwukeygen", "UwUKeygen", "Schlüssel"],
  ["uwurdp", "UwURDP", "Monitor"],
  ["uwuauth", "UwUAuth", "Ausweis"],
  ["uwusync", "UwUSync", "Server"],
  ["uwusuite", "UwUSuite", "Kiste"],
] as const;

export function AppIcons() {
  return (
    <Section
      id="app-icons"
      title="App-Icons"
      lead={
        <>
          Jede App hat drei Formen. Die <strong>App-Icon</strong>-Form ist Nyu leicht geneigt auf der Pastellkachel, für
          macOS-Dock, Stores, Website und GitHub. Die <strong>Taskleisten</strong>-Form ist Nyu allein und aufrecht,
          ohne Kachel, für die Windows-Taskleiste, das Fenster und Linux-Menüs. Die <strong>kleine</strong> Form ist ein
          vereinfachter Schnitt für 16 bis 24 px und das Tray. <code>uwu-icons</code> erzeugt daraus alle
          Plattformdateien.
        </>
      }
    >
      <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-4">
        {APPS.map(([file, name, shell]) => (
          <figure key={file} className="flex flex-col items-center gap-2 text-center">
            <img src={`./apps/${file}-app-icon.svg`} alt="" width={96} height={96} className="drop-shadow-nyu" />
            <figcaption className="flex flex-col">
              <strong className="text-meta">{name}</strong>
              <span className="text-caption text-muted">{shell}</span>
            </figcaption>
          </figure>
        ))}
      </div>
      <Sub title="Drei Formen am Beispiel UwUMail und UwUMirror">
        <div className="grid gap-3 sm:grid-cols-2">
          {(["uwumail", "uwumirror"] as const).map((app) => (
            <Panel key={app} className="flex flex-wrap items-end gap-6">
              <figure className="flex flex-col items-center gap-1">
                <img src={`./apps/${app}-app-icon.svg`} alt="" width={88} height={88} />
                <figcaption className="text-caption text-muted">App-Icon</figcaption>
              </figure>
              <figure className="flex flex-col items-center gap-1">
                <span className="grid size-[88px] place-items-center rounded-control bg-[#202020]">
                  <img src={`./apps/${app}-taskbar-icon.svg`} alt="" width={64} height={64} />
                </span>
                <figcaption className="text-caption text-muted">Taskleiste</figcaption>
              </figure>
              <figure className="flex flex-col items-center gap-1">
                <span className="flex size-[88px] items-center justify-center gap-2 rounded-control bg-[#f3f3f3]">
                  <img src={`./apps/${app}-taskbar-icon-small.svg`} alt="" width={24} height={24} />
                  <img src={`./apps/${app}-taskbar-icon-small.svg`} alt="" width={16} height={16} />
                </span>
                <figcaption className="text-caption text-muted">16 / 24 px</figcaption>
              </figure>
              <figure className="flex flex-col items-center gap-1 text-ink">
                <img src={`./apps/${app}-symbol-mono.svg`} alt="" width={56} height={56} className="dark:invert" />
                <figcaption className="text-caption text-muted">Mono</figcaption>
              </figure>
            </Panel>
          ))}
        </div>
      </Sub>
      <Rules
        items={[
          [
            true,
            "Kachel 512 × 512, rx 116, Verlauf #FFF3F8 → #FFD3E5, Schatten #C2306F mit 25 %. Vorlage: brand/app-icon-template.svg.",
          ],
          [true, "Nyu mit weißem Stanzrand, um -6° bis -8° geneigt, etwas unter der Mitte, etwa 330 px breit."],
          [
            true,
            "Zwei oder drei Requisiten (Sterne #FFD66E, Herz, das Ding der App), anders angeordnet als bei den anderen Apps.",
          ],
          [true, "Fünf Dateien pro App in brand/: app-icon, taskbar-icon, taskbar-icon-small, symbol, symbol-mono."],
          [false, "Nie eine satte pinke Kachel (wirkt wie eine Telekom-App), nie eine andere Kachelfarbe."],
          [false, "Keine Kachel in der Taskleiste und im Tray, kein Gesicht und keine Wangen unter 24 px."],
        ]}
      />
      <MacIcons />
    </Section>
  );
}

const svgUrl = (svg: string) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

/** An SVG from public/apps, turned into another SVG and served as a data URL. */
function useDerivedSvg(file: string, derive: (svg: string) => string) {
  const [url, setUrl] = useState<string>();
  useEffect(() => {
    let live = true;
    fetch(`./apps/${file}`)
      .then((response) => response.text())
      .then((svg) => live && setUrl(svgUrl(derive(svg))))
      .catch(() => undefined);
    return () => {
      live = false;
    };
  }, [file, derive]);
  return url;
}

const master = (svg: string) => macMasterSvg(svg, "preview");
const template = (svg: string) => trayTemplateSvg(svg);

function MacIcons() {
  const dock = useDerivedSvg("uwumirror-app-icon.svg", master);
  const tray = useDerivedSvg("uwumirror-symbol-mono.svg", template);
  return (
    <Sub title="macOS: Dock und Menüleiste">
      <div className="grid gap-3 sm:grid-cols-2">
        <Panel className="flex flex-col gap-3">
          <div className="flex items-end justify-center gap-5 rounded-control bg-[#d9d9de] px-4 py-3 dark:bg-[#3a3a40]">
            <figure className="flex flex-col items-center gap-1">
              <img src="./apps/uwumirror-app-icon.svg" alt="" width={72} height={72} />
              <figcaption className="text-caption text-[#3a3a40] dark:text-[#d9d9de]">randlos ✗</figcaption>
            </figure>
            <figure className="flex flex-col items-center gap-1">
              {dock && <img src={dock} alt="" width={72} height={72} />}
              <figcaption className="text-caption text-[#3a3a40] dark:text-[#d9d9de]">Apple-Raster ✓</figcaption>
            </figure>
          </div>
          <p className="text-meta text-muted">
            Im Dock steht jedes Icon im Raster von Apple: die Kachel 824 von 1024 px, Apples abgerundetes Quadrat,
            darunter ein weicher Schatten. <code>uwu-icons</code> setzt das App-Icon dafür selbst ins Raster.
          </p>
        </Panel>
        <Panel className="flex flex-col gap-3">
          <div className="flex flex-col overflow-hidden rounded-control border border-hairline">
            {[
              ["bg-[#f4f4f6] text-black", ""],
              ["bg-[#2b2b30] text-white", "invert"],
            ].map(([bar, filter]) => (
              <div key={bar} className={`flex h-7 items-center justify-end gap-4 px-3 text-[13px] ${bar}`}>
                {tray && <img src={tray} alt="" width={18} height={18} className={filter} />}
                <span>Mo. 9:41</span>
              </div>
            ))}
          </div>
          <p className="text-meta text-muted">
            Das Menüleisten-Icon ist ein Template: schwarz auf transparent, macOS färbt es für helle und dunkle Leisten.
            Es kommt aus <code>symbol-mono.svg</code> mit 1,5-fach dicken Linien, nie die farbige Nyu.
          </p>
        </Panel>
      </div>
      <Rules
        items={[
          [true, "Dock-Icon im Apple-Raster (824/1024, Superellipse, Schatten), erzeugt von uwu-icons."],
          [
            true,
            "Menüleiste: tray-template.png (36 px, 18 pt @2x) mit iconAsTemplate. Windows/Linux behalten tray.png.",
          ],
          [false, "Keine randlose Kachel im Dock, keine farbige Nyu in der Menüleiste."],
        ]}
      />
    </Sub>
  );
}
