import { useEffect, useState } from "react";
import {
  Button,
  CommandPalette,
  detectPlatform,
  Icon,
  ICONS,
  matchesAccelerator,
  shortcutText,
  StatusDot,
  type CommandGroup,
} from "../../src";
import { Panel, Rules, Section, Sub } from "./ui";

const OPEN = "CmdOrCtrl+K";

export function CommandPaletteSection() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [last, setLast] = useState("–");
  const platform = detectPlatform();
  const apple = platform === "mac";

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (!matchesAccelerator(event, OPEN, apple)) return;
      event.preventDefault();
      setQuery("");
      setOpen(true);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [apple]);

  const done = (what: string) => () => {
    setLast(what);
    setOpen(false);
  };
  const key = (accelerator: string) => <kbd>{shortcutText(accelerator, platform)}</kbd>;

  const groups: CommandGroup[] = [
    {
      id: "hosts",
      title: "Hosts",
      items: [
        {
          id: "nas",
          text: "NAS",
          label: "NAS",
          icon: <Icon icon={ICONS.server} />,
          detail: <span className="uwu-mono">admin@192.0.2.10</span>,
          trailing: (
            <>
              <StatusDot state="online" />
              offen in Tab 2
            </>
          ),
          onSelect: done("Zu Tab 2 gewechselt"),
        },
        {
          id: "pi",
          text: "Pi im Keller",
          label: "Pi im Keller",
          keywords: ["raspberry"],
          icon: <Icon icon={ICONS.computer} />,
          detail: <span className="uwu-mono">pi@198.51.100.7</span>,
          trailing: "verbinden",
          onSelect: ({ modifier }) => done(modifier ? "Pi in neuem Fenster" : "Mit Pi verbunden")(),
        },
        {
          id: "old",
          text: "Alter Server",
          label: "Alter Server",
          icon: <Icon icon={ICONS.server} />,
          detail: "nicht erreichbar",
          disabled: true,
          onSelect: () => {},
        },
      ],
    },
    {
      id: "actions",
      title: "Aktionen",
      items: [
        {
          id: "tab",
          text: "Neuer Tab",
          label: "Neuer Tab",
          icon: <Icon icon={ICONS.terminal} />,
          trailing: key("CmdOrCtrl+T"),
          onSelect: done("Neuer Tab"),
        },
        {
          id: "settings",
          text: "Einstellungen",
          label: "Einstellungen",
          icon: <Icon icon={ICONS.settings} />,
          trailing: key("CmdOrCtrl+,"),
          onSelect: done("Einstellungen"),
        },
      ],
    },
  ];

  return (
    <Section
      id="befehlspalette"
      title="Befehlspalette"
      lead={
        <>
          Eine Suche über alles, was die App kann: Hosts, offene Tabs, Aktionen. Öffnet mit {key(OPEN)}, die Tastatur
          bleibt im Suchfeld, Pfeile wählen, Enter führt aus, Esc schließt.
        </>
      }
    >
      <Panel className="flex flex-wrap items-center gap-3">
        <Button
          variant="primary"
          onClick={() => {
            setQuery("");
            setOpen(true);
          }}
        >
          Befehlspalette öffnen
        </Button>
        <p className="text-meta text-muted" aria-live="polite">
          Zuletzt ausgeführt: {last}
        </p>
      </Panel>
      <CommandPalette
        open={open}
        onClose={() => setOpen(false)}
        groups={groups}
        query={query}
        onQueryChange={setQuery}
      />
      <Sub title="Regeln">
        <Rules
          items={[
            [true, "Jede Zeile hat einen Klartext (text) für Suche und Screenreader."],
            [true, "Der Befehl schließt die Palette selbst (onClose), wenn er fertig ist."],
            [true, "Status rechts immer mit Text, nie nur ein Punkt."],
            [false, "Keine Formulare oder Rückfragen in der Palette, dafür ein Dialog."],
          ]}
        />
      </Sub>
    </Section>
  );
}
