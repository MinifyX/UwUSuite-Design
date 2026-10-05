/** Apple's macOS icon grid, in pixels of the 1024 canvas. */
export declare const MAC_GRID: {
  canvas: number;
  tile: number;
  shadow: { dy: number; blur: number; opacity: number };
};
export declare function squirclePath(x: number, y: number, size: number, exponent?: number, steps?: number): string;
/** The app icon set into Apple's grid, clipped to its rounded square, over the shadow. */
export declare function macMasterSvg(appIconSvg: string, id?: string): string;
/** The menu bar icon's size: 18 points high, drawn at 2x. */
export declare const TRAY_TEMPLATE_SIZE: number;
/** How much thicker the mono symbol's outlines get in the menu bar. */
export declare const TRAY_STROKE: number;
/** The macOS menu bar template from an app's mono symbol. */
export declare function trayTemplateSvg(monoSvg: string, weight?: number): string;
