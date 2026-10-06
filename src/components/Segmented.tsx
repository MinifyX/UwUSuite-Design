import { clsx } from "clsx";
import type { KeyboardEvent, ReactNode } from "react";

export interface SegmentedOption<T extends string> {
  value: T;
  label: ReactNode;
  /** This one choice can't be picked right now (the others still can). */
  disabled?: boolean;
}

export interface SegmentedProps<T extends string> {
  value: T;
  onChange: (value: T) => void;
  options: SegmentedOption<T>[];
  /** Name of the group for screen readers. */
  label: string;
  /** The whole control is greyed out and can't be changed, e.g. while a request runs. */
  disabled?: boolean;
  className?: string;
}

/** Two to four choices of which exactly one is on, e.g. System · Hell · Dunkel. */
export function Segmented<T extends string>({
  value,
  onChange,
  options,
  label,
  disabled = false,
  className,
}: SegmentedProps<T>) {
  const usable = (option: SegmentedOption<T>) => !disabled && !option.disabled;
  // The tab stop is the chosen option; if that one is disabled, the first usable one.
  const chosen = options.find((option) => option.value === value);
  const tabStop = chosen && usable(chosen) ? chosen : options.find(usable);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    if (disabled) return;
    const step = event.key === "ArrowRight" ? 1 : -1;
    const start = Math.max(
      options.findIndex((option) => option.value === value),
      0,
    );
    // Skip disabled options; stop after one round if none is usable.
    for (let i = 1; i <= options.length; i++) {
      const index = (start + step * i + options.length * i) % options.length;
      const next = options[index];
      if (!next || !usable(next)) continue;
      if (next.value !== value) onChange(next.value);
      event.currentTarget.querySelectorAll<HTMLButtonElement>("[role=radio]")[index]?.focus();
      return;
    }
  };

  return (
    <div
      role="radiogroup"
      aria-label={label}
      aria-disabled={disabled || undefined}
      onKeyDown={onKeyDown}
      className={clsx("inline-flex self-start rounded-full bg-canvas p-1", disabled && "opacity-55", className)}
    >
      {options.map((option) => {
        const checked = value === option.value;
        const off = !usable(option);
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={checked}
            disabled={off}
            tabIndex={option === tabStop ? 0 : -1}
            onClick={() => onChange(option.value)}
            className={clsx(
              "h-8 rounded-full px-4 text-meta font-semibold transition-colors disabled:cursor-not-allowed",
              checked
                ? // High contrast: canvas and surface are the same colour, so the choice also gets a
                  // shape (an ink outline, 7:1 or more) and doesn't depend on colour alone.
                  "bg-surface text-pink-ink shadow-sm contrast-high:outline-2 contrast-high:-outline-offset-2 contrast-high:outline-ink"
                : "text-muted enabled:hover:text-ink",
              // A single disabled option fades; a disabled group already fades as a whole.
              off && !disabled && "opacity-55",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
