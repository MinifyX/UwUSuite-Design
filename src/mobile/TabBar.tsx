import { clsx } from "clsx";
import { Search, X, type LucideIcon } from "lucide-react";
import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { useLabels } from "../lib/labels.js";
import type { MobilePlatform } from "./device.js";
import { haptic } from "./haptics.js";
import { useKeyboardInset, useMobilePlatform } from "./hooks.js";

export interface TabItem<T extends string = string> {
  id: T;
  label: string;
  icon: LucideIcon;
  /** A count on the tab (due items, problems). Hidden at 0. */
  badge?: number;
}

export interface TabSearch {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export interface TabBarProps<T extends string = string> {
  /** The app picks its tabs (three to five). The order is the app's; settings come last. */
  tabs: readonly TabItem<T>[];
  value: T;
  onChange: (id: T) => void;
  /** `ios`: floating glass capsule · `android`: M3 navigation bar · `ipad`: floating at the top. */
  platform?: MobilePlatform;
  /**
   * iPhone only: the round glass search button right of the bar. While `open`, the bar shrinks to
   * a round button and the field rides on top of the keyboard.
   */
  search?: TabSearch;
  label?: string;
  className?: string;
}

/** The app's main navigation on phones and iPads (docs/mobile.md). */
export function TabBar<T extends string>({
  tabs,
  value,
  onChange,
  platform: explicit,
  search,
  label = "Bereiche",
  className,
}: TabBarProps<T>) {
  const platform = useMobilePlatform(explicit);
  const labels = useLabels();
  const glass = platform !== "android";
  const withSearch = platform === "ios" && search;
  const searching = withSearch && search.open;
  const keyboard = useKeyboardInset();
  const style = { "--uwu-keyboard": `${keyboard}px` } as CSSProperties;
  const current = tabs.find((tab) => tab.id === value);

  if (searching && current) {
    return (
      <>
        <nav
          aria-label={label}
          data-platform={platform}
          data-searching=""
          style={style}
          className={clsx("uwu-tabbar uwu-glass", className)}
        >
          <button
            type="button"
            className="uwu-tab"
            aria-label={labels.closeSearch}
            onClick={() => search.onOpenChange(false)}
          >
            <span className="uwu-tab-icon">
              <current.icon aria-hidden />
            </span>
          </button>
        </nav>
        <SearchField
          value={search.value}
          onChange={search.onChange}
          placeholder={search.placeholder}
          onClose={() => search.onOpenChange(false)}
          style={style}
        />
      </>
    );
  }

  return (
    <>
      <nav
        aria-label={label}
        data-platform={platform}
        data-search={withSearch ? "" : undefined}
        className={clsx("uwu-tabbar", glass && "uwu-glass", className)}
      >
        {tabs.map((tab) => {
          const active = tab.id === value;
          return (
            <button
              key={tab.id}
              type="button"
              className="uwu-tab"
              aria-current={active ? "page" : undefined}
              onClick={() => {
                if (!active) haptic("selection");
                onChange(tab.id);
              }}
            >
              <span className="uwu-tab-icon">
                <tab.icon aria-hidden />
              </span>
              <span className="uwu-tab-label">{tab.label}</span>
              {!!tab.badge && (
                <span className="uwu-tab-badge" aria-label={`(${tab.badge})`}>
                  {tab.badge > 99 ? "99+" : tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
      {withSearch && <SearchButton onClick={() => search.onOpenChange(true)} />}
    </>
  );
}

/** iPhone: the round Liquid Glass search button beside the tab bar. */
export function SearchButton({
  onClick,
  label,
  className,
}: {
  onClick: () => void;
  label?: string;
  className?: string;
}) {
  const labels = useLabels();
  return (
    <button
      type="button"
      className={clsx("uwu-searchbutton uwu-glass", className)}
      aria-label={label ?? labels.search}
      onClick={onClick}
    >
      <Search aria-hidden strokeWidth={1.9} />
    </button>
  );
}

export interface SearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  onClose: () => void;
  placeholder?: string;
  /** Focus the field when it appears (default), which brings up the keyboard. */
  autoFocus?: boolean;
  style?: CSSProperties;
  className?: string;
}

/**
 * iPhone: the search field at the bottom. It sits on top of the on-screen keyboard (it reads the
 * visual viewport), so the thumb that tapped the search button types right there. Escape closes.
 */
export function SearchField({
  value,
  onChange,
  onClose,
  placeholder,
  autoFocus = true,
  style,
  className,
}: SearchFieldProps) {
  const labels = useLabels();
  const input = useRef<HTMLInputElement>(null);
  const keyboard = useKeyboardInset();
  useEffect(() => {
    if (autoFocus) input.current?.focus();
  }, [autoFocus]);
  return (
    <div
      role="search"
      className={clsx("uwu-searchfield uwu-glass", className)}
      style={{ "--uwu-keyboard": `${keyboard}px`, ...style } as CSSProperties}
    >
      <Search aria-hidden />
      <input
        ref={input}
        type="search"
        enterKeyHint="search"
        value={value}
        placeholder={placeholder ?? labels.search}
        aria-label={placeholder ?? labels.search}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Escape") onClose();
        }}
      />
      {value && (
        <button type="button" aria-label={labels.clearSearch} onClick={() => onChange("")}>
          <X aria-hidden />
        </button>
      )}
    </div>
  );
}

export interface SearchBarProps {
  /** Without `onChange` the bar is a button that opens the app's search view. */
  value?: string;
  onChange?: (value: string) => void;
  onActivate?: () => void;
  placeholder?: string;
  /** The account avatar on the right (Android: account switcher). */
  trailing?: ReactNode;
  /** A back arrow or menu on the left instead of the magnifier. */
  leading?: ReactNode;
  /** In the flow instead of floating at the top of the screen. */
  inline?: boolean;
  className?: string;
}

/** Android: the Material 3 search bar at the top, with the account avatar at its end. */
export function SearchBar({
  value,
  onChange,
  onActivate,
  placeholder,
  trailing,
  leading,
  inline,
  className,
}: SearchBarProps) {
  const labels = useLabels();
  const text = placeholder ?? labels.search;
  const start = leading ?? <Search aria-hidden />;
  if (!onChange)
    return (
      <div className={clsx("uwu-searchbar", className)} data-inline={inline ? "" : undefined}>
        {start}
        <button type="button" className="uwu-searchbar-placeholder" onClick={onActivate}>
          {text}
        </button>
        {trailing}
      </div>
    );
  return (
    <div role="search" className={clsx("uwu-searchbar", className)} data-inline={inline ? "" : undefined}>
      {start}
      <input
        type="search"
        enterKeyHint="search"
        value={value ?? ""}
        placeholder={text}
        aria-label={text}
        onChange={(event) => onChange(event.target.value)}
      />
      {trailing}
    </div>
  );
}
