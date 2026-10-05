import type {
  AboutMetadata,
  CheckMenuItemOptions,
  MenuItemOptions,
  PredefinedMenuItemOptions,
} from "@tauri-apps/api/menu";
import { Menu, Submenu } from "@tauri-apps/api/menu";
import { detectPlatform } from "../components/TitleBar";

/**
 * The suite's macOS menu bar (docs/macos.md). Every app gets the same skeleton in Apple's order:
 * the app menu, Ablage, Bearbeiten, Darstellung, its own menus, Fenster, Hilfe. The app only fills
 * in its entries. Settings live in the app menu under ⌘, (not in the window), and the standard
 * items are AppKit's own, so they behave and are named like in every other Mac app.
 */

/** One entry the app adds. `checked` makes it a check item. */
export type MacMenuEntry =
  | "separator"
  | {
      id?: string;
      text: string;
      /** A Tauri accelerator: `CmdOrCtrl+Shift+N`. Shown as `⇧⌘N`. */
      accelerator?: string;
      enabled?: boolean;
      checked?: boolean;
      action: () => void;
    };

export interface MacMenuOptions {
  /** The app's name as in the Dock: "UwUMail". */
  appName: string;
  lang?: "de" | "en";
  /** The About panel. Leave it out to use `tauri.conf.json`. */
  about?: AboutMetadata;
  /** App menu → Einstellungen … (⌘,). Leave it out for an app without settings. */
  onSettings?: () => void;
  /** More of the app menu, after the settings: "Nach Updates suchen …", an account. */
  app?: MacMenuEntry[];
  /** Ablage, before "Fenster schließen": new, open, save, export. */
  file?: MacMenuEntry[];
  /** Bearbeiten, after the standard items: find, replace. */
  edit?: MacMenuEntry[];
  /** Darstellung, before full screen: sidebar, zoom, reading mode. */
  view?: MacMenuEntry[];
  /** The app's own menus, between Darstellung and Fenster: "Postfach", "Verbindung". */
  menus?: { text: string; items: MacMenuEntry[] }[];
  /** Hilfe: the website, release notes, report a problem. macOS adds the search field. */
  help?: MacMenuEntry[];
}

export const MAC_MENU_LABELS = {
  de: {
    about: (app: string) => `Über ${app}`,
    settings: "Einstellungen …",
    services: "Dienste",
    hide: (app: string) => `${app} ausblenden`,
    hideOthers: "Andere ausblenden",
    showAll: "Alle einblenden",
    quit: (app: string) => `${app} beenden`,
    file: "Ablage",
    closeWindow: "Fenster schließen",
    edit: "Bearbeiten",
    undo: "Widerrufen",
    redo: "Wiederholen",
    cut: "Ausschneiden",
    copy: "Kopieren",
    paste: "Einsetzen",
    selectAll: "Alles auswählen",
    view: "Darstellung",
    fullscreen: "Vollbild",
    window: "Fenster",
    minimize: "Im Dock ablegen",
    zoom: "Zoomen",
    bringAllToFront: "Alle nach vorne bringen",
    help: "Hilfe",
  },
  en: {
    about: (app: string) => `About ${app}`,
    settings: "Settings…",
    services: "Services",
    hide: (app: string) => `Hide ${app}`,
    hideOthers: "Hide Others",
    showAll: "Show All",
    quit: (app: string) => `Quit ${app}`,
    file: "File",
    closeWindow: "Close Window",
    edit: "Edit",
    undo: "Undo",
    redo: "Redo",
    cut: "Cut",
    copy: "Copy",
    paste: "Paste",
    selectAll: "Select All",
    view: "View",
    fullscreen: "Full Screen",
    window: "Window",
    minimize: "Minimize",
    zoom: "Zoom",
    bringAllToFront: "Bring All to Front",
    help: "Help",
  },
} as const;

type Item = MenuItemOptions | CheckMenuItemOptions | PredefinedMenuItemOptions;

/** One submenu of the bar as plain data; `role` marks the menus macOS adds to. */
export interface MacSubmenuSpec {
  text: string;
  role?: "window" | "help";
  items: Item[];
}

const separator: PredefinedMenuItemOptions = { item: "Separator" };

function entries(list: MacMenuEntry[] | undefined, prefix: string): Item[] {
  return (list ?? []).map((entry, index) => {
    if (entry === "separator") return separator;
    const { id = `${prefix}.${index}`, text, accelerator, enabled = true, checked, action } = entry;
    const item: MenuItemOptions = { id, text, accelerator, enabled, action: () => action() };
    return checked === undefined ? item : ({ ...item, checked } satisfies CheckMenuItemOptions);
  });
}

/** A separator, then `items`, unless there are none. */
function section(items: Item[]) {
  return items.length ? [separator, ...items] : [];
}

/** The whole menu bar as plain data, without touching Tauri. */
export function macMenuSpec(options: MacMenuOptions): MacSubmenuSpec[] {
  const { appName, lang = "de", about = null, onSettings } = options;
  const t = MAC_MENU_LABELS[lang];
  const settings: Item[] = onSettings
    ? [{ id: "app.settings", text: t.settings, accelerator: "CmdOrCtrl+,", action: () => onSettings() }]
    : [];
  const app: Item[] = [
    { item: { About: about }, text: t.about(appName) },
    ...section([...settings, ...entries(options.app, "app")]),
    separator,
    { item: "Services", text: t.services },
    separator,
    { item: "Hide", text: t.hide(appName) },
    { item: "HideOthers", text: t.hideOthers },
    { item: "ShowAll", text: t.showAll },
    separator,
    { item: "Quit", text: t.quit(appName) },
  ];
  const file = entries(options.file, "file");
  return [
    { text: appName, items: app },
    {
      text: t.file,
      items: [...file, ...(file.length ? [separator] : []), { item: "CloseWindow", text: t.closeWindow }],
    },
    {
      text: t.edit,
      items: [
        { item: "Undo", text: t.undo },
        { item: "Redo", text: t.redo },
        separator,
        { item: "Cut", text: t.cut },
        { item: "Copy", text: t.copy },
        { item: "Paste", text: t.paste },
        { item: "SelectAll", text: t.selectAll },
        ...section(entries(options.edit, "edit")),
      ],
    },
    {
      text: t.view,
      items: [
        ...entries(options.view, "view"),
        ...(options.view?.length ? [separator] : []),
        { item: "Fullscreen", text: t.fullscreen },
      ],
    },
    ...(options.menus ?? []).map((menu, index) => ({ text: menu.text, items: entries(menu.items, `menu${index}`) })),
    {
      text: t.window,
      role: "window",
      items: [
        { item: "Minimize", text: t.minimize },
        { item: "Maximize", text: t.zoom },
        separator,
        { item: "BringAllToFront", text: t.bringAllToFront },
      ],
    },
    { text: t.help, role: "help", items: entries(options.help, "help") },
  ];
}

/**
 * Sets the macOS menu bar. Call it on start and again when the language or an entry changes; it
 * replaces the whole bar. Does nothing off macOS (returns null): there the window has its own
 * title bar. Needs the capability `core:menu:default`.
 */
export async function setMacMenu(options: MacMenuOptions, platform = detectPlatform()): Promise<Menu | null> {
  if (platform !== "mac") return null;
  const submenus = await Promise.all(
    macMenuSpec(options).map(async (spec) => ({
      spec,
      submenu: await Submenu.new({ text: spec.text, items: spec.items }),
    })),
  );
  const menu = await Menu.new({ items: submenus.map(({ submenu }) => submenu) });
  await menu.setAsAppMenu();
  for (const { spec, submenu } of submenus) {
    if (spec.role === "window") await submenu.setAsWindowsMenuForNSApp();
    if (spec.role === "help") await submenu.setAsHelpMenuForNSApp();
  }
  return menu;
}
