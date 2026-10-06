import { clsx } from "clsx";
import { Nyu, type NyuShell } from "../nyu/Nyu.js";

export interface WordmarkProps {
  /** The part after "UwU": "Mail", "Mirror", "Notes", "Suite". */
  product: string;
  /** The app's Nyu. Leave out for text only. */
  shell?: NyuShell;
  /** Changing this number makes Nyu hop once, e.g. when new mail arrives. */
  hop?: number;
  className?: string;
}

/**
 * The app's name as a logo: Nyu, then "UwU" in pink and the product in ink, extra bold, slightly
 * tight. "UwU" uses --uwu-pink-solid, which stays readable at title-bar size (docs/brand.md).
 */
export function Wordmark({ product, shell, hop = 0, className }: WordmarkProps) {
  return (
    <span className={clsx("inline-flex items-center gap-2 font-extrabold tracking-[-0.02em]", className)}>
      {shell && (
        <span key={hop} className={clsx("inline-flex", hop > 0 && "nyu-logo-hop")}>
          <Nyu shell={shell} size="1.35em" blink={false} title="" />
        </span>
      )}
      <span>
        <span className="text-pink-solid">UwU</span>
        {product}
      </span>
    </span>
  );
}
