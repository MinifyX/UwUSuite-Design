import { Smartphone } from "lucide-react";
import { useState } from "react";
import {
  Avatar,
  AVATAR_COLORS,
  Badge,
  Button,
  Card,
  createToasts,
  Dialog,
  EmptyState,
  Field,
  Hint,
  ICONS,
  keepKaomojiTogether,
  IconButton,
  Menu,
  Nyu,
  Pill,
  Segmented,
  Select,
  SettingRow,
  StatusLine,
  Switch,
  Tag,
  TextInput,
  Toaster,
  Toggle,
  Tooltip,
} from "../../src";
import { Panel, Rules, Section, Sub } from "./ui";

const toasts = createToasts();

export function Components() {
  const [airplay, setAirplay] = useState(true);
  const [tone, setTone] = useState<"playful" | "neutral">("playful");
  const [filter, setFilter] = useState("alle");
  const [dialog, setDialog] = useState<"none" | "form" | "warning" | "three">("none");
  const [name, setName] = useState("Wohnzimmer");

  return (
    <Section
      id="komponenten"
      title="Komponenten"
      lead="Die Bausteine aus UwUMail, ergänzt um Karten, Einstellungszeilen, Hinweise und Status aus UwUMirror. Alle sind mit Tastatur bedienbar, haben Namen für Screenreader und kommen ohne Hex-Werte aus."
    >
      <Sub title="Buttons">
        <Panel className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="primary" icon={ICONS.send}>
              Senden
            </Button>
            <Button>Abbrechen</Button>
            <Button variant="ghost" icon={ICONS.refresh}>
              Neu laden
            </Button>
            <Button variant="danger" icon={ICONS.delete}>
              Löschen
            </Button>
            <Button variant="primary" busy>
              Speichert
            </Button>
            <Button disabled>Gesperrt</Button>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button size="sm" variant="primary">
              Klein
            </Button>
            <Button size="md" variant="primary">
              Mittel
            </Button>
            <Button size="lg" variant="primary">
              Groß
            </Button>
            <IconButton icon={ICONS.settings} label="Einstellungen" />
            <IconButton icon={ICONS.favorite} label="Merken" active />
            <IconButton icon={ICONS.more} label="Mehr" size="sm" />
          </div>
        </Panel>
      </Sub>
      <Sub title="Eingaben">
        <Panel className="grid gap-5 sm:grid-cols-2">
          <Field label="Name im Netzwerk" hint="So sieht dich dein iPhone.">
            {(id, note) => (
              <TextInput id={id} aria-describedby={note} value={name} onChange={(e) => setName(e.target.value)} />
            )}
          </Field>
          <Field label="Port" error="Nur Zahlen von 1 bis 65535.">
            {(id, note) => <TextInput id={id} aria-describedby={note} aria-invalid defaultValue="70x0" />}
          </Field>
          <Field label="Sprache">
            {(id) => (
              <Select id={id} defaultValue="system">
                <option value="system">Wie das System</option>
                <option value="de">Deutsch</option>
                <option value="en">English</option>
              </Select>
            )}
          </Field>
          <div className="flex flex-col gap-4">
            <Toggle
              checked={airplay}
              onChange={setAirplay}
              label="AirPlay"
              description="iPhones und Macs können spiegeln."
            />
            <Segmented
              label="Ton"
              value={tone}
              onChange={setTone}
              options={[
                { value: "playful", label: "Verspielt" },
                { value: "neutral", label: "Neutral" },
              ]}
            />
            <Segmented
              label="Server, während die Anmeldung läuft"
              value="cloud"
              onChange={() => {}}
              disabled
              options={[
                { value: "cloud", label: "UwU Cloud" },
                { value: "own", label: "Eigener Server" },
              ]}
            />
            <Segmented
              label="Qualität"
              value="auto"
              onChange={() => {}}
              options={[
                { value: "auto", label: "Auto" },
                { value: "high", label: "Hoch" },
                { value: "4k", label: "4K", disabled: true },
              ]}
            />
          </div>
        </Panel>
      </Sub>
      <Sub title="Pillen, Zähler, Etiketten, Personen">
        <Panel className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {["alle", "ungelesen", "markiert"].map((value) => (
              <Pill
                key={value}
                active={filter === value}
                count={value === "ungelesen" ? 12 : undefined}
                onClick={() => setFilter(value)}
              >
                {value[0]!.toUpperCase() + value.slice(1)}
              </Pill>
            ))}
            <Badge count={3} />
            <Badge count={1500} />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Tag>Neutral</Tag>
            <Tag tone="pink">Beta</Tag>
            <Tag tone="success">Bereit</Tag>
            <Tag tone="warning">Prüfen</Tag>
            <Tag tone="danger">Abgelaufen</Tag>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {AVATAR_COLORS.map((color, index) => (
              <Avatar
                key={color}
                name={["Nyu Katz", "Ada Lovelace", "Kim Lee", "Max Muster", "Jo Beispiel", "Sam Test"][index]!}
                color={color}
              />
            ))}
            <Avatar name="Nyu" size="lg" />
            <Avatar name="Nyu" size="sm" />
          </div>
        </Panel>
      </Sub>
      <Sub title="Karten, Einstellungen, Hinweise, Status">
        <div className="grid gap-3 sm:grid-cols-2">
          <Card
            icon={Smartphone}
            title="iPhone, iPad und Mac"
            subtitle="Über AirPlay im selben Netzwerk"
            aside={<Switch checked={airplay} onChange={setAirplay} label="AirPlay" />}
          >
            <StatusLine state={airplay ? "online" : "offline"}>
              {airplay ? `Bereit als „${name}“` : "AirPlay ist aus"}
            </StatusLine>
            <StatusLine state="connecting">Verbinde mit „Pixel 8“ …</StatusLine>
            <StatusLine state="error">Die Firewall blockiert Port 7000.</StatusLine>
            <Hint tone="warning">Für Ton fehlt FFmpeg. Bild geht trotzdem.</Hint>
          </Card>
          <Card title="Darstellung">
            <div>
              <SettingRow label="Design" description="Folgt dem System, wenn du nichts wählst.">
                <Segmented
                  label="Design"
                  value="system"
                  onChange={() => {}}
                  options={[
                    { value: "system", label: "System" },
                    { value: "light", label: "Hell" },
                    { value: "dark", label: "Dunkel" },
                  ]}
                />
              </SettingRow>
              <SettingRow label="Animationen">
                <Switch checked onChange={() => {}} label="Animationen" />
              </SettingRow>
            </div>
            <Hint>Gilt nur für dieses Gerät.</Hint>
          </Card>
        </div>
      </Sub>
      <Sub title="Menü, Dialog, Toast, Tooltip">
        <Panel className="flex flex-wrap items-center gap-3">
          <Menu
            trigger={({ toggle, ...props }) => (
              <Button icon={ICONS.more} onClick={toggle} {...props}>
                Menü
              </Button>
            )}
            items={[
              { label: "Umbenennen", icon: ICONS.edit, onSelect: () => toasts.show("Umbenannt") },
              { label: "Kopieren", icon: ICONS.copy, onSelect: () => toasts.show("Kopiert", { tone: "success" }) },
              "separator",
              { label: "Löschen", icon: ICONS.delete, danger: true, onSelect: () => setDialog("warning") },
            ]}
          />
          <Button onClick={() => setDialog("form")}>Dialog</Button>
          <Button onClick={() => setDialog("three")}>Dialog mit drei Buttons</Button>
          <Button
            onClick={() =>
              toasts.show("Nachricht gesendet ✉︎ ~", { tone: "success", action: { label: "Rückgängig", run: () => {} } })
            }
          >
            Toast
          </Button>
          <Button
            onClick={() =>
              toasts.show(keepKaomojiTogether("Nicht gesendet (╥﹏╥) Der Server sagt: Passwort falsch."), {
                tone: "error",
              })
            }
          >
            Fehler-Toast
          </Button>
          <span className="text-meta">
            Absender:{" "}
            <Tooltip content="nyu@example.com">
              <strong>Nyu</strong>
            </Tooltip>
          </span>
        </Panel>
        <Dialog
          open={dialog === "form"}
          onClose={() => setDialog("none")}
          title="Handy koppeln"
          footer={
            <>
              <Button onClick={() => setDialog("none")}>Abbrechen</Button>
              <Button variant="primary" onClick={() => setDialog("none")}>
                Koppeln
              </Button>
            </>
          }
        >
          <div className="flex flex-col gap-4 px-6 pb-4">
            <p className="text-body text-muted">
              Öffne auf dem Handy die Entwickleroptionen und tippe auf „Über QR-Code koppeln“.
            </p>
            <Field label="Kopplungscode">
              {(id) => <TextInput id={id} inputMode="numeric" placeholder="123456" />}
            </Field>
          </div>
        </Dialog>
        <Dialog
          open={dialog === "warning"}
          onClose={() => setDialog("none")}
          title="Wirklich löschen?"
          width="sm"
          tone="warning"
          footer={
            <>
              <Button onClick={() => setDialog("none")}>Behalten</Button>
              <Button variant="danger" onClick={() => setDialog("none")}>
                Löschen
              </Button>
            </>
          }
        >
          <p className="px-6 pb-4 text-body text-muted">
            „Wohnzimmer“ wird auf allen Geräten gelöscht. Das lässt sich nicht rückgängig machen.
          </p>
        </Dialog>
        <Dialog
          open={dialog === "three"}
          onClose={() => setDialog("none")}
          title="Eintrag verschieben"
          footer={
            <>
              <Button onClick={() => setDialog("none")}>Abbrechen</Button>
              <Button onClick={() => setDialog("none")}>Kopie behalten</Button>
              <Button variant="primary" onClick={() => setDialog("none")}>
                Verschieben
              </Button>
            </>
          }
        >
          <p className="px-6 pb-4 text-body text-muted">
            Auf dem Handy teilen sich die Buttons die Zeile. Was nicht passt, bekommt eine eigene Zeile in voller
            Breite, der Haupt-Button steht zuletzt.
          </p>
        </Dialog>
        <Toaster store={toasts} />
      </Sub>
      <Sub title="Leerer Zustand">
        <Panel>
          <EmptyState
            art={<Nyu shell="mail" mood="sleepy" size={140} title="" />}
            title={keepKaomojiTogether("Posteingang leer! Zeit für einen Tee (っ˘ω˘ς)")}
            body="Neue Mails tauchen hier von selbst auf."
            action={<Button size="sm">Ordner wechseln</Button>}
          />
        </Panel>
      </Sub>
      <Rules
        items={[
          [true, "Ein primärer Button pro Ansicht. Er trägt die Aktion, für die die Ansicht da ist."],
          [true, "Buttons sind Pillen (rounded-full), Eingaben 10 px, Karten 16 px, Dialoge 22 px."],
          [true, "Schatten nur für das, was schwebt: Menüs, Dialoge, Toasts, Popover. Karten haben eine Haarlinie."],
          [true, "Löschen fragt in einem kleinen Warn-Dialog nach. Der Button sagt das Verb („Löschen“), nicht „OK“."],
          [false, "Keine eigenen Varianten pro App. Fehlt eine, kommt sie ins Paket."],
          [false, "Kein Kaomoji in Buttons, die etwas mit Daten tun (Löschen, Senden, Speichern)."],
        ]}
      />
    </Section>
  );
}
