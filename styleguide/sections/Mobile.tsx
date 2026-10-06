import { useState, type ReactNode } from "react";
import {
  ContextMenu,
  createToasts,
  Fab,
  FullScreenDialog,
  ICONS,
  ListRow,
  ListSection,
  MobileShell,
  MobileToaster,
  NavButton,
  Screen,
  SearchBar,
  Segmented,
  Sheet,
  SidebarHeading,
  SidebarRow,
  SplitView,
  Stepper,
  SwipeRow,
  Switch,
  TabBar,
  useHaptics,
  useKeyboardShortcut,
  useLongPress,
  type DeviceKind,
  type LongPressPoint,
} from "../../src";
import { Code, Rules, Section, Sub } from "./ui";

const TABS = [
  { id: "home", label: "Übersicht", icon: ICONS.vault },
  { id: "check", label: "Prüfung", icon: ICONS.securityCheck, badge: 2 },
  { id: "tools", label: "Generator", icon: ICONS.generate },
  { id: "settings", label: "Einstellungen", icon: ICONS.settings },
] as const;

type Tab = (typeof TABS)[number]["id"];

const ITEMS = [
  { id: "a", name: "Bank", user: "nyu@example.com", color: "var(--uwu-account-sky)" },
  { id: "b", name: "Forum", user: "nyu", color: "var(--uwu-account-violet)" },
  { id: "c", name: "Git-Server", user: "nyu@example.org", color: "var(--uwu-account-coral)" },
  { id: "d", name: "Router", user: "admin", color: "var(--uwu-account-mint)" },
  { id: "e", name: "Webmail", user: "nyu@example.net", color: "var(--uwu-account-pink)" },
];

type Item = (typeof ITEMS)[number];

function Tile({ item, size = 36 }: { item: Item; size?: number }) {
  return (
    <span
      className="grid shrink-0 place-items-center font-extrabold text-white"
      style={{ width: size, height: size, borderRadius: size * 0.28, background: item.color, fontSize: size * 0.45 }}
    >
      {item.name[0]}
    </span>
  );
}

const Avatar = ({ onClick }: { onClick?: () => void }) => (
  <button
    type="button"
    aria-label="Konto wechseln"
    onClick={onClick}
    className="grid size-9 place-items-center rounded-full bg-pink-solid text-[14px] font-bold text-on-pink"
  >
    N
  </button>
);

/** A small example app, the same code in every frame. Only the device kind differs. */
function DemoApp({ kind, portrait = false }: { kind: DeviceKind; portrait?: boolean }) {
  const [toasts] = useState(() => createToasts({ infoMs: 3000 }));
  const tap = useHaptics();
  const android = kind === "phone-android";
  const ipad = kind === "ipad";
  const [tab, setTab] = useState<Tab>("home");
  const [stack, setStack] = useState<Item[]>([]);
  const [selected, setSelected] = useState<Item>(ITEMS[0]!);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [sheet, setSheet] = useState(false);
  const [menu, setMenu] = useState<{ item: Item; at: LongPressPoint } | null>(null);
  const [sidebar, setSidebar] = useState(false);
  const [digits, setDigits] = useState(2);
  const [symbols, setSymbols] = useState(1);
  const [favourites, setFavourites] = useState<string[]>(["a"]);
  const [synced, setSynced] = useState("vor 5 Minuten");

  useKeyboardShortcut("CmdOrCtrl+N", () => setSheet(true), { enabled: ipad });

  const copy = (what: string) => {
    tap("success");
    toasts.show(`${what} kopiert`, { tone: "success", detail: "Wird in 30 s geleert" });
  };
  const open = (item: Item) => (ipad ? setSelected(item) : setStack([item]));
  const remove = (item: Item) =>
    toasts.show(`„${item.name}“ gelöscht`, { action: { label: "Rückgängig", run: () => {} } });
  const refresh = () =>
    new Promise<void>((done) =>
      setTimeout(() => {
        setSynced("gerade eben");
        toasts.show("Synchronisiert", { tone: "success", detail: "Alles aktuell" });
        done();
      }, 1200),
    );

  const shown = ITEMS.filter((item) => item.name.toLowerCase().includes(query.toLowerCase()));
  const add = <NavButton label="Neuer Eintrag" icon={ICONS.add} onClick={() => setSheet(true)} />;

  const list = (
    <ListSection header="Einträge" footer="Wischen für Aktionen, lange drücken für das Menü.">
      {shown.map((item) => (
        <ItemRow
          key={item.id}
          item={item}
          favourite={favourites.includes(item.id)}
          selected={ipad && selected.id === item.id}
          onOpen={() => open(item)}
          onMenu={(at) => setMenu({ item, at })}
          onCopy={() => copy("Passwort")}
          onFavourite={() =>
            setFavourites((list) => (list.includes(item.id) ? list.filter((id) => id !== item.id) : [...list, item.id]))
          }
          onDelete={() => remove(item)}
        />
      ))}
    </ListSection>
  );

  const detail = (item: Item, back?: () => void) => (
    <Screen
      title={item.name}
      onBack={back}
      platform={ipad ? "ipad" : undefined}
      trailing={<NavButton label="Bearbeiten" text onClick={() => setSheet(true)} />}
    >
      <div className="flex flex-col items-center gap-2 px-5 pt-2 pb-1">
        <Tile item={item} size={76} />
        <h2 className="text-[26px] font-extrabold">{item.name}</h2>
      </div>
      <ListSection>
        <ListRow label="Benutzername" title={item.user} onCopy={() => copy("Benutzername")} />
        <ListRow label="Passwort" title="••••••••••••" mono onCopy={() => copy("Passwort")} />
        <ListRow label="Website" title={`${item.name.toLowerCase()}.example.com`} onCopy={() => copy("Adresse")} />
      </ListSection>
      <ListSection>
        <ListRow title="Löschen" tone="danger" onClick={() => remove(item)} />
      </ListSection>
    </Screen>
  );

  const home = (
    <Screen
      title="Übersicht"
      largeTitle
      subtitle={`Synchronisiert ${synced}`}
      leading={android ? undefined : <Avatar />}
      trailing={android ? undefined : add}
      onRefresh={refresh}
      searchBar={
        android ? (
          <SearchBar value={query} onChange={setQuery} placeholder="Tresor durchsuchen" trailing={<Avatar />} />
        ) : undefined
      }
    >
      {list}
    </Screen>
  );

  const generator = (
    <Screen title="Generator" largeTitle>
      <ListSection header="Mindestens" footer="Die Länge wächst mit, wenn die Minimums mehr verlangen.">
        <ListRow
          title="Ziffern 0–9"
          trailing={<Stepper label="Ziffern" value={digits} onChange={setDigits} max={9} />}
        />
        <ListRow
          title="Sonderzeichen !@#$"
          trailing={<Stepper label="Sonderzeichen" value={symbols} onChange={setSymbols} max={9} />}
        />
      </ListSection>
    </Screen>
  );

  const settings = (
    <Screen title="Einstellungen" largeTitle>
      <ListSection header="Darstellung">
        <ListRow icon={ICONS.appearance} iconTone="solid" title="Design" value="System" onClick={() => {}} />
        <ListRow
          icon={ICONS.fingerprint}
          title="Mit Face ID entsperren"
          trailing={<Switch checked onChange={() => {}} label="Face ID" />}
        />
      </ListSection>
      <ListSection header="Konto">
        <ListRow icon={ICONS.account} title="nyu@example.com" subtitle="Eigener Server" onClick={() => {}} />
        <ListRow icon={ICONS.signOut} iconTone="danger" title="Abmelden" onClick={() => {}} />
      </ListSection>
    </Screen>
  );

  const check = (
    <Screen title="Prüfung" largeTitle onRefresh={refresh}>
      <ListSection header="Zu tun">
        <ListRow
          icon={ICONS.warning}
          iconTone="warning"
          title="Wiederverwendete Passwörter"
          value="2"
          onClick={() => {}}
        />
        <ListRow icon={ICONS.success} iconTone="success" title="Keine Datenlecks" onClick={() => {}} />
      </ListSection>
    </Screen>
  );

  const pages: Record<Tab, ReactNode> = { home, check, tools: generator, settings };
  const pushed = stack[stack.length - 1];

  return (
    <MobileShell kind={kind}>
      {ipad && tab === "home" ? (
        <SplitView
          overlaySidebar={portrait}
          sidebarOpen={sidebar}
          onSidebarOpenChange={setSidebar}
          sidebar={
            <div className="uwu-split-sidebar-scroll pt-10">
              <SidebarHeading>Tresor</SidebarHeading>
              <SidebarRow label="Alle Einträge" icon={ICONS.vault} count={ITEMS.length} current onClick={() => {}} />
              <SidebarRow label="Favoriten" icon={ICONS.favorite} count={favourites.length} onClick={() => {}} />
              <SidebarHeading>Ordner</SidebarHeading>
              <SidebarRow label="Arbeit" icon={ICONS.folder} count={3} onClick={() => {}} />
            </div>
          }
          list={
            <Screen
              title="Alle Einträge"
              largeTitle
              platform="ipad"
              leading={
                portrait ? (
                  <NavButton label="Seitenleiste" icon={ICONS.sidebar} onClick={() => setSidebar(true)} />
                ) : undefined
              }
              trailing={add}
              onRefresh={refresh}
            >
              {list}
            </Screen>
          }
          detail={detail(selected)}
        />
      ) : (
        <>
          {pages[tab]}
          {pushed && (
            <div className="uwu-push-in absolute inset-0" data-platform={android ? "android" : "ios"}>
              {detail(pushed, () => setStack([]))}
            </div>
          )}
        </>
      )}
      {!pushed && (
        <TabBar
          tabs={TABS}
          value={tab}
          onChange={(next) => {
            setTab(next);
            setSearchOpen(false);
          }}
          search={
            tab === "home"
              ? { open: searchOpen, onOpenChange: setSearchOpen, value: query, onChange: setQuery }
              : undefined
          }
        />
      )}
      {android && tab === "home" && !pushed && (
        <Fab label="Neuer Eintrag" icon={ICONS.add} onClick={() => setSheet(true)} />
      )}
      {android ? (
        <FullScreenDialog
          open={sheet}
          onClose={() => setSheet(false)}
          title="Neuer Eintrag"
          action={{ label: "Sichern", onClick: () => setSheet(false) }}
        >
          <EditForm />
        </FullScreenDialog>
      ) : (
        <Sheet
          open={sheet}
          onClose={() => setSheet(false)}
          title="Neuer Eintrag"
          detents={["medium", "large"]}
          leading={<NavButton label="Abbrechen" text onClick={() => setSheet(false)} />}
          trailing={<NavButton label="Sichern" text tint onClick={() => setSheet(false)} />}
        >
          <EditForm />
        </Sheet>
      )}
      <ContextMenu
        open={!!menu}
        onClose={() => setMenu(null)}
        at={menu?.at}
        preview={
          menu && (
            <div className="flex items-center gap-3.5 px-4.5 py-3">
              <Tile item={menu.item} />
              <span className="font-semibold">{menu.item.name}</span>
            </div>
          )
        }
        items={[
          { label: "Passwort kopieren", icon: ICONS.copy, onSelect: () => copy("Passwort") },
          { label: "Benutzername kopieren", icon: ICONS.account, onSelect: () => copy("Benutzername") },
          { label: "Als Send teilen", icon: ICONS.share, onSelect: () => {} },
          "separator",
          { label: "Löschen", icon: ICONS.delete, danger: true, onSelect: () => menu && remove(menu.item) },
        ]}
      />
      <MobileToaster store={toasts} />
    </MobileShell>
  );
}

function ItemRow({
  item,
  favourite,
  selected,
  onOpen,
  onMenu,
  onCopy,
  onFavourite,
  onDelete,
}: {
  item: Item;
  favourite: boolean;
  selected: boolean;
  onOpen: () => void;
  onMenu: (at: LongPressPoint) => void;
  onCopy: () => void;
  onFavourite: () => void;
  onDelete: () => void;
}) {
  const longPress = useLongPress(onMenu);
  return (
    <SwipeRow
      leading={[
        { label: favourite ? "Entfernen" : "Favorit", icon: ICONS.favorite, tone: "warning", onSelect: onFavourite },
      ]}
      trailing={[
        { label: "Kopieren", icon: ICONS.copy, tone: "accent", onSelect: onCopy },
        { label: "Löschen", icon: ICONS.delete, tone: "danger", onSelect: onDelete },
      ]}
    >
      <ListRow
        icon={<Tile item={item} />}
        iconTone="none"
        title={item.name}
        subtitle={item.user}
        selected={selected}
        onClick={onOpen}
        longPress={longPress}
        style={{ minHeight: 64 }}
      />
    </SwipeRow>
  );
}

function EditForm() {
  return (
    <ListSection>
      <ListRow
        data-uwu-field=""
        label="Name"
        title={<input className="w-full bg-transparent outline-none" defaultValue="" placeholder="Neuer Eintrag" />}
      />
      <ListRow
        data-uwu-field=""
        label="Benutzername"
        title={<input className="w-full bg-transparent outline-none" placeholder="nyu@example.com" />}
      />
    </ListSection>
  );
}

const FRAMES: { kind: DeviceKind; name: string; className: string }[] = [
  { kind: "phone-ios", name: "iPhone", className: "sg-device sg-iphone" },
  { kind: "phone-android", name: "Android", className: "sg-device sg-android" },
];

export function Mobile() {
  const [ipadOrientation, setIpadOrientation] = useState<"landscape" | "portrait">("landscape");
  return (
    <Section
      id="mobil"
      title="Mobil"
      lead="iPhone, iPad und Android teilen eine App, aber jede Plattform fühlt sich wie sie selbst an: Liquid Glass auf iOS 26, Material 3 auf Android, Seitenleiste und schwebende Tabs auf dem iPad. Die Rahmen unten sind echte Komponenten, zum Ausprobieren: wischen, lange drücken, nach unten ziehen."
    >
      <div className="flex flex-wrap justify-center gap-10">
        {FRAMES.map((frame) => (
          <figure key={frame.kind} className="m-0 flex flex-col items-center gap-3">
            <div className={frame.className}>
              <DemoApp kind={frame.kind} />
            </div>
            <figcaption className="text-meta font-semibold text-muted">{frame.name}</figcaption>
          </figure>
        ))}
      </div>
      <figure className="m-0 flex flex-col items-center gap-3">
        <Segmented
          label="Ausrichtung"
          value={ipadOrientation}
          onChange={setIpadOrientation}
          options={[
            { value: "landscape", label: "Querformat" },
            { value: "portrait", label: "Hochformat" },
          ]}
        />
        <div className="max-w-full overflow-x-auto p-4">
          <div className={`sg-device sg-ipad sg-ipad-${ipadOrientation}`}>
            <DemoApp key={ipadOrientation} kind="ipad" portrait={ipadOrientation === "portrait"} />
          </div>
        </div>
        <figcaption className="text-meta font-semibold text-muted">iPad · ⌘N legt einen Eintrag an</figcaption>
      </figure>
      <Sub title="Plattformen">
        <div className="grid gap-4 md:grid-cols-3">
          <Rules
            items={[
              [
                true,
                "iPhone: schwebende Glas-Tableiste unten, runder Such-Knopf daneben; das Suchfeld fährt über die Tastatur.",
              ],
              [true, "„+“ oben rechts, Konto-Avatar oben links, große Titel, die beim Scrollen in die Leiste wandern."],
              [true, "Bearbeiten in Sheets mit Abbrechen links und Sichern rechts; Toasts kommen von oben."],
            ]}
          />
          <Rules
            items={[
              [true, "iPad: Tableiste oben in der Mitte, Seitenleiste | Liste | Detail, im Hochformat als Overlay."],
              [true, "Sheets als zentrierte Form-Sheets, ⌘F sucht, ⌘N legt an."],
              [false, "Keine Telefon-Stapel auf dem iPad: Details öffnen sich rechts daneben."],
            ]}
          />
          <Rules
            items={[
              [
                true,
                "Android: Material-3-Navigationsleiste mit Pillen-Indikator, Suchleiste mit Avatar oben, FAB für „+“.",
              ],
              [true, "Bottom-Sheets mit Griff, Bearbeiten als Vollbild-Dialog, Snackbar mit „Rückgängig“."],
              [true, "Zurück wischen von beiden Rändern (Predictive Back)."],
            ]}
          />
        </div>
      </Sub>
      <Sub title="Überall">
        <Rules
          items={[
            [true, "Jede App wählt ihre Tabs selbst (drei bis fünf), Einstellungen kommen zuletzt."],
            [true, "Eine Übersichtsseite statt einer Schublade: Bereiche, Typen, Ordner als gruppierte Listen."],
            [true, "Feld antippen kopiert, mit Toast und Haptik. Wischaktionen gibt es auch im Kontextmenü."],
            [true, "Nach unten ziehen synchronisiert. Haptik nur für Bestätigungen, nie als Dauerfeuer."],
            [
              false,
              "Auf iOS keine Update-Einstellungen (App Store). Android behält die Update-Prüfung für die APK von GitHub.",
            ],
            [false, "Glas nie für Fließtext. Bei „Transparenz reduzieren“ und hohem Kontrast wird es deckend."],
          ]}
        />
      </Sub>
      <Sub title="Code">
        <Code>{`import { MobileShell, Screen, ListSection, ListRow, TabBar, useHaptics } from "@uwusuite/design";

<MobileShell>                       {/* erkennt iPhone, iPad, Android */}
  <Screen title="Tresor" largeTitle onRefresh={sync}
          leading={<AccountAvatar />} trailing={<NavButton label="Neu" icon={ICONS.add} />}>
    <ListSection header="Favoriten">
      <ListRow label="Benutzername" title={user} onCopy={() => copy(user)} />
    </ListSection>
  </Screen>
  <TabBar tabs={tabs} value={tab} onChange={setTab} search={search} />
  <MobileToaster store={toasts} />
</MobileShell>`}</Code>
      </Sub>
    </Section>
  );
}
