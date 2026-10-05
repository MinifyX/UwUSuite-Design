import { createLucideIcon, type LucideIconNode } from "lucide-react";

/**
 * The suite's own icons: what Lucide doesn't have. Drawn by the same rules as Lucide
 * (docs/icons.md): 24 × 24 grid, 2 px padding, stroke only, round caps and joins, no fills, no
 * text. They take the same props as a Lucide icon. scripts/check-icons.mjs checks every node.
 */

export const SUITE_ICON_NODES = {
  /** Android phones (UwUMirror, UwUMail's device list). The robot head, no logo colours. */
  android: [
    ["path", { d: "M6 17V11a6 6 0 0 1 12 0v6z", key: "head" }],
    ["path", { d: "M8.5 5.5 7 3.5", key: "al" }],
    ["path", { d: "M15.5 5.5 17 3.5", key: "ar" }],
    ["path", { d: "M10 10h.01", key: "el" }],
    ["path", { d: "M14 10h.01", key: "er" }],
    ["path", { d: "M4 13v4", key: "hl" }],
    ["path", { d: "M20 13v4", key: "hr" }],
    ["path", { d: "M9.5 17v3.5", key: "fl" }],
    ["path", { d: "M14.5 17v3.5", key: "fr" }],
  ],
  /** Nyu's paw: pets, "Nyu" settings, easter eggs. Never as the app's logo. */
  paw: [
    ["path", { d: "M12 20.5c-3 0-5.5-1.6-5.5-4 0-2.6 2.6-4.5 5.5-4.5s5.5 1.9 5.5 4.5c0 2.4-2.5 4-5.5 4Z", key: "pad" }],
    ["circle", { cx: "5", cy: "10", r: "1.8", key: "t1" }],
    ["circle", { cx: "9.2", cy: "5.8", r: "1.8", key: "t2" }],
    ["circle", { cx: "14.8", cy: "5.8", r: "1.8", key: "t3" }],
    ["circle", { cx: "19", cy: "10", r: "1.8", key: "t4" }],
  ],
  /**
   * Nyu's face as a line icon, the same cat as U+E000 in UwU Sans: Nyu menus, "about", the
   * mascot setting. Not a replacement for the coloured Nyu artwork.
   */
  nyu: [
    ["path", { d: "M4 19V7.5L7.5 3l3 4h3l3-4L20 7.5V19a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z", key: "head" }],
    ["path", { d: "M8.5 12.5v.5", key: "el" }],
    ["path", { d: "M15.5 12.5v.5", key: "er" }],
    ["path", { d: "M10 16q1 1.2 2 0q1 1.2 2 0", key: "mouth" }],
  ],
  /** A hand mirror: UwUMirror in suite menus and the website. */
  "hand-mirror": [
    ["ellipse", { cx: "12", cy: "9.5", rx: "6.5", ry: "6.5", key: "frame" }],
    ["path", { d: "M12 16v5.5", key: "handle" }],
    ["path", { d: "M9 7.5a3.5 3.5 0 0 1 2.5-2", key: "shine" }],
  ],
  /** Two devices with the sync arrows between them (UwUSync, settings sync). */
  "devices-sync": [
    ["rect", { x: "2.5", y: "4", width: "8", height: "12", rx: "2", key: "a" }],
    ["rect", { x: "13.5", y: "8", width: "8", height: "12", rx: "2", key: "b" }],
    ["path", { d: "M10.5 19.5h-3", key: "arrow-b" }],
    ["path", { d: "M9 18l-1.5 1.5L9 21", key: "arrow-b-head" }],
    ["path", { d: "M13.5 4.5h3", key: "arrow-a" }],
    ["path", { d: "M15 3l1.5 1.5L15 6", key: "arrow-a-head" }],
  ],
} satisfies Record<string, LucideIconNode[]>;

export type SuiteIconName = keyof typeof SUITE_ICON_NODES;

export const Android = createLucideIcon("android", SUITE_ICON_NODES.android);
export const Paw = createLucideIcon("paw", SUITE_ICON_NODES.paw);
export const NyuFaceIcon = createLucideIcon("nyu", SUITE_ICON_NODES.nyu);
export const HandMirror = createLucideIcon("hand-mirror", SUITE_ICON_NODES["hand-mirror"]);
export const DevicesSync = createLucideIcon("devices-sync", SUITE_ICON_NODES["devices-sync"]);
