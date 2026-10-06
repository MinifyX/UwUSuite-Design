import { clsx } from "clsx";
import { ArrowLeft, ChevronLeft, type LucideIcon } from "lucide-react";
import { forwardRef, useRef, type ButtonHTMLAttributes, type ReactNode, type RefObject } from "react";
import { useLabels } from "../lib/labels.js";
import type { MobilePlatform } from "./device.js";
import { useEdgeBack, useMobilePlatform, usePredictiveBack, useScrolledPast } from "./hooks.js";
import { PullToRefresh } from "./PullToRefresh.js";

export interface NavButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** The accessible name; also the tooltip. */
  label: string;
  icon?: LucideIcon;
  /** Shows `label` as text ("Fertig", "Sichern") instead of an icon. */
  text?: boolean;
  /** The one primary action of a sheet (pink). */
  tint?: boolean;
  platform?: MobilePlatform;
}

/** A toolbar button: round Liquid Glass on iOS, a plain 48 px icon button on Android. */
export const NavButton = forwardRef<HTMLButtonElement, NavButtonProps>(function NavButton(
  { label, icon: Glyph, text, tint, platform: explicit, className, children, ...rest },
  ref,
) {
  const platform = useMobilePlatform(explicit);
  const showText = text || !Glyph;
  return (
    <button
      ref={ref}
      type="button"
      aria-label={showText ? undefined : label}
      title={showText ? undefined : label}
      data-label={showText ? "" : undefined}
      data-tint={tint ? "" : undefined}
      className={clsx("uwu-nav-button", platform !== "android" && !tint && "uwu-glass", className)}
      {...rest}
    >
      {children ?? (showText ? label : Glyph && <Glyph aria-hidden strokeWidth={1.9} />)}
    </button>
  );
});

/** Back: a round glass chevron on iOS, an arrow on Android. */
export function BackButton({ onClick, platform: explicit }: { onClick: () => void; platform?: MobilePlatform }) {
  const platform = useMobilePlatform(explicit);
  const labels = useLabels();
  return (
    <NavButton
      platform={platform}
      label={labels.back}
      icon={platform === "android" ? ArrowLeft : ChevronLeft}
      onClick={onClick}
    />
  );
}

export interface NavBarProps {
  title: ReactNode;
  /** Left slot: the account avatar on a root page, else the back button (`onBack`). */
  leading?: ReactNode;
  /** Right slot: "+" on iOS root pages, "Bearbeiten", a menu. */
  trailing?: ReactNode;
  onBack?: () => void;
  /** True once the large title scrolled away: the small title and the backdrop fade in. */
  collapsed?: boolean;
  /** No large title on this page: the small title is always there. */
  inline?: boolean;
  /** A root page (Android: the title starts at the left edge). */
  root?: boolean;
  platform?: MobilePlatform;
  className?: string;
}

/** The navigation bar of a phone page. Usually rendered by <Screen>. */
export function NavBar({
  title,
  leading,
  trailing,
  onBack,
  collapsed,
  inline,
  root,
  platform: explicit,
  className,
}: NavBarProps) {
  const platform = useMobilePlatform(explicit);
  return (
    <header
      className={clsx("uwu-navbar", className)}
      data-platform={platform}
      data-collapsed={collapsed ? "" : undefined}
      data-inline={inline ? "" : undefined}
      data-root={root ? "" : undefined}
    >
      <div className="uwu-navbar-side" data-side="leading">
        {leading ?? (onBack && <BackButton platform={platform} onClick={onBack} />)}
      </div>
      <div className="uwu-navbar-title" aria-hidden={inline ? undefined : !collapsed}>
        {title}
      </div>
      <div className="uwu-navbar-side" data-side="trailing">
        {trailing}
      </div>
    </header>
  );
}

export interface ScreenProps {
  title: string;
  /** A line under the large title ("Synchronisiert gerade eben"). */
  subtitle?: ReactNode;
  /** Root pages of a tab have a large title that collapses into the bar; pushed pages don't. */
  largeTitle?: boolean;
  leading?: ReactNode;
  trailing?: ReactNode;
  /** Shows the back button, and turns on edge-swipe back (iOS) or predictive back (Android). */
  onBack?: () => void;
  /** The page below, for the iOS edge swipe to slide in. */
  underRef?: RefObject<HTMLElement | null>;
  /** Pull to refresh (sync) on this page. */
  onRefresh?: () => Promise<unknown> | void;
  /** Android: a search bar takes the top instead of the app bar. */
  searchBar?: ReactNode;
  platform?: MobilePlatform;
  children: ReactNode;
  className?: string;
}

/**
 * One phone page: navigation bar, scroll area, large title, pull to refresh and the back
 * gestures. Push pages in with `uwu-push-in` on the className.
 */
export function Screen({
  title,
  subtitle,
  largeTitle = false,
  leading,
  trailing,
  onBack,
  underRef,
  onRefresh,
  searchBar,
  platform: explicit,
  children,
  className,
}: ScreenProps) {
  const platform = useMobilePlatform(explicit);
  const page = useRef<HTMLDivElement>(null);
  const scroll = useRef<HTMLDivElement>(null);
  const collapsed = useScrolledPast(scroll, largeTitle ? 36 : 4);
  const back = { onBack: onBack ?? (() => {}), enabled: !!onBack && platform !== "ipad", underRef };
  // Both hooks are always called; only the platform's own is enabled.
  useEdgeBack(page, { ...back, enabled: back.enabled && platform === "ios" });
  usePredictiveBack(page, { ...back, enabled: back.enabled && platform === "android" });

  const body = (
    <>
      {largeTitle && (
        <>
          <h1 className="uwu-large-title">{title}</h1>
          {subtitle && <p className="uwu-large-title-sub">{subtitle}</p>}
        </>
      )}
      {children}
    </>
  );

  return (
    <section
      ref={page}
      aria-label={title}
      className={clsx("uwu-screen", className)}
      data-platform={platform}
      data-search={searchBar ? "" : undefined}
    >
      <div ref={scroll} className="uwu-screen-scroll">
        {onRefresh ? (
          <PullToRefresh onRefresh={onRefresh} scrollRef={scroll} platform={platform}>
            {body}
          </PullToRefresh>
        ) : (
          body
        )}
      </div>
      {searchBar ?? (
        <NavBar
          title={title}
          leading={leading}
          trailing={trailing}
          onBack={onBack}
          collapsed={collapsed}
          inline={!largeTitle}
          root={!onBack}
          platform={platform}
        />
      )}
    </section>
  );
}
