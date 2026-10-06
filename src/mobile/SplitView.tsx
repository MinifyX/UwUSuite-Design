import { clsx } from "clsx";
import type { LucideIcon } from "lucide-react";
import { useSyncExternalStore, type ReactNode } from "react";
import { useLabels } from "../lib/labels.js";

export interface SplitViewProps {
  /** The sidebar: account, sections, folders (iPad: a floating glass column). */
  sidebar?: ReactNode;
  /** The middle column: the list. Leave it out for two columns (settings, checks). */
  list?: ReactNode;
  /** The detail, or an empty state while nothing is chosen. */
  detail: ReactNode;
  /**
   * Portrait (or a narrow window): the sidebar floats over the list and opens on demand.
   * Defaults to the orientation.
   */
  overlaySidebar?: boolean;
  sidebarOpen?: boolean;
  onSidebarOpenChange?: (open: boolean) => void;
  /** The list column's width (default 370 px; 440 px for two columns). */
  listWidth?: number;
  className?: string;
}

function subscribeOrientation(listener: () => void) {
  const query = window.matchMedia?.("(orientation: portrait)");
  query?.addEventListener("change", listener);
  return () => query?.removeEventListener("change", listener);
}

const portraitNow = () => window.matchMedia?.("(orientation: portrait)").matches ?? false;

/**
 * iPad: sidebar | list | detail (iPadOS 26). In landscape all three show; in portrait the sidebar
 * becomes an overlay over the list.
 */
export function SplitView({
  sidebar,
  list,
  detail,
  overlaySidebar,
  sidebarOpen = false,
  onSidebarOpenChange,
  listWidth,
  className,
}: SplitViewProps) {
  const labels = useLabels();
  const portrait = useSyncExternalStore(subscribeOrientation, portraitNow, () => false);
  const overlay = overlaySidebar ?? portrait;
  const showSidebar = sidebar && (!overlay || sidebarOpen);
  return (
    <div className={clsx("uwu-split", className)} data-overlay={overlay ? "" : undefined}>
      {overlay && showSidebar && (
        <div className="uwu-scrim" style={{ zIndex: 34 }} aria-hidden onClick={() => onSidebarOpenChange?.(false)} />
      )}
      {showSidebar && (
        <nav className="uwu-split-sidebar uwu-glass" aria-label={labels.sidebar}>
          {sidebar}
        </nav>
      )}
      {list && (
        <div className="uwu-split-column" style={listWidth ? { width: listWidth } : undefined}>
          {list}
        </div>
      )}
      <div className="uwu-split-detail">{detail}</div>
    </div>
  );
}

export interface SidebarRowProps {
  label: string;
  icon?: LucideIcon;
  count?: number | string;
  current?: boolean;
  onClick: () => void;
  /** A badge or a dot at the end instead of the count. */
  trailing?: ReactNode;
}

/** A row in the iPad sidebar. The chosen one is pink-solid. */
export function SidebarRow({ label, icon: Glyph, count, current, onClick, trailing }: SidebarRowProps) {
  return (
    <button type="button" className="uwu-sidebar-row" aria-current={current ? "page" : undefined} onClick={onClick}>
      {Glyph && <Glyph aria-hidden strokeWidth={1.9} />}
      <span>{label}</span>
      {trailing ?? (count !== undefined && <span className="uwu-sidebar-row-count">{count}</span>)}
    </button>
  );
}

/** A heading between sidebar groups ("Ordner", "Typen"). */
export function SidebarHeading({ children }: { children: ReactNode }) {
  return <h3 className="uwu-sidebar-heading">{children}</h3>;
}
