// @vitest-environment node
import { describe, expect, it } from "vitest";
import { filterCommands, type CommandGroup } from "../src/components/CommandPalette";

const item = (id: string, text: string, keywords?: string[]) => ({ id, label: text, text, keywords, onSelect() {} });
const groups: CommandGroup[] = [
  {
    id: "hosts",
    title: "Hosts",
    items: [item("nas", "Synology NAS", ["192.0.2.2"]), item("web", "Webserver Münster"), item("pi", "Pi im Keller")],
  },
  { id: "actions", title: "Aktionen", items: [item("new", "Neuer Tab"), item("snip", "Snippets öffnen")] },
];
const ids = (result: CommandGroup[]) => result.map((group) => [group.id, group.items.map((i) => i.id)]);

describe("filterCommands", () => {
  it("returns the groups unchanged for an empty query", () => {
    expect(filterCommands(groups, "  ")).toBe(groups);
  });

  it("ignores case and accents and drops empty groups", () => {
    expect(ids(filterCommands(groups, "MUNSTER"))).toEqual([["hosts", ["web"]]]);
    expect(ids(filterCommands(groups, "offnen"))).toEqual([["actions", ["snip"]]]);
  });

  it("needs every term, in text or keywords", () => {
    expect(ids(filterCommands(groups, "nas 192.0"))).toEqual([["hosts", ["nas"]]]);
    expect(ids(filterCommands(groups, "nas keller"))).toEqual([]);
  });

  it("puts prefix and word-start matches before matches inside a word", () => {
    const g: CommandGroup[] = [
      { id: "g", title: "G", items: [item("a", "Backup"), item("b", "Ein Upload"), item("c", "Upload")] },
    ];
    expect(ids(filterCommands(g, "up"))).toEqual([["g", ["c", "b", "a"]]]);
  });
});
