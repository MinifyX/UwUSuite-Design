import { clsx } from "clsx";
import type { KeyboardEvent, ReactNode } from "react";

export interface SegmentedProps<T extends string> {
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: ReactNode }[];
  /** Name of the group for screen readers. */
  label: string;
  className?: string;
}

/** Two to four choices of which exactly one is on, e.g. System · Hell · Dunkel. */
export function Segmented<T extends string>({ value, onChange, options, label, className }: SegmentedProps<T>) {
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const index = options.findIndex((option) => option.value === value);
    const step = event.key === "ArrowRight" ? 1 : -1;
    const next = options[(index + step + options.length) % options.length];
    if (next) {
      onChange(next.value);
      const buttons = event.currentTarget.querySelectorAll<HTMLButtonElement>("[role=radio]");
      buttons[options.indexOf(next)]?.focus();
    }
  };
  return (
    <div
      role="radiogroup"
      aria-label={label}
      onKeyDown={onKeyDown}
      className={clsx("inline-flex self-start rounded-full bg-canvas p-1", className)}
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={value === option.value}
          tabIndex={value === option.value ? 0 : -1}
          onClick={() => onChange(option.value)}
          className={clsx(
            "h-8 rounded-full px-4 text-meta font-semibold transition-colors",
            value === option.value ? "bg-surface text-pink-ink shadow-sm" : "text-muted hover:text-ink",
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
