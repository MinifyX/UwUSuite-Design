import { Check, X } from "lucide-react";
import type { ReactNode } from "react";
import { cx, Icon } from "../../src";

export function Section({
  id,
  title,
  lead,
  children,
}: {
  id: string;
  title: string;
  lead?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section id={id} className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h2 className="text-[28px] font-extrabold tracking-[-0.02em]">{title}</h2>
        {lead && <p className="max-w-[720px] text-reading leading-[var(--uwu-leading-reading)] text-muted">{lead}</p>}
      </header>
      {children}
    </section>
  );
}

export function Sub({ title, children, className }: { title: string; children: ReactNode; className?: string }) {
  return (
    <div className={cx("flex flex-col gap-3", className)}>
      <h3 className="text-caption font-bold tracking-wide text-muted uppercase">{title}</h3>
      {children}
    </div>
  );
}

/** Rules as a list of do's and don'ts. */
export function Rules({ items }: { items: [boolean, ReactNode][] }) {
  return (
    <ul className="grid gap-2 sm:grid-cols-2">
      {items.map(([good, text], index) => (
        <li
          key={index}
          className="flex gap-2.5 rounded-control border border-hairline bg-surface px-3.5 py-2.5 text-meta"
        >
          <span
            className={cx(
              "mt-px grid size-5 shrink-0 place-items-center rounded-full",
              good ? "bg-success-tint text-success-ink" : "bg-danger-tint text-danger-ink",
            )}
          >
            <Icon icon={good ? Check : X} size="xs" />
          </span>
          <span>{text}</span>
        </li>
      ))}
    </ul>
  );
}

export function Code({ children }: { children: string }) {
  return (
    <pre className="selectable overflow-x-auto rounded-card border border-hairline bg-surface p-4 text-[12.5px] leading-relaxed">
      <code>{children}</code>
    </pre>
  );
}

export function Panel({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cx("rounded-card border border-hairline bg-surface p-5", className)}>{children}</div>;
}
