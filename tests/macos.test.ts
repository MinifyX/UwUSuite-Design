import { deflateSync } from "node:zlib";
import { beforeEach, describe, expect, it, vi } from "vitest";
// @ts-expect-error plain JavaScript module without types
import { checkIcns, decodePng, ICNS_SIZES, packBits, writeIcns } from "../bin/icns.mjs";
import { MAC_GRID, macMasterSvg, TRAY_STROKE, trayTemplateSvg } from "../bin/mac-icon.mjs";
import { macShortcut, shortcutText, withShortcut } from "../src/lib/shortcuts";
import { macMenuSpec, setMacMenu, type MacSubmenuSpec } from "../src/tauri/mac-menu";
import { hideWindowOnClose, MAC_QUIT_EVENT, onMacQuit } from "../src/tauri/mac-lifecycle";

const tauri = vi.hoisted(() => ({
  submenus: [] as { text: string; items: unknown[]; roles: string[] }[],
  appMenu: 0,
  listeners: new Map<string, () => Promise<void>>(),
  invoked: [] as [string, unknown][],
  closeHandler: undefined as ((event: { preventDefault: () => void }) => void) | undefined,
  hidden: 0,
}));

vi.mock("@tauri-apps/api/menu", () => ({
  Submenu: {
    new: async ({ text, items }: { text: string; items: unknown[] }) => {
      const entry = { text, items, roles: [] as string[] };
      tauri.submenus.push(entry);
      return {
        setAsWindowsMenuForNSApp: async () => void entry.roles.push("window"),
        setAsHelpMenuForNSApp: async () => void entry.roles.push("help"),
      };
    },
  },
  Menu: { new: async () => ({ setAsAppMenu: async () => void tauri.appMenu++ }) },
}));
vi.mock("@tauri-apps/api/event", () => ({
  listen: async (name: string, handler: () => Promise<void>) => {
    tauri.listeners.set(name, handler);
    return () => tauri.listeners.delete(name);
  },
}));
vi.mock("@tauri-apps/api/core", () => ({
  invoke: async (command: string, args: unknown) => void tauri.invoked.push([command, args]),
}));
vi.mock("@tauri-apps/api/window", () => ({
  getCurrentWindow: () => ({
    onCloseRequested: async (handler: typeof tauri.closeHandler) => {
      tauri.closeHandler = handler;
      return () => (tauri.closeHandler = undefined);
    },
    hide: async () => void tauri.hidden++,
  }),
}));

beforeEach(() => {
  tauri.submenus = [];
  tauri.appMenu = 0;
  tauri.listeners.clear();
  tauri.invoked = [];
  tauri.closeHandler = undefined;
  tauri.hidden = 0;
});

describe("shortcuts", () => {
  it("writes the Mac way: symbols in Apple's order, no plus signs", () => {
    expect(macShortcut("CmdOrCtrl+S")).toBe("⌘S");
    expect(macShortcut("Shift+CmdOrCtrl+S")).toBe("⇧⌘S");
    expect(macShortcut("Ctrl+Alt+Shift+Cmd+K")).toBe("⌃⌥⇧⌘K");
    expect(macShortcut("CmdOrCtrl+,")).toBe("⌘,");
    expect(macShortcut("CmdOrCtrl++")).toBe("⌘+");
    expect(macShortcut("Ctrl+Tab")).toBe("⌃⇥");
    expect(macShortcut("CmdOrCtrl+KeyM")).toBe("⌘M");
  });

  it("writes Windows and Linux in the person's language", () => {
    expect(shortcutText("CmdOrCtrl+Shift+S", "windows")).toBe("Strg+Umschalt+S");
    expect(shortcutText("CmdOrCtrl+Shift+S", "linux", "en")).toBe("Ctrl+Shift+S");
    expect(shortcutText("CmdOrCtrl+Comma", "windows")).toBe("Strg+,");
    expect(shortcutText("Alt+Digit1", "windows")).toBe("Alt+1");
    expect(withShortcut("Einstellungen", "CmdOrCtrl+,", "mac")).toBe("Einstellungen (⌘,)");
  });
});

describe("mac menu", () => {
  const texts = (spec: MacSubmenuSpec) =>
    spec.items.map((item) =>
      "item" in item
        ? typeof item.item === "string"
          ? item.item
          : "About"
        : `${item.text}${item.accelerator ? ` ${item.accelerator}` : ""}`,
    );

  it("has Apple's skeleton with the settings in the app menu", () => {
    const spec = macMenuSpec({ appName: "UwUMail", onSettings: () => undefined });
    expect(spec.map((menu) => menu.text)).toEqual([
      "UwUMail",
      "Ablage",
      "Bearbeiten",
      "Darstellung",
      "Fenster",
      "Hilfe",
    ]);
    expect(texts(spec[0]!)).toEqual([
      "About",
      "Separator",
      "Einstellungen … CmdOrCtrl+,",
      "Separator",
      "Services",
      "Separator",
      "Hide",
      "HideOthers",
      "ShowAll",
      "Separator",
      "Quit",
    ]);
    expect(spec[0]!.items[0]).toMatchObject({ text: "Über UwUMail" });
    expect(spec[0]!.items.at(-1)).toMatchObject({ text: "UwUMail beenden" });
    expect(spec.find((menu) => menu.role === "window")?.text).toBe("Fenster");
    expect(spec.find((menu) => menu.role === "help")?.text).toBe("Hilfe");
  });

  it("puts the app's entries where they belong", () => {
    const action = vi.fn();
    const spec = macMenuSpec({
      appName: "UwUMirror",
      lang: "en",
      file: [{ text: "New Connection", accelerator: "CmdOrCtrl+N", action }],
      view: [{ text: "Sidebar", checked: true, action }, "separator", { text: "Zoom In", action }],
      menus: [{ text: "Connection", items: [{ id: "conn.end", text: "Disconnect", enabled: false, action }] }],
      help: [{ text: "Website", action }],
    });
    expect(spec.map((menu) => menu.text)).toEqual([
      "UwUMirror",
      "File",
      "Edit",
      "View",
      "Connection",
      "Window",
      "Help",
    ]);
    // No settings: the app menu goes straight from About to Services.
    expect(texts(spec[0]!).slice(0, 3)).toEqual(["About", "Separator", "Services"]);
    expect(texts(spec[1]!)).toEqual(["New Connection CmdOrCtrl+N", "Separator", "CloseWindow"]);
    expect(texts(spec[3]!)).toEqual(["Sidebar", "Separator", "Zoom In", "Separator", "Fullscreen"]);
    expect(spec[3]!.items[0]).toMatchObject({ id: "view.0", checked: true });
    expect(spec[4]!.items[0]).toMatchObject({ id: "conn.end", enabled: false });
    expect(texts(spec[6]!)).toEqual(["Website"]);
    (spec[1]!.items[0] as { action: (id: string) => void }).action("file.0");
    expect(action).toHaveBeenCalledOnce();
  });

  it("sets the bar and the window and help menus on a Mac only", async () => {
    expect(await setMacMenu({ appName: "UwUMail" }, "windows")).toBeNull();
    expect(tauri.submenus).toHaveLength(0);
    expect(await setMacMenu({ appName: "UwUMail" }, "mac")).not.toBeNull();
    expect(tauri.appMenu).toBe(1);
    expect(tauri.submenus.find((menu) => menu.text === "Fenster")?.roles).toEqual(["window"]);
    expect(tauri.submenus.find((menu) => menu.text === "Hilfe")?.roles).toEqual(["help"]);
  });
});

describe("mac lifecycle", () => {
  it("hides the window instead of closing it on a Mac", async () => {
    expect(await hideWindowOnClose("linux")).toBeTypeOf("function");
    expect(tauri.closeHandler).toBeUndefined();
    await hideWindowOnClose("mac");
    const preventDefault = vi.fn();
    tauri.closeHandler!({ preventDefault });
    expect(preventDefault).toHaveBeenCalled();
    expect(tauri.hidden).toBe(1);
  });

  it("saves, then answers the quit", async () => {
    await onMacQuit(async () => undefined, { platform: "mac" });
    await tauri.listeners.get(MAC_QUIT_EVENT)!();
    expect(tauri.invoked).toEqual([["finish_quit", { proceed: true }]]);
  });

  it("stays when the person stays or saving fails", async () => {
    await onMacQuit(() => false, { platform: "mac", command: "quit_answer" });
    await tauri.listeners.get(MAC_QUIT_EVENT)!();
    await onMacQuit(
      () => {
        throw new Error("disk full");
      },
      { platform: "mac" },
    );
    await tauri.listeners.get(MAC_QUIT_EVENT)!();
    expect(tauri.invoked).toEqual([
      ["quit_answer", { proceed: false }],
      ["finish_quit", { proceed: false }],
    ]);
  });

  it("listens to nothing off a Mac", async () => {
    await onMacQuit(() => true, { platform: "windows" });
    expect(tauri.listeners.size).toBe(0);
  });
});

/** An RGBA PNG with every row unfiltered; CRCs are left at zero, nobody here checks them. */
function png(size: number, rgba: (x: number, y: number) => number[]) {
  const raw: number[] = [];
  for (let y = 0; y < size; y++) {
    raw.push(0);
    for (let x = 0; x < size; x++) raw.push(...rgba(x, y));
  }
  const chunk = (type: string, body: Buffer) => {
    const head = Buffer.alloc(8);
    head.writeUInt32BE(body.length, 0);
    head.write(type, 4, "latin1");
    return Buffer.concat([head, body, Buffer.alloc(4)]);
  };
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr.set([8, 6, 0, 0, 0], 8);
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(Buffer.from(raw))),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

describe("icns", () => {
  it("decodes what it is given", () => {
    const { width, pixels } = decodePng(png(2, (x, y) => [x * 100, y * 100, 7, 255]));
    expect(width).toBe(2);
    expect([...pixels.subarray(4, 8)]).toEqual([100, 0, 7, 255]);
  });

  it("packs runs and literals so they unpack to the same length", () => {
    const channel = Buffer.from([1, 1, 1, 1, 2, 3, 4, 4, 4]);
    expect([...packBits(channel)]).toEqual([129, 1, 1, 2, 3, 128, 4]);
  });

  it("writes every size and reads back as a valid file", () => {
    const pngs = new Map<number, Buffer>(
      (ICNS_SIZES as number[]).map((size) => [size, png(size, (x) => [255, 77, 141, x % 2 ? 255 : 0])]),
    );
    const icns: Buffer = writeIcns(pngs);
    expect(checkIcns(icns)).toBe(10);
    expect(() => checkIcns(icns.subarray(0, icns.length - 1))).toThrow();
  });

  it("refuses a missing size", () => {
    expect(() => writeIcns(new Map())).toThrow(/16px/);
  });
});

describe("mac icon shapes", () => {
  const icon =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><rect width="512" height="512" rx="116"/></svg>';

  it("sets the app icon into Apple's grid", () => {
    const master: string = macMasterSvg(icon, "test");
    const margin = (MAC_GRID.canvas - MAC_GRID.tile) / 2;
    expect(master).toContain(`viewBox="0 0 1024 1024"`);
    expect(master).toContain(`<svg x="${margin}" y="${margin}" width="824" height="824" viewBox="0 0 512 512"`);
    expect(master).toContain('clip-path="url(#test-tile)"');
    expect(master).toContain('<rect width="512" height="512" rx="116"/>');
    expect(() => macMasterSvg("<svg></svg>")).toThrow(/viewBox/);
  });

  it("thickens the mono symbol for the menu bar and makes it black", () => {
    const mono = '<svg viewBox="0 0 256 256" stroke="currentColor"><g stroke-width="9"><path d="M0 0"/></g></svg>';
    const template: string = trayTemplateSvg(mono);
    expect(template).toContain(`stroke-width="${9 * TRAY_STROKE}"`);
    expect(template).toMatch(/^<svg color="#000"/);
  });
});

describe("uwu-macos crate", () => {
  it("has the package's version, since apps take it by the release tag", async () => {
    // jsdom gives import.meta.url an http scheme; vitest runs from the package root.
    const { readFileSync } = await import("node:fs");
    const cargo = readFileSync("Cargo.toml", "utf8");
    const pkg = JSON.parse(readFileSync("package.json", "utf8")) as { version: string };
    expect(cargo.match(/^version = "(.+)"$/m)?.[1]).toBe(pkg.version);
    expect(cargo).toContain(`tag = "v${pkg.version}"`);
  });
});
