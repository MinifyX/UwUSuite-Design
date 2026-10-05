import { createContext, useContext, type ReactNode } from "react";

/**
 * The few words the components say themselves (close buttons, window controls). German is the
 * source language of the suite; apps pass their own words through <UwuLabels> when the user
 * picked another language.
 */
export interface Labels {
  close: string;
  minimize: string;
  maximize: string;
  restore: string;
  settings: string;
  loading: string;
}

export const LABELS_DE: Labels = {
  close: "Schließen",
  minimize: "Minimieren",
  maximize: "Maximieren",
  restore: "Verkleinern",
  settings: "Einstellungen",
  loading: "Lädt …",
};

export const LABELS_EN: Labels = {
  close: "Close",
  minimize: "Minimize",
  maximize: "Maximize",
  restore: "Restore",
  settings: "Settings",
  loading: "Loading…",
};

const LabelsContext = createContext<Labels>(LABELS_DE);

export function UwuLabels({ labels, children }: { labels: Partial<Labels> | "de" | "en"; children: ReactNode }) {
  const value = labels === "de" ? LABELS_DE : labels === "en" ? LABELS_EN : { ...LABELS_DE, ...labels };
  return <LabelsContext.Provider value={value}>{children}</LabelsContext.Provider>;
}

export function useLabels() {
  return useContext(LabelsContext);
}
