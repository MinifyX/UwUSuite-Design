import { clsx } from "clsx";
import { ChevronDown } from "lucide-react";
import {
  forwardRef,
  useId,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";

export interface FieldProps {
  label: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  /** Gets the id the control must use, so the label points at it. */
  children: (id: string, describedBy: string | undefined) => ReactNode;
  className?: string;
}

/** Label above, control, then either the error or the hint. */
export function Field({ label, hint, error, children, className }: FieldProps) {
  const id = useId();
  const noteId = `${id}-note`;
  return (
    <div className={clsx("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-meta font-semibold text-muted">
        {label}
      </label>
      {children(id, error || hint ? noteId : undefined)}
      {error ? (
        <p id={noteId} role="alert" className="text-meta text-danger-ink">
          {error}
        </p>
      ) : (
        hint && (
          <p id={noteId} className="text-caption text-muted">
            {hint}
          </p>
        )
      )}
    </div>
  );
}

export const CONTROL_CLASS =
  "h-11 w-full rounded-control border border-control/60 bg-surface px-3.5 text-body text-ink placeholder:text-faint transition-shadow focus:border-pink focus:shadow-focus focus:outline-none aria-invalid:border-danger disabled:opacity-55";

export const TextInput = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(function TextInput(
  { className, ...rest },
  ref,
) {
  return <input ref={ref} className={clsx(CONTROL_CLASS, className)} {...rest} />;
});

export const TextArea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(function TextArea(
  { className, ...rest },
  ref,
) {
  return <textarea ref={ref} className={clsx(CONTROL_CLASS, "h-auto min-h-24 py-2.5", className)} {...rest} />;
});

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(function Select(
  { className, children, ...rest },
  ref,
) {
  return (
    <span className={clsx("relative block", className)}>
      <select ref={ref} className={clsx(CONTROL_CLASS, "appearance-none pr-10")} {...rest}>
        {children}
      </select>
      <ChevronDown
        className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-muted"
        strokeWidth={1.8}
        aria-hidden
      />
    </span>
  );
});
