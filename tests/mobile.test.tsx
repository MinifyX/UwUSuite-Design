import { act, fireEvent, render, screen } from "@testing-library/react";
import { Copy, KeyRound, Plus, Settings, ShieldCheck, Star, Trash2, Vault } from "lucide-react";
import { useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createToasts } from "../src/components/Toaster";
import { ContextMenu } from "../src/mobile/ContextMenu";
import { Fab, MobileToaster, Stepper } from "../src/mobile/Controls";
import { useKeyboardShortcut, useLongPress } from "../src/mobile/hooks";
import { UwuLabels } from "../src/lib/labels";
import { ListRow, ListSection } from "../src/mobile/List";
import { Screen } from "../src/mobile/NavBar";
import { Sheet } from "../src/mobile/Sheet";
import { MobileShell } from "../src/mobile/Shell";
import { SidebarRow, SplitView } from "../src/mobile/SplitView";
import { SwipeRow } from "../src/mobile/SwipeRow";
import { TabBar } from "../src/mobile/TabBar";

afterEach(() => vi.useRealTimers());

const TABS = [
  { id: "vault", label: "Tresor", icon: Vault },
  { id: "check", label: "Prüfung", icon: ShieldCheck, badge: 3 },
  { id: "settings", label: "Einstellungen", icon: Settings },
] as const;

type Tab = (typeof TABS)[number]["id"];

function Tabs({ kind }: { kind: "phone-ios" | "phone-android" | "ipad" }) {
  const [tab, setTab] = useState<Tab>("vault");
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  return (
    <MobileShell kind={kind}>
      <TabBar
        tabs={TABS}
        value={tab}
        onChange={setTab}
        search={{ open, onOpenChange: setOpen, value: query, onChange: setQuery }}
      />
    </MobileShell>
  );
}

describe("TabBar", () => {
  it("marks the current tab and switches", () => {
    render(<Tabs kind="phone-ios" />);
    expect(screen.getByRole("button", { name: "Tresor" }).getAttribute("aria-current")).toBe("page");
    fireEvent.click(screen.getByRole("button", { name: /Prüfung/ }));
    expect(screen.getByRole("button", { name: /Prüfung/ }).getAttribute("aria-current")).toBe("page");
  });

  it("opens the search field from the glass button on the iPhone", () => {
    render(<Tabs kind="phone-ios" />);
    fireEvent.click(screen.getByRole("button", { name: "Suchen" }));
    const field = screen.getByRole("searchbox");
    expect(document.activeElement).toBe(field);
    fireEvent.change(field, { target: { value: "git" } });
    fireEvent.click(screen.getByRole("button", { name: "Suche leeren" }));
    expect((screen.getByRole("searchbox") as HTMLInputElement).value).toBe("");
    // The back button and the field share one row in place of the tab bar.
    const back = screen.getByRole("button", { name: "Zurück" });
    expect(back.parentElement).toBe(screen.getByRole("search").parentElement);
    expect(screen.queryByRole("navigation")).toBeNull();
    fireEvent.click(back);
    expect(screen.queryByRole("searchbox")).toBeNull();
    expect(screen.getByRole("navigation")).toBeTruthy();
  });

  it("is a navigation bar without search button on Android, a top bar on the iPad", () => {
    const { unmount } = render(<Tabs kind="phone-android" />);
    expect(screen.getByRole("navigation").dataset.platform).toBe("android");
    expect(screen.queryByRole("button", { name: "Suchen" })).toBeNull();
    unmount();
    render(<Tabs kind="ipad" />);
    expect(screen.getByRole("navigation").dataset.platform).toBe("ipad");
  });
});

describe("Screen", () => {
  it("shows the large title, the back button and the slots", () => {
    const back = vi.fn();
    render(
      <MobileShell kind="phone-ios">
        <Screen title="Tresor" largeTitle onBack={back} trailing={<button type="button">Neu</button>}>
          <p>Inhalt</p>
        </Screen>
      </MobileShell>,
    );
    expect(screen.getByRole("heading", { level: 1, name: "Tresor" })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Zurück" }));
    expect(back).toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Neu" })).toBeTruthy();
  });
});

describe("ListRow", () => {
  it("copies on tap and says so to screen readers", () => {
    const copy = vi.fn();
    render(
      <ListSection header="Zugang">
        <ListRow label="Benutzername" title="nyu@example.com" onCopy={copy} />
      </ListSection>,
    );
    const row = screen.getByRole("button", { name: /Benutzername.*nyu@example\.com.*kopieren/ });
    fireEvent.click(row);
    expect(copy).toHaveBeenCalledOnce();
  });

  it("takes the copy word from UwuLabels, or copyLabel for one row", () => {
    render(
      <UwuLabels labels="en">
        <ListRow label="Username" title="nyu@example.com" onCopy={() => {}} />
        <ListRow label="Code" title="123 456" onCopy={() => {}} copyLabel="copy code" />
      </UwuLabels>,
    );
    expect(screen.getByRole("button", { name: /Username.*nyu@example\.com, copy$/ })).toBeTruthy();
    expect(screen.getByRole("button", { name: /Code.*123 456, copy code$/ })).toBeTruthy();
    expect(screen.queryByText(/kopieren/)).toBeNull();
  });

  it("stays pressable with its own buttons inside", () => {
    const open = vi.fn();
    const reveal = vi.fn();
    render(
      <ListRow
        title="Passwort"
        icon={KeyRound}
        onClick={open}
        trailing={
          <button type="button" onClick={reveal}>
            Zeigen
          </button>
        }
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Zeigen" }));
    expect(reveal).toHaveBeenCalled();
    expect(open).not.toHaveBeenCalled();
    const row = screen.getAllByRole("button")[0]!;
    fireEvent.keyDown(row, { key: "Enter" });
    expect(open).toHaveBeenCalledOnce();
  });

  it("is plain text without an action", () => {
    render(<ListRow title="Version" value="1.7.0" />);
    expect(screen.queryByRole("button")).toBeNull();
  });
});

describe("SwipeRow", () => {
  it("keeps closed actions away from the keyboard and screen readers", () => {
    render(
      <SwipeRow
        leading={[{ label: "Favorit", icon: Star, tone: "warning", onSelect: () => {} }]}
        trailing={[{ label: "Löschen", icon: Trash2, tone: "danger", onSelect: () => {} }]}
      >
        <ListRow title="GitHub" onClick={() => {}} />
      </SwipeRow>,
    );
    const remove = screen.getByText("Löschen").closest("button")!;
    expect(remove.tabIndex).toBe(-1);
    expect(remove.parentElement!.getAttribute("aria-hidden")).toBe("true");
  });
});

describe("Stepper", () => {
  it("steps inside its range", () => {
    function Harness() {
      const [value, setValue] = useState(0);
      return <Stepper label="Ziffern" value={value} onChange={setValue} max={2} />;
    }
    render(<Harness />);
    const less = screen.getByRole("button", { name: "Weniger: Ziffern" }) as HTMLButtonElement;
    const more = screen.getByRole("button", { name: "Mehr: Ziffern" }) as HTMLButtonElement;
    expect(less.disabled).toBe(true);
    fireEvent.click(more);
    fireEvent.keyDown(more, { key: "ArrowUp" });
    expect(more.disabled).toBe(true);
    expect(less.disabled).toBe(false);
  });
});

describe("Sheet", () => {
  it("opens as a modal dialog in the shell and closes on Escape", () => {
    vi.useFakeTimers();
    function Harness() {
      const [open, setOpen] = useState(true);
      return (
        <MobileShell kind="phone-ios">
          <Sheet open={open} onClose={() => setOpen(false)} title="Neuer Eintrag" detents={["medium", "large"]}>
            <input aria-label="Name" />
          </Sheet>
        </MobileShell>
      );
    }
    render(<Harness />);
    const dialog = screen.getByRole("dialog", { name: "Neuer Eintrag" });
    expect(dialog.dataset.detent).toBe("large");
    expect(dialog.closest(".uwu-mshell")).toBeTruthy();
    fireEvent.keyDown(dialog, { key: "Escape" });
    act(() => vi.advanceTimersByTime(400));
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("is a centred form sheet on the iPad", () => {
    render(
      <MobileShell kind="ipad">
        <Sheet open onClose={() => {}} title="Ordner">
          Inhalt
        </Sheet>
      </MobileShell>,
    );
    expect(screen.getByRole("dialog").dataset.platform).toBe("ipad");
  });
});

describe("ContextMenu", () => {
  it("runs an item and closes", () => {
    const copy = vi.fn();
    const close = vi.fn();
    render(
      <MobileShell kind="phone-ios">
        <ContextMenu
          open
          onClose={close}
          at={{ x: 40, y: 200 }}
          items={[
            { label: "Passwort kopieren", icon: Copy, onSelect: copy },
            "separator",
            { label: "Löschen", icon: Trash2, onSelect: () => {}, danger: true },
          ]}
        />
      </MobileShell>,
    );
    const item = screen.getByRole("menuitem", { name: "Passwort kopieren" });
    expect(document.activeElement).toBe(item);
    fireEvent.keyDown(item, { key: "ArrowDown" });
    expect(document.activeElement).toBe(screen.getByRole("menuitem", { name: "Löschen" }));
    fireEvent.click(item);
    expect(copy).toHaveBeenCalled();
    expect(close).toHaveBeenCalled();
  });

  it("is a bottom sheet on Android", () => {
    render(
      <MobileShell kind="phone-android">
        <ContextMenu open onClose={() => {}} items={[{ label: "Bearbeiten", onSelect: () => {} }]} />
      </MobileShell>,
    );
    expect(screen.getByRole("dialog").dataset.platform).toBe("android");
    expect(screen.getByRole("menuitem", { name: "Bearbeiten" })).toBeTruthy();
  });
});

describe("useLongPress", () => {
  it("fires after 480 ms and swallows the click that follows", () => {
    vi.useFakeTimers();
    const press = vi.fn();
    const click = vi.fn();
    function Row() {
      const handlers = useLongPress(press);
      return (
        <button type="button" onClick={click} {...handlers}>
          GitHub
        </button>
      );
    }
    render(<Row />);
    const row = screen.getByRole("button");
    fireEvent.pointerDown(row, { pointerType: "touch", clientX: 10, clientY: 10 });
    act(() => vi.advanceTimersByTime(500));
    expect(press).toHaveBeenCalledOnce();
    fireEvent.pointerUp(row);
    fireEvent.click(row);
    expect(click).not.toHaveBeenCalled();
  });

  it("gives up when the finger moves", () => {
    vi.useFakeTimers();
    const press = vi.fn();
    function Row() {
      return <div {...useLongPress(press)}>GitHub</div>;
    }
    render(<Row />);
    const row = screen.getByText("GitHub");
    fireEvent.pointerDown(row, { pointerType: "touch", clientX: 10, clientY: 10 });
    fireEvent.pointerMove(row, { clientX: 10, clientY: 40 });
    act(() => vi.advanceTimersByTime(500));
    expect(press).not.toHaveBeenCalled();
  });
});

describe("useKeyboardShortcut", () => {
  it("runs on its accelerator only", () => {
    const find = vi.fn();
    function Harness() {
      useKeyboardShortcut("CmdOrCtrl+F", find);
      return null;
    }
    render(<Harness />);
    fireEvent.keyDown(window, { key: "f", ctrlKey: true });
    fireEvent.keyDown(window, { key: "f" });
    expect(find).toHaveBeenCalledOnce();
  });
});

describe("MobileToaster", () => {
  it("is a snackbar with its action on Android", () => {
    const store = createToasts();
    const undo = vi.fn();
    render(
      <MobileShell kind="phone-android">
        <MobileToaster store={store} />
      </MobileShell>,
    );
    act(() => {
      store.show("In den Papierkorb gelegt", { action: { label: "Rückgängig", run: undo } });
    });
    fireEvent.click(screen.getByRole("button", { name: "Rückgängig" }));
    expect(undo).toHaveBeenCalled();
    expect(screen.queryByRole("status")).toBeNull();
  });

  it("is a glass toast with a detail line on iOS", () => {
    const store = createToasts();
    render(
      <MobileShell kind="phone-ios">
        <MobileToaster store={store} />
      </MobileShell>,
    );
    act(() => {
      store.show("Passwort kopiert", { tone: "success", detail: "Wird in 30 s geleert" });
    });
    expect(screen.getByRole("status").textContent).toContain("Wird in 30 s geleert");
  });
});

describe("Fab and SplitView", () => {
  it("names the FAB", () => {
    render(<Fab label="Neuer Eintrag" icon={Plus} />);
    expect(screen.getByRole("button", { name: "Neuer Eintrag" })).toBeTruthy();
  });

  it("hides the overlay sidebar until it is opened", () => {
    const sidebar = <SidebarRow label="Alle Einträge" current onClick={() => {}} count={12} />;
    const { rerender } = render(<SplitView overlaySidebar sidebar={sidebar} list="Liste" detail="Detail" />);
    expect(screen.queryByRole("navigation")).toBeNull();
    rerender(<SplitView overlaySidebar sidebarOpen sidebar={sidebar} list="Liste" detail="Detail" />);
    expect(screen.getByRole("button", { name: /Alle Einträge/ }).getAttribute("aria-current")).toBe("page");
  });
});
