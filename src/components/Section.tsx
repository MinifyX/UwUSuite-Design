import { clsx } from "clsx";
import { useId, type HTMLAttributes, type ReactNode } from "react";

export interface SectionProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  /** The group title; the section is named by it. */
  title?: ReactNode;
  /** One muted line under the title that says what the part is for. */
  lead?: ReactNode;
  /** Buttons on the right of the title. */
  actions?: ReactNode;
  /** The heading level: 3 (default) inside a page with its own h2, 2 directly under the page title. */
  level?: 2 | 3;
}

/** A part of a page or of a settings page: group title, lead line, then the content with an even gap. */
export function Section({ title, lead, actions, level = 3, className, children, ...rest }: SectionProps) {
  const id = useId();
  const Heading = level === 2 ? "h2" : "h3";
  return (
    <section
      aria-labelledby={title ? `${id}-title` : undefined}
      className={clsx("flex min-w-0 flex-col gap-3", className)}
      {...rest}
    >
      {(title || lead || actions) && (
        <div className="flex flex-wrap items-start gap-x-3 gap-y-2">
          <div className="flex min-w-[min(100%,14rem)] flex-1 flex-col gap-0.5">
            {title && (
              <Heading id={`${id}-title`} className="text-badge font-bold tracking-wide text-muted uppercase">
                {title}
              </Heading>
            )}
            {lead && <p className="text-meta text-muted">{lead}</p>}
          </div>
          {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
        </div>
      )}
      {children}
    </section>
  );
}
