import { clsx } from "clsx";
import { Search } from "lucide-react";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { Icon } from "../icons/Icon.js";
import { useLabels } from "../lib/labels.js";
import { closeModal, showModal } from "../lib/modal.js";

export interface CommandItem {
  id: string;
  label: ReactNode;
  /** Plain text the filter matches and screen readers read. */
  text: string;
  /** Muted text after the label, e.g. an address (wrap it in `uwu-mono` for code). */
  detail?: ReactNode;
  icon?: ReactNode;
  /** Right-aligned: a shortcut (`<kbd>`), a hint or a status. */
  trailing?: ReactNode;
  /** More words the filter matches. */
  keywords?: string[];
  disabled?: boolean;
  /**
   * Runs on Enter or click; `modifier` is true with Ctrl/Cmd held. The palette stays open: call
   * `onClose` from here when the command is done with it.
   */
  onSelect: (how: { modifier: boolean }) => void;
}

export interface CommandGroup {
  id: string;
  title: string;
  items: CommandItem[];
}

export interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  groups: CommandGroup[];
  query: string;
  onQueryChange: (query: string) => void;
  /** Names the dialog and the list. Defaults to the `commands` label. */
  label?: string;
  placeholder?: string;
  /** Replaces the keyboard hints at the bottom. */
  footer?: ReactNode;
  emptyText?: ReactNode;
  /** Keeps the palette from opening, e.g. while the app lock covers the window. */
  held?: boolean;
  /** False when `groups` are already filtered by the app. Defaults to true (`filterCommands`). */
  filter?: boolean;
  className?: string;
}

const fold = (value: string) => value.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();

/** 0 the text starts with the term, 1 a word does, 2 it is somewhere inside, -1 not at all. */
function rank(haystack: string, term: string) {
  if (haystack.startsWith(term)) return 0;
  let best = -1;
  for (let at = haystack.indexOf(term); at >= 0; at = haystack.indexOf(term, at + 1)) {
    if (!/[\p{L}\p{N}]/u.test(haystack[at - 1]!)) return 1;
    best = 2;
  }
  return best;
}

/**
 * Keeps the items whose text or keywords contain every word of the query (ignoring case and
 * accents) and puts prefix and word-start matches first within each group. Empty groups go.
 */
export function filterCommands(groups: CommandGroup[], query: string): CommandGroup[] {
  const terms = fold(query).split(/\s+/).filter(Boolean);
  if (terms.length === 0) return groups;
  return groups
    .map((group) => {
      const scored: [CommandItem, number][] = [];
      for (const item of group.items) {
        const haystacks = [item.text, ...(item.keywords ?? [])].map(fold);
        let score = 0;
        for (const term of terms) {
          const ranks = haystacks.map((haystack) => rank(haystack, term)).filter((r) => r >= 0);
          if (ranks.length === 0) {
            score = -1;
            break;
          }
          score += Math.min(...ranks);
        }
        if (score >= 0) scored.push([item, score]);
      }
      return { ...group, items: scored.sort((a, b) => a[1] - b[1]).map(([item]) => item) };
    })
    .filter((group) => group.items.length > 0);
}

/**
 * Command palette (Ctrl+K / ⌘K): a search field over grouped commands in a modal <dialog>,
 * built as an ARIA combobox. Focus stays in the field; arrows, Home and End move the active row,
 * Enter runs it, Escape and a click beside it close.
 */
export function CommandPalette({
  open,
  onClose,
  groups,
  query,
  onQueryChange,
  label,
  placeholder,
  footer,
  emptyText,
  held = false,
  filter = true,
  className,
}: CommandPaletteProps) {
  const labels = useLabels();
  const ref = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const id = useId();
  const [active, setActive] = useState<string | null>(null);
  const shown = open && !held;

  const visible = filter ? filterCommands(groups, query) : groups;
  const rows = visible.flatMap((group) => group.items);
  const enabled = rows.filter((item) => !item.disabled);
  const current = enabled.find((item) => item.id === active) ?? enabled[0];
  const optionId = (item: CommandItem) => `${id}-o${rows.indexOf(item)}`;
  // `text` is the name; detail and trailing (an address, "offen in Tab 2") are read after it.
  const describedBy = (item: CommandItem) =>
    [item.detail && `${optionId(item)}-d`, item.trailing && `${optionId(item)}-t`].filter(Boolean).join(" ") ||
    undefined;

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog || !shown) return;
    const previous = document.activeElement as HTMLElement | null;
    if (!dialog.open) showModal(dialog);
    setActive(null);
    input.current?.focus();
    return () => {
      closeModal(dialog);
      // An app that moved focus on its own (a terminal, a dialog opened from a command) keeps it.
      const now = document.activeElement;
      if (!now || now === document.body || dialog.contains(now)) previous?.focus?.();
    };
  }, [shown]);

  useEffect(() => {
    if (current) document.getElementById(optionId(current))?.scrollIntoView?.({ block: "nearest" });
  });

  const move = (to: (index: number, count: number) => number) => {
    if (enabled.length === 0) return;
    const index = current ? enabled.indexOf(current) : -1;
    setActive(enabled[to(index, enabled.length)]!.id);
  };

  const run = (item: CommandItem | undefined, modifier: boolean) => {
    if (item && !item.disabled) item.onSelect({ modifier });
  };

  const listId = `${id}-list`;
  const name = label ?? labels.commands;

  return (
    <dialog
      ref={ref}
      aria-label={name}
      onCancel={(event) => {
        // Like Dialog: only the dialog the browser fired `cancel` at closes, not the ones around it.
        if (event.target !== ref.current) return;
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === ref.current) onClose();
      }}
      className={clsx(
        "uwu-command-palette mx-auto mt-[12vh] mb-auto max-h-[calc(88svh-16px)] w-[min(620px,calc(100vw-32px))] max-w-none overflow-hidden rounded-card border border-line bg-surface p-0 text-ink shadow-float backdrop:bg-scrim open:flex open:flex-col motion-safe:open:animate-pop",
        // The field has no box of its own, so the whole palette carries the focus ring.
        "has-[input:focus-visible]:[box-shadow:var(--uwu-focus),var(--uwu-shadow-float)]",
        className,
      )}
    >
      {open && (
        <div className="flex min-h-0 flex-auto flex-col">
          <div className="flex h-[52px] shrink-0 items-center gap-3 border-b border-hairline px-4">
            <Icon icon={Search} size="md" className="text-muted" />
            <input
              ref={input}
              type="text"
              role="combobox"
              aria-label={name}
              aria-expanded={rows.length > 0}
              aria-controls={listId}
              aria-autocomplete="list"
              aria-activedescendant={current ? optionId(current) : undefined}
              autoComplete="off"
              spellCheck={false}
              value={query}
              placeholder={placeholder ?? labels.commandPlaceholder}
              onChange={(event) => {
                setActive(null);
                onQueryChange(event.target.value);
              }}
              onKeyDown={(event) => {
                if (event.nativeEvent.isComposing) return;
                const keys: Record<string, (index: number, count: number) => number> = {
                  ArrowDown: (index, count) => (index + 1) % count,
                  ArrowUp: (index, count) => (index - 1 + count) % count,
                  Home: () => 0,
                  End: (_, count) => count - 1,
                };
                if (keys[event.key]) {
                  event.preventDefault();
                  move(keys[event.key]!);
                } else if (event.key === "Enter") {
                  event.preventDefault();
                  run(current, event.ctrlKey || event.metaKey);
                }
              }}
              className="h-full min-w-0 flex-auto bg-transparent text-reading text-ink caret-pink placeholder:text-muted focus:outline-hidden focus-visible:shadow-none"
            />
            <kbd aria-hidden className="rounded-small border border-line px-1.5 py-0.5 text-caption text-muted">
              Esc
            </kbd>
          </div>
          <div
            id={listId}
            role="listbox"
            aria-label={name}
            className={clsx(
              "max-h-[min(420px,60svh)] min-h-0 flex-auto overflow-y-auto overscroll-contain",
              rows.length > 0 && "p-2",
            )}
          >
            {visible.map((group, index) => (
              <div key={group.id} role="group" aria-labelledby={`${id}-g${index}`} className="flex flex-col">
                <div
                  id={`${id}-g${index}`}
                  role="presentation"
                  className="px-3 pt-2 pb-1 text-caption font-bold tracking-wide text-muted uppercase"
                >
                  {group.title}
                </div>
                {group.items.map((item) => (
                  // Options stay in the listbox and focus stays in the field (combobox pattern),
                  // so the row is a div; the keyboard reaches it through the field.
                  <div
                    key={item.id}
                    id={optionId(item)}
                    role="option"
                    aria-label={item.text}
                    aria-describedby={describedBy(item)}
                    aria-selected={item === current}
                    aria-disabled={item.disabled || undefined}
                    onMouseDown={(event) => event.preventDefault()}
                    onMouseMove={() => !item.disabled && item !== current && setActive(item.id)}
                    onClick={(event) => run(item, event.ctrlKey || event.metaKey)}
                    className="group flex min-h-10 shrink-0 cursor-default items-center gap-3 rounded-xl px-3 py-1.5 text-body aria-disabled:opacity-50 aria-selected:bg-pink-tint aria-selected:text-pink-ink contrast-high:aria-selected:outline-2 contrast-high:aria-selected:-outline-offset-2 contrast-high:aria-selected:outline-ink"
                  >
                    {item.icon && (
                      <span className="flex shrink-0 text-muted group-aria-selected:text-pink-ink" aria-hidden>
                        {item.icon}
                      </span>
                    )}
                    <span className="min-w-0 truncate font-medium">{item.label}</span>
                    {item.detail && (
                      <span id={`${optionId(item)}-d`} className="min-w-0 truncate text-meta text-muted">
                        {item.detail}
                      </span>
                    )}
                    {item.trailing && (
                      <span
                        id={`${optionId(item)}-t`}
                        className="ml-auto flex shrink-0 items-center gap-2 text-meta text-muted"
                      >
                        {item.trailing}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
          {rows.length === 0 && (
            <p className="px-4 py-6 text-center text-meta text-muted">{emptyText ?? labels.noResults}</p>
          )}
          <p className="sr-only" aria-live="polite">
            {query ? labels.resultCount.replace("{count}", String(rows.length)) : ""}
          </p>
          <footer className="shrink-0 border-t border-hairline bg-elevated px-4 py-2 text-caption text-muted">
            {footer ?? labels.commandHints}
          </footer>
        </div>
      )}
    </dialog>
  );
}
