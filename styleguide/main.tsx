import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  applyUiFont,
  FONT_CHOICES,
  FONT_NAMES,
  Segmented,
  Select,
  useAppearance,
  Wordmark,
  type ContrastSetting,
  type FontChoice,
  type MotionSetting,
  type ThemeSetting,
} from "../src";
import { Colors } from "./sections/Colors";
import { Components } from "./sections/Components";
import { AppIcons, Icons } from "./sections/Icons";
import { Intro, Usage } from "./sections/Intro";
import { Motion, Tone, Window } from "./sections/More";
import { NyuSection } from "./sections/Nyu";
import { Typography } from "./sections/Typography";
import "./styles.css";

const KEY = "uwusuite-design.settings";

interface Settings {
  theme: ThemeSetting;
  contrast: ContrastSetting;
  motion: MotionSetting;
  font: FontChoice;
}

function load(): Settings {
  const fallback: Settings = { theme: "system", contrast: "system", motion: "system", font: "uwu" };
  try {
    return { ...fallback, ...JSON.parse(localStorage.getItem(KEY) ?? "{}") };
  } catch {
    return fallback;
  }
}

const SECTIONS = [
  ["grundsaetze", "Grundsätze"],
  ["farben", "Farben"],
  ["schrift", "Schrift"],
  ["icons", "Icons"],
  ["app-icons", "App-Icons"],
  ["nyu", "Nyu"],
  ["komponenten", "Komponenten"],
  ["fenster", "Fenster"],
  ["bewegung", "Bewegung"],
  ["ton", "Ton"],
  ["nutzung", "Nutzung"],
] as const;

function App() {
  const [settings, setSettings] = useState(load);
  const update = (patch: Partial<Settings>) => setSettings((current) => ({ ...current, ...patch }));
  useAppearance(settings);

  useEffect(() => {
    applyUiFont(settings.font);
    try {
      localStorage.setItem(KEY, JSON.stringify(settings));
    } catch {
      // Private windows may refuse storage; the page works without it.
    }
  }, [settings]);

  return (
    <div className="min-h-full">
      <header className="z-[var(--uwu-z-sticky)] border-b border-hairline bg-canvas/85 backdrop-blur sm:sticky sm:top-0">
        <div className="mx-auto flex max-w-[1240px] flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3 sm:px-6">
          <a href="#top" className="text-[19px]">
            <Wordmark product="Suite" shell="box" />
            <span className="ml-2 align-middle text-meta font-semibold text-muted">Design 1.0</span>
          </a>
          <div className="ml-auto flex flex-wrap items-center gap-2">
            <Segmented
              label="Design"
              value={settings.theme}
              onChange={(theme) => update({ theme })}
              options={[
                { value: "system", label: "System" },
                { value: "light", label: "Hell" },
                { value: "dark", label: "Dunkel" },
              ]}
            />
            <Segmented
              label="Kontrast"
              value={settings.contrast}
              onChange={(contrast) => update({ contrast })}
              options={[
                { value: "system", label: "Kontrast: System" },
                { value: "high", label: "Hoch" },
              ]}
            />
            <Segmented
              label="Animationen"
              value={settings.motion}
              onChange={(motion) => update({ motion })}
              options={[
                { value: "system", label: "Animation: System" },
                { value: "off", label: "Aus" },
              ]}
            />
            <Select
              aria-label="Schrift"
              value={settings.font}
              onChange={(event) => update({ font: event.target.value as FontChoice })}
              className="w-[150px] [&_select]:h-10"
            >
              {FONT_CHOICES.map((choice) => (
                <option key={choice} value={choice}>
                  {choice === "system" ? "Systemschrift" : FONT_NAMES[choice]}
                </option>
              ))}
            </Select>
          </div>
        </div>
      </header>
      <div className="mx-auto grid max-w-[1240px] gap-10 px-4 pb-24 sm:px-6 lg:grid-cols-[180px_1fr]">
        <nav aria-label="Inhalt" className="sticky top-[88px] hidden self-start pt-10 lg:block">
          <ul className="flex flex-col gap-0.5">
            {SECTIONS.map(([id, label]) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className="flex h-9 items-center rounded-xl px-3 text-[13.5px] font-medium text-ink/85 hover:bg-pink-tint/50"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <main id="top" className="flex min-w-0 flex-col gap-20 pt-10">
          <Intro />
          <Colors />
          <Typography />
          <Icons />
          <AppIcons />
          <NyuSection />
          <Components />
          <Window />
          <Motion />
          <Tone />
          <Usage />
        </main>
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
