import { act, fireEvent, render, screen } from "@testing-library/react";
import { Settings } from "lucide-react";
import { useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Avatar, avatarColor, initials } from "../src/components/Avatar";
import { Button, IconButton } from "../src/components/Button";
import { CommandPalette } from "../src/components/CommandPalette";
import { Dialog } from "../src/components/Dialog";
import { Field, TextInput } from "../src/components/Field";
import { Menu } from "../src/components/Menu";
import { Badge } from "../src/components/Pill";
import { Segmented } from "../src/components/Segmented";
import { Toggle } from "../src/components/Switch";
import { detectPlatform, TitleBar } from "../src/components/TitleBar";
import { createToasts, Toaster } from "../src/components/Toaster";
import { Wordmark } from "../src/components/Wordmark";
import { UwuLabels } from "../src/lib/labels";

afterEach(() => vi.useRealTimers());

describe("Button", () => {
  it("is a plain button that turns busy", () => {
    render(<Button busy>Senden</Button>);
    const button = screen.getByRole("button", { name: "Senden" });
    expect(button.getAttribute("type")).toBe("button");
    expect(button.hasAttribute("disabled")).toBe(true);
    expect(button.getAttribute("aria-busy")).toBe("true");
  });

  it("gives an icon button its label as name and tooltip", () => {
    render(<IconButton icon={Settings} label="Einstellungen" active />);
    const button = screen.getByRole("button", { name: "Einstellungen" });
    expect(button.getAttribute("title")).toBe("Einstellungen");
    expect(button.getAttribute("aria-pressed")).toBe("true");
  });
});

describe("Field", () => {
  it("connects label, control and hint", () => {
    render(
      <Field label="Name" hint="So sehen dich die anderen">
        {(id, note) => <TextInput id={id} aria-describedby={note} />}
      </Field>,
    );
    const input = screen.getByLabelText("Name");
    expect(document.getElementById(input.getAttribute("aria-describedby")!)?.textContent).toBe(
      "So sehen dich die anderen",
    );
  });

  it("shows the error instead of the hint", () => {
    render(
      <Field label="Port" hint="Meist 7000" error="Nur Zahlen">
        {(id) => <TextInput id={id} />}
      </Field>,
    );
    expect(screen.getByRole("alert").textContent).toBe("Nur Zahlen");
    expect(screen.queryByText("Meist 7000")).toBeNull();
  });

  it("draws the outline in the full control colour and a readable placeholder (WCAG 1.4.11, 1.4.3)", () => {
    render(<TextInput aria-label="Name" placeholder="Mini" />);
    const classes = screen.getByLabelText("Name").className.split(/\s+/);
    expect(classes).toContain("border-control");
    expect(classes).toContain("placeholder:text-muted");
    expect(classes.some((c) => /^(border|bg)-control\//.test(c) || c === "placeholder:text-faint")).toBe(false);
  });
});

describe("Toggle and Segmented", () => {
  it("switches on click", () => {
    function Harness() {
      const [on, setOn] = useState(false);
      return <Toggle checked={on} onChange={setOn} label="AirPlay" />;
    }
    render(<Harness />);
    const toggle = screen.getByRole("switch", { name: "AirPlay" });
    expect(toggle.className.split(/\s+/)).toContain("bg-control");
    fireEvent.click(toggle);
    expect(toggle.getAttribute("aria-checked")).toBe("true");
  });

  it("moves with the arrow keys", () => {
    const onChange = vi.fn();
    render(
      <Segmented
        label="Design"
        value="system"
        onChange={onChange}
        options={[
          { value: "system", label: "System" },
          { value: "light", label: "Hell" },
          { value: "dark", label: "Dunkel" },
        ]}
      />,
    );
    fireEvent.keyDown(screen.getByRole("radiogroup"), { key: "ArrowLeft" });
    expect(onChange).toHaveBeenCalledWith("dark");
  });

  it("skips a disabled option and keeps a tab stop", () => {
    const onChange = vi.fn();
    render(
      <Segmented
        label="Design"
        value="light"
        onChange={onChange}
        options={[
          { value: "system", label: "System" },
          { value: "light", label: "Hell", disabled: true },
          { value: "dark", label: "Dunkel" },
        ]}
      />,
    );
    const hell = screen.getByRole("radio", { name: "Hell" }) as HTMLButtonElement;
    expect(hell.disabled).toBe(true);
    expect(screen.getByRole("radio", { name: "System" }).tabIndex).toBe(0);
    fireEvent.keyDown(screen.getByRole("radiogroup"), { key: "ArrowRight" });
    expect(onChange).toHaveBeenCalledWith("dark");
  });

  it("can be disabled as a whole", () => {
    const onChange = vi.fn();
    render(
      <Segmented
        label="Server"
        value="cloud"
        disabled
        onChange={onChange}
        options={[
          { value: "cloud", label: "Cloud" },
          { value: "own", label: "Eigener" },
        ]}
      />,
    );
    const group = screen.getByRole("radiogroup");
    expect(group.getAttribute("aria-disabled")).toBe("true");
    for (const radio of screen.getAllByRole("radio")) expect((radio as HTMLButtonElement).disabled).toBe(true);
    fireEvent.keyDown(group, { key: "ArrowRight" });
    fireEvent.click(screen.getByRole("radio", { name: "Eigener" }));
    expect(onChange).not.toHaveBeenCalled();
  });

  it("marks the choice with a shape in high contrast", () => {
    render(
      <Segmented
        label="Ton"
        value="a"
        onChange={() => {}}
        options={[
          { value: "a", label: "A" },
          { value: "b", label: "B" },
        ]}
      />,
    );
    expect(screen.getByRole("radio", { name: "A" }).className).toContain("contrast-high:outline-ink");
    expect(screen.getByRole("radio", { name: "B" }).className).not.toContain("outline");
  });
});

describe("Badge", () => {
  it("hides at zero and caps at 999+", () => {
    const { container, rerender } = render(<Badge count={0} />);
    expect(container.textContent).toBe("");
    rerender(<Badge count={1200} />);
    expect(container.textContent).toBe("999+");
  });
});

describe("Menu", () => {
  it("opens, selects and closes on Escape", () => {
    const onSelect = vi.fn();
    render(
      <Menu
        trigger={({ toggle, ...props }) => (
          <button type="button" onClick={toggle} {...props}>
            Mehr
          </button>
        )}
        items={[
          { label: "Löschen", onSelect, danger: true },
          "separator",
          { label: "Archivieren", onSelect: () => {} },
        ]}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Mehr" }));
    expect(screen.getAllByRole("menuitem")).toHaveLength(2);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("menu")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Mehr" }));
    fireEvent.click(screen.getByRole("menuitem", { name: "Löschen" }));
    expect(onSelect).toHaveBeenCalledOnce();
    expect(screen.queryByRole("menu")).toBeNull();
  });
  it("labels its sections with headings and scrolls when long", () => {
    render(
      <Menu
        open
        trigger={(props) => (
          <button type="button" onClick={props.toggle}>
            KI
          </button>
        )}
        items={[
          { label: "Schreiben", onSelect: () => {} },
          { heading: "Umschreiben" },
          { label: "Kürzer", onSelect: () => {} },
          { label: "Freundlicher", onSelect: () => {} },
          { heading: "Mehr" },
          { label: "Anpassen", onSelect: () => {} },
        ]}
      />,
    );
    const groups = screen.getAllByRole("group");
    expect(
      groups.map(
        (group) =>
          group.getAttribute("aria-labelledby") &&
          document.getElementById(group.getAttribute("aria-labelledby")!)?.textContent,
      ),
    ).toEqual(["Umschreiben", "Mehr"]);
    expect(screen.getByRole("group", { name: "Umschreiben" }).querySelectorAll("[role=menuitem]")).toHaveLength(2);
    expect(screen.getAllByRole("menuitem")).toHaveLength(4);
    expect(screen.getByRole("menu").className).toContain("overflow-y-auto");
    expect(screen.getByRole("menu").className).toContain("max-h-");
  });
});

describe("Dialog", () => {
  it("closes only the innermost dialog on Escape when one is opened from another", () => {
    const outer = vi.fn();
    const inner = vi.fn();
    render(
      <Dialog open onClose={outer} title="Außen">
        <Dialog open onClose={inner} title="Innen">
          <p>Sicher?</p>
        </Dialog>
      </Dialog>,
    );
    const innerDialog = screen.getByText("Sicher?").closest("dialog")!;
    fireEvent(innerDialog, new Event("cancel", { cancelable: true }));
    expect(inner).toHaveBeenCalledOnce();
    expect(outer).not.toHaveBeenCalled();
    fireEvent(innerDialog.parentElement!.closest("dialog")!, new Event("cancel", { cancelable: true }));
    expect(outer).toHaveBeenCalledOnce();
  });

  it("stays open on a click beside it unless asked to close", () => {
    const close = vi.fn();
    const { rerender } = render(
      <Dialog open onClose={close} title="Neu">
        <p>Inhalt</p>
      </Dialog>,
    );
    const dialog = screen.getByText("Inhalt").closest("dialog")!;
    fireEvent.click(dialog);
    expect(close).not.toHaveBeenCalled();
    rerender(
      <Dialog open onClose={close} title="Neu" closeOnOutsideClick>
        <p>Inhalt</p>
      </Dialog>,
    );
    fireEvent.click(dialog);
    expect(close).toHaveBeenCalledTimes(1);
  });
});

describe("toasts", () => {
  it("keeps four at most and lets them go after their time", () => {
    vi.useFakeTimers();
    const store = createToasts();
    render(<Toaster store={store} />);
    act(() => {
      for (let i = 1; i <= 5; i++) store.show(`Toast ${i}`);
    });
    expect(screen.queryByText("Toast 1")).toBeNull();
    expect(screen.getAllByRole("status")).toHaveLength(4);
    act(() => {
      store.show("Kaputt", { tone: "error" });
      vi.advanceTimersByTime(5000);
    });
    expect(screen.queryAllByRole("status")).toHaveLength(0);
    expect(screen.getByRole("alert").textContent).toContain("Kaputt");
    act(() => vi.advanceTimersByTime(4000));
    expect(screen.queryByRole("alert")).toBeNull();
  });
});

describe("TitleBar", () => {
  const controls = { maximized: false, minimize: vi.fn(), toggleMaximize: vi.fn(), close: vi.fn() };

  it("draws the window controls in the app's language", () => {
    render(
      <UwuLabels labels="en">
        <TitleBar brand={<Wordmark product="Mirror" />} controls={controls} />
      </UwuLabels>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(controls.close).toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Maximize" })).toBeTruthy();
  });

  it("leaves out maximize for a window that cannot be maximized", () => {
    const toggleMaximize = vi.fn();
    const { container } = render(
      <UwuLabels labels="en">
        <TitleBar brand="x" controls={{ ...controls, toggleMaximize }} maximizable={false} />
      </UwuLabels>,
    );
    expect(screen.queryByRole("button", { name: "Maximize" })).toBeNull();
    expect(screen.getByRole("button", { name: "Minimize" })).toBeTruthy();
    fireEvent.doubleClick(container.querySelector("header")!);
    expect(toggleMaximize).not.toHaveBeenCalled();
  });

  it("stays away on macOS", () => {
    const { container } = render(<TitleBar brand="x" controls={controls} platform="mac" />);
    expect(container.innerHTML).toBe("");
  });

  it("detects the platform", () => {
    expect(detectPlatform("Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0)")).toBe("mac");
    expect(detectPlatform("Mozilla/5.0 (Windows NT 10.0; Win64; x64)")).toBe("windows");
    expect(detectPlatform("Mozilla/5.0 (X11; Linux x86_64)")).toBe("linux");
  });
});

describe("Avatar", () => {
  it("shows initials in a stable colour", () => {
    expect(initials("Lorin Example")).toBe("LE");
    expect(initials("nyu@example.com")).toBe("NE");
    expect(avatarColor("a@example.com")).toBe(avatarColor("A@example.com"));
    const { container } = render(<Avatar name="Nyu Cat" />);
    expect(container.textContent).toBe("NC");
  });
});

describe("toast store", () => {
  it("keeps just the newest with max 1", () => {
    const store = createToasts({ max: 1 });
    store.show("a");
    store.show("b");
    expect(store.get().map((t) => t.message)).toEqual(["b"]);
  });
});

describe("CommandPalette", () => {
  // jsdom has no showModal(): the <dialog> stays closed, so role queries need `hidden: true`.
  function Harness({
    onSelect = () => {},
    onClose = () => {},
  }: {
    onSelect?: (id: string, m: boolean) => void;
    onClose?: () => void;
  }) {
    const [query, setQuery] = useState("");
    const row = (id: string, text: string, disabled?: boolean) => ({
      id,
      text,
      label: text,
      disabled,
      onSelect: ({ modifier }: { modifier: boolean }) => onSelect(id, modifier),
    });
    return (
      <CommandPalette
        open
        onClose={onClose}
        query={query}
        onQueryChange={setQuery}
        groups={[
          { id: "hosts", title: "Hosts", items: [row("off", "Alt", true), row("nas", "NAS"), row("pi", "Pi")] },
          { id: "actions", title: "Aktionen", items: [row("tab", "Neuer Tab", false)] },
        ]}
      />
    );
  }
  const active = () =>
    document.getElementById(screen.getByRole("combobox", { hidden: true }).getAttribute("aria-activedescendant")!);

  it("is a labelled combobox that starts on the first enabled row", () => {
    render(<Harness />);
    const input = screen.getByRole("combobox", { name: "Befehle", hidden: true });
    expect(screen.getByRole("listbox", { hidden: true }).id).toBe(input.getAttribute("aria-controls"));
    expect(screen.getAllByRole("group", { hidden: true })[0]!.getAttribute("aria-labelledby")).toBeTruthy();
    expect(active()?.textContent).toBe("NAS");
    expect(active()?.getAttribute("aria-selected")).toBe("true");
  });

  it("moves with the arrows across groups, wraps and skips disabled rows", () => {
    render(<Harness />);
    const input = screen.getByRole("combobox", { hidden: true });
    fireEvent.keyDown(input, { key: "ArrowDown" });
    fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(active()?.textContent).toBe("Neuer Tab");
    fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(active()?.textContent).toBe("NAS");
    fireEvent.keyDown(input, { key: "ArrowUp" });
    expect(active()?.textContent).toBe("Neuer Tab");
    fireEvent.keyDown(input, { key: "Home" });
    expect(active()?.textContent).toBe("NAS");
  });

  it("runs the active row on Enter, with the modifier on Ctrl+Enter and Ctrl+click", () => {
    const onSelect = vi.fn();
    render(<Harness onSelect={onSelect} />);
    const input = screen.getByRole("combobox", { hidden: true });
    fireEvent.keyDown(input, { key: "Enter" });
    fireEvent.keyDown(input, { key: "End" });
    fireEvent.keyDown(input, { key: "Enter", ctrlKey: true });
    fireEvent.click(screen.getByRole("option", { name: "Pi", hidden: true }), { metaKey: true });
    fireEvent.click(screen.getByRole("option", { name: "Alt", hidden: true }));
    expect(onSelect.mock.calls).toEqual([
      ["nas", false],
      ["tab", true],
      ["pi", true],
    ]);
  });

  it("filters while typing, starts again at the top and says when nothing matches", () => {
    render(<Harness />);
    const input = screen.getByRole("combobox", { hidden: true });
    fireEvent.keyDown(input, { key: "End" });
    fireEvent.change(input, { target: { value: "p" } });
    expect(screen.getAllByRole("option", { hidden: true }).map((o) => o.textContent)).toEqual(["Pi"]);
    expect(active()?.textContent).toBe("Pi");
    fireEvent.change(input, { target: { value: "zzz" } });
    expect(screen.getByText("Keine Treffer")).toBeTruthy();
    expect(input.getAttribute("aria-expanded")).toBe("false");
  });

  it("closes on Escape (cancel) and on a click beside it", () => {
    const onClose = vi.fn();
    render(<Harness onClose={onClose} />);
    const dialog = screen.getByRole("combobox", { hidden: true }).closest("dialog")!;
    fireEvent(dialog, new Event("cancel", { cancelable: true }));
    fireEvent.click(dialog);
    expect(onClose).toHaveBeenCalledTimes(2);
  });
});
