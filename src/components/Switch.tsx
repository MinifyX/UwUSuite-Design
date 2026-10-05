import { clsx } from "clsx";
import { useId, type ReactNode } from "react";

export interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** Name for screen readers when no visible label points at the switch. */
  label?: string;
  id?: string;
  disabled?: boolean;
  size?: "sm" | "md";
}

/** The bare on/off switch: pink when on, the control outline colour when off. */
export function Switch({ checked, onChange, label, id, disabled, size = "md" }: SwitchProps) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={clsx(
        "relative shrink-0 rounded-full transition-colors duration-200 disabled:opacity-55",
        size === "md" ? "h-6 w-11" : "h-5 w-9",
        checked ? "bg-pink-solid" : "bg-control/70",
      )}
    >
      <span
        className={clsx(
          "absolute top-0.5 left-0.5 rounded-full bg-white shadow transition-transform duration-200",
          size === "md" ? "size-5" : "size-4",
          checked && (size === "md" ? "translate-x-5" : "translate-x-4"),
        )}
      />
    </button>
  );
}

export interface ToggleProps extends Omit<SwitchProps, "label" | "id"> {
  label: ReactNode;
  description?: ReactNode;
}

/** A setting that is on or off: label and description on the left, the switch on the right. */
export function Toggle({ label, description, ...rest }: ToggleProps) {
  const id = useId();
  return (
    <div className="flex items-start justify-between gap-6">
      <label htmlFor={id} className="flex flex-col gap-0.5">
        <span className="text-body font-semibold">{label}</span>
        {description && <span className="text-meta text-muted">{description}</span>}
      </label>
      <span className="mt-0.5">
        <Switch id={id} {...rest} />
      </span>
    </div>
  );
}
