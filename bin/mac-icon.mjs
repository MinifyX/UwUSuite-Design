// The macOS shapes for uwu-icons, as SVG strings: the Dock master in Apple's icon grid and the
// menu bar template. No Node imports, so the styleguide draws its previews with the same code.
//
// macOS draws no frame around an app icon: the file has to be the frame. Apple's grid puts the
// tile at 824 of 1024 pixels, centred, with a soft shadow in the 100 pixel margin, and every icon
// in the Dock is drawn to it. A full-bleed tile looks a size too big next to everyone else's.
// From UwUNotes 0.6 (scripts/icons.mjs).

/** Apple's macOS icon grid, in pixels of the 1024 canvas. */
export const MAC_GRID = {
  canvas: 1024,
  tile: 824,
  /** The drop shadow of Apple's icon templates: straight down, soft, black. */
  shadow: { dy: 10, blur: 6, opacity: 0.3 },
};

/**
 * Apple's rounded square: a superellipse, |x|^5 + |y|^5 = 1, rather than a rectangle with
 * circular corners. The curvature runs out smoothly into the sides instead of starting at a
 * point, which is what makes a macOS icon look like one. At the tile size of the grid its corner
 * matches Apple's radius of about 185 pixels.
 */
export function squirclePath(x, y, size, exponent = 5, steps = 720) {
  const half = size / 2;
  const points = [];
  for (let i = 0; i < steps; i++) {
    const angle = (i / steps) * 2 * Math.PI;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const px = Math.sign(cos) * Math.abs(cos) ** (2 / exponent);
    const py = Math.sign(sin) * Math.abs(sin) ** (2 / exponent);
    points.push(`${(x + half + px * half).toFixed(2)} ${(y + half + py * half).toFixed(2)}`);
  }
  return `M${points.join("L")}Z`;
}

/** The opening tag, viewBox and content of an SVG document. */
function parts(svg, what) {
  const open = svg.match(/<svg\b[^>]*>/);
  if (!open) throw new Error(`The ${what} is not an SVG.`);
  const viewBox = open[0].match(/viewBox="([^"]+)"/)?.[1];
  if (!viewBox) throw new Error(`The ${what} has no viewBox, so it cannot be scaled.`);
  const end = svg.lastIndexOf("</svg>");
  if (end < 0) throw new Error(`The ${what} has no closing </svg>.`);
  return { viewBox, inner: svg.slice(open.index + open[0].length, end) };
}

/**
 * The macOS master: the app icon, whatever it draws, scaled into the tile of Apple's grid and
 * clipped to its rounded square, over the shadow. Clipping is what makes this work for any
 * artwork: a tile with corners of its own keeps them where they are rounder than Apple's, a
 * square one gets Apple's. `id` keeps the ids apart when several masters share one page.
 */
export function macMasterSvg(appIconSvg, id = "mac") {
  const { viewBox, inner } = parts(appIconSvg, "app icon");
  const { canvas, tile, shadow } = MAC_GRID;
  const margin = (canvas - tile) / 2;
  const shape = squirclePath(margin, margin, tile);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${canvas} ${canvas}" width="${canvas}" height="${canvas}">
  <defs>
    <clipPath id="${id}-tile"><path d="${shape}"/></clipPath>
    <filter id="${id}-shadow" x="-10%" y="-10%" width="120%" height="125%">
      <feGaussianBlur stdDeviation="${shadow.blur}"/>
    </filter>
  </defs>
  <path d="${shape}" transform="translate(0 ${shadow.dy})" fill="#000" fill-opacity="${shadow.opacity}" filter="url(#${id}-shadow)"/>
  <g clip-path="url(#${id}-tile)">
    <svg x="${margin}" y="${margin}" width="${tile}" height="${tile}" viewBox="${viewBox}" preserveAspectRatio="xMidYMid meet">${inner}</svg>
  </g>
</svg>
`;
}

/** The menu bar icon's size: 18 points high, drawn at 2x. */
export const TRAY_TEMPLATE_SIZE = 36;

/** How much thicker the mono symbol's outlines get in the menu bar: 9 → 13.5 on the 256 grid. */
export const TRAY_STROKE = 1.5;

/**
 * The macOS menu bar template from an app's mono symbol (`<app>-symbol-mono.svg`, outlines in
 * `currentColor`): black on transparent, outlines 1.5 times as thick, because at 18 points the
 * symbol's own stroke is barely more than a pixel. macOS tints the template for light and dark
 * menu bars. A hand-drawn `<app>-tray-template.svg` wins when it exists.
 */
export function trayTemplateSvg(monoSvg, weight = TRAY_STROKE) {
  if (!/<svg\b/.test(monoSvg)) throw new Error("The mono symbol is not an SVG.");
  return monoSvg
    .replace(/stroke-width="([\d.]+)"/g, (_, width) => `stroke-width="${+(Number(width) * weight).toFixed(2)}"`)
    .replace(/<svg\b/, '<svg color="#000"');
}
