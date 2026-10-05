/**
 * Nyu, the UwU cat, as SVG strings: every app's shell in one place, the canonical catalogue of
 * the family (docs/nyu.md). Works in Node and in the browser, without React, so the website, the
 * styleguide, installers and build scripts can draw Nyu too (`@uwusuite/design/nyu-svg`).
 *
 * Moved here from UwUSuite-Website (src/assets/js/nyu.mjs).
 *
 * The artwork follows the apps: UwUMail-Client/apps/desktop/src/components/nyu
 * (envelope), UwUSSH-Client/apps/desktop/src/components/nyu (terminal) and
 * UwURDP-Client/apps/desktop/src/components/nyu (monitor),
 * UwULock-Client/apps/desktop/src/components/nyu (padlock),
 * UwUMirror/apps/desktop/src/components/nyu (hand mirror) and
 * UwUAuth-Server/web/public/nyu.svg (ID badge). The
 * box is new and belongs to the suite, drawn with the terminal cat's line
 * weights. Colors are fixed artwork, the same in light and dark mode; the white
 * die-cut edge keeps the outlines readable on dark ground.
 */

export const NYU = {
  ink: "#4B1D3F",
  body: "#FF6FA6",
  flap: "#FFB8D3",
  blush: "#FF7FB0",
  blushSolid: "#FF4D8D",
  paper: "#FFFFFF",
  star: "#FFD66E",
  tear: "#9ED8FF",
  lilac: "#CDB8FF",
  violet: "#A78BFA",
  mint: "#B9F0D0",
  sky: "#BDE6FF",
  kraft: "#F2C58F",
  kraftLight: "#F8DDB8",
  kraftDark: "#E3AE6F",
  cloud: "#ECE6F4",
  tile: "#FFE4EF",
} as const;

export const MOODS = ["uwu", "happy", "cheer", "sparkle", "sad", "puzzled", "sleepy"] as const;
export type NyuMood = (typeof MOODS)[number];
export const SHELLS = ["box", "mail", "terminal", "monitor", "page", "lock", "mirror", "badge"] as const;
export type NyuShell = (typeof SHELLS)[number];

/** Extra parts drawn behind or in front of the figure, in the shell's own coordinates. */
export interface NyuExtra {
  behind?: string;
  front?: string;
}

const escapeAttr = (value: string) => value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

/** Draws its children twice: first as a white die-cut edge, then as they are. */
const sticker = (edge: number, inner: string) => `<g class="nyu-edge" stroke-width="${edge}">${inner}</g>${inner}`;

/* ------------------------------------------------------------------------ */
/* Envelope cat (UwUMail). Body 100–412 × 152–378 in a 512 grid.             */
/* ------------------------------------------------------------------------ */

const mailLine = `fill="none" stroke="${NYU.ink}" stroke-width="14"`;

const MAIL_EYES: Record<NyuMood, string> = {
  uwu: `<g ${mailLine}><path d="M210 194 v4 a12 12 0 0 0 24 0 v-4"/><path d="M278 194 v4 a12 12 0 0 0 24 0 v-4"/></g>`,
  sleepy: `<g ${mailLine}><path d="M208 202 q14 10 28 0"/><path d="M276 202 q14 10 28 0"/></g>`,
  happy: `<g><g fill="${NYU.ink}"><ellipse cx="222" cy="202" rx="10" ry="13"/><ellipse cx="290" cy="202" rx="10" ry="13"/></g><g fill="${NYU.paper}" class="no-edge"><circle cx="226" cy="196" r="4"/><circle cx="294" cy="196" r="4"/></g></g>`,
  cheer: `<g ${mailLine}><path d="M212 190 L231 201 L212 212"/><path d="M300 190 L281 201 L300 212"/></g>`,
  sparkle: `<g fill="${NYU.star}" stroke="${NYU.ink}" stroke-width="5"><path d="M222 184 Q225 199 240 202 Q225 205 222 220 Q219 205 204 202 Q219 199 222 184Z"/><path d="M290 184 Q293 199 308 202 Q293 205 290 220 Q287 205 272 202 Q287 199 290 184Z"/></g>`,
  sad: `<g><g ${mailLine}><path d="M208 208 q14 -12 28 0"/><path d="M276 208 q14 -12 28 0"/></g><g fill="${NYU.tear}" stroke="${NYU.ink}" stroke-width="5"><path d="M214 214 q-8 12 0 17 q8 -5 0 -17Z"/><path d="M298 214 q-8 12 0 17 q8 -5 0 -17Z"/></g></g>`,
  puzzled: `<g fill="${NYU.ink}"><circle cx="222" cy="202" r="8"/><circle cx="290" cy="202" r="8"/></g>`,
};

const MAIL_W = `<path d="M236 230 q10 13 20 0 q10 13 20 0" ${mailLine}/>`;
const MAIL_MOUTHS: Record<NyuMood, string> = {
  uwu: MAIL_W,
  happy: MAIL_W,
  sparkle: MAIL_W,
  sleepy: `<path d="M244 234 q6 8 12 0 q6 8 12 0" fill="none" stroke="${NYU.ink}" stroke-width="12"/>`,
  cheer: `<g><path d="M238 226 Q256 258 274 226 Z" fill="${NYU.ink}" stroke="${NYU.ink}" stroke-width="10"/><ellipse class="no-edge" cx="256" cy="242" rx="8" ry="5" fill="${NYU.blush}"/></g>`,
  sad: `<path d="M240 242 Q256 228 272 242" fill="none" stroke="${NYU.ink}" stroke-width="12"/>`,
  puzzled: `<g><path d="M242 236 q7 -6 14 0 q7 6 14 0" fill="none" stroke="${NYU.ink}" stroke-width="11"/><path d="M350 180 q-10 14 0 21 q10 -7 0 -21Z" fill="${NYU.tear}" stroke="${NYU.ink}" stroke-width="5"/></g>`,
};

function mailEar(side: "l" | "r") {
  const flip = side === "r" ? ' transform="matrix(-1 0 0 1 512 0)"' : "";
  return `<g class="nyu-ear nyu-ear-${side}"><g${flip}><path d="M118 200 L132 100 Q135 82 151 91 L230 156 Z" fill="${NYU.body}" stroke="${NYU.ink}" stroke-width="14"/><path d="M146 150 L151 116 Q152 108 159 112 L196 144 Z" fill="${NYU.flap}"/></g></g>`;
}

function mailFigure(mood: NyuMood, extra: NyuExtra = {}) {
  const blush =
    mood === "puzzled"
      ? ""
      : `<g fill="${NYU.blush}" class="no-edge"><ellipse cx="194" cy="238" rx="15" ry="8.5"/><ellipse cx="318" cy="238" rx="15" ry="8.5"/></g>`;
  const eyesClass = mood === "sleepy" ? "nyu-look" : "nyu-look nyu-eyes";
  const inner =
    (extra.behind || "") +
    mailEar("l") +
    mailEar("r") +
    `<rect x="100" y="152" width="312" height="226" rx="50" fill="${NYU.body}"/>` +
    `<path d="M100 202 A50 50 0 0 1 150 152 H362 A50 50 0 0 1 412 202 L276 290 Q256 304 236 290 Z" fill="${NYU.flap}"/>` +
    `<rect x="100" y="152" width="312" height="226" rx="50" ${mailLine}/>` +
    `<path d="M108 207 L236 290 Q256 304 276 290 L404 207" ${mailLine}/>` +
    `<g transform="translate(256 216) scale(1.2) translate(-256 -216)">${blush}<g class="nyu-face"><g class="${eyesClass}">${MAIL_EYES[mood]}</g><g class="nyu-look">${MAIL_MOUTHS[mood]}</g></g></g>` +
    (extra.front || "");
  return `<g stroke-linecap="round" stroke-linejoin="round">${sticker(44, inner)}</g>`;
}

/* ------------------------------------------------------------------------ */
/* Terminal cat (UwUSSH). Body 28–228 × 74–220 in a 256 grid.                */
/* ------------------------------------------------------------------------ */

const termLine = `fill="none" stroke="${NYU.ink}" stroke-width="8"`;

const TERM_EYES: Record<NyuMood, string> = {
  uwu: `<g ${termLine}><path d="M88 142 Q102 160 116 142"/><path d="M140 142 Q154 160 168 142"/></g>`,
  happy: `<g><g fill="${NYU.ink}"><ellipse cx="102" cy="148" rx="8" ry="10"/><ellipse cx="154" cy="148" rx="8" ry="10"/></g><g fill="${NYU.paper}" class="no-edge"><circle cx="105" cy="144" r="3"/><circle cx="157" cy="144" r="3"/></g></g>`,
  cheer: `<g ${termLine}><path d="M92 138 L110 148 L92 158"/><path d="M164 138 L146 148 L164 158"/></g>`,
  sparkle: `<g fill="${NYU.star}" stroke="${NYU.ink}" stroke-width="4"><path d="M102 134 Q104 146 116 148 Q104 150 102 162 Q100 150 88 148 Q100 146 102 134Z"/><path d="M154 134 Q156 146 168 148 Q156 150 154 162 Q152 150 140 148 Q152 146 154 134Z"/></g>`,
  sad: `<g><g ${termLine}><path d="M90 152 Q102 142 114 152"/><path d="M142 152 Q154 142 166 152"/></g><g fill="${NYU.tear}" stroke="${NYU.ink}" stroke-width="4"><path d="M94 158 q-6 9 0 13 q6 -4 0 -13Z"/><path d="M162 158 q-6 9 0 13 q6 -4 0 -13Z"/></g></g>`,
  puzzled: `<g fill="${NYU.ink}"><circle cx="102" cy="148" r="7"/><circle cx="154" cy="148" r="7"/></g>`,
  sleepy: `<g ${termLine}><path d="M90 150 q12 8 24 0"/><path d="M142 150 q12 8 24 0"/></g>`,
};

const TERM_W = `<path d="M112 170 q8 13 16 0 q8 13 16 0" ${termLine}/>`;
const TERM_MOUTHS: Record<NyuMood, string> = {
  uwu: TERM_W,
  happy: TERM_W,
  sparkle: TERM_W,
  cheer: `<path d="M114 170 Q128 194 142 170 Z" fill="${NYU.ink}" stroke="${NYU.ink}" stroke-width="6"/>`,
  sad: `<path d="M114 184 Q128 172 142 184" ${termLine}/>`,
  puzzled: `<path d="M114 180 q7 -6 14 0 q7 6 14 0" fill="none" stroke="${NYU.ink}" stroke-width="7"/>`,
  sleepy: `<path d="M120 180 q4 5 8 0 q4 5 8 0" fill="none" stroke="${NYU.ink}" stroke-width="6"/>`,
};

/** Face parts of the terminal cat, also used by the box cat one step higher. */
function catFace(mood: NyuMood, dy = 0) {
  const blush =
    mood === "puzzled"
      ? ""
      : `<g class="no-edge" fill="${NYU.blushSolid}" opacity="0.5"><ellipse cx="74" cy="168" rx="12" ry="7.5"/><ellipse cx="182" cy="168" rx="12" ry="7.5"/></g>`;
  const eyesClass = mood === "sleepy" ? "nyu-look" : "nyu-look nyu-eyes";
  return `<g transform="translate(0 ${dy})">${blush}<g class="nyu-face"><g class="${eyesClass}">${TERM_EYES[mood]}</g><g class="nyu-look">${TERM_MOUTHS[mood]}</g></g></g>`;
}

function termFigure(mood: NyuMood, extra: NyuExtra = {}) {
  const inner =
    (extra.behind || "") +
    `<g class="nyu-ear nyu-ear-l"><path d="M62 88 L80 36 L114 88 Z" fill="${NYU.body}" stroke="${NYU.ink}" stroke-width="9"/><path d="M76 82 L84 52 L100 82 Z" fill="${NYU.flap}"/></g>` +
    `<g class="nyu-ear nyu-ear-r"><path d="M142 88 L176 36 L194 88 Z" fill="${NYU.body}" stroke="${NYU.ink}" stroke-width="9"/><path d="M156 82 L172 52 L180 82 Z" fill="${NYU.flap}"/></g>` +
    `<rect x="28" y="74" width="200" height="146" rx="24" fill="${NYU.body}" stroke="${NYU.ink}" stroke-width="9"/>` +
    `<g class="no-edge" fill="${NYU.flap}"><circle cx="52" cy="98" r="5.5"/><circle cx="70" cy="98" r="5.5"/><circle cx="88" cy="98" r="5.5"/></g>` +
    `<rect x="44" y="116" width="168" height="88" rx="16" fill="${NYU.flap}" stroke="${NYU.ink}" stroke-width="7"/>` +
    catFace(mood) +
    `<rect class="no-edge nyu-cursor" x="180" y="184" width="12" height="6" rx="1.5" fill="${NYU.ink}"/>` +
    (extra.front || "");
  return `<g stroke-linecap="round" stroke-linejoin="round">${sticker(20, inner)}</g>`;
}

/* ------------------------------------------------------------------------ */
/* Monitor cat (UwURDP). The terminal cat's body as a bezel on a stand, with */
/* a power light where the window dots were. Same grid; the stand hangs below. */
/* ------------------------------------------------------------------------ */

function monitorFigure(mood: NyuMood, extra: NyuExtra = {}) {
  const inner =
    (extra.behind || "") +
    `<g class="nyu-ear nyu-ear-l"><path d="M62 88 L80 36 L114 88 Z" fill="${NYU.body}" stroke="${NYU.ink}" stroke-width="9"/><path d="M76 82 L84 52 L100 82 Z" fill="${NYU.flap}"/></g>` +
    `<g class="nyu-ear nyu-ear-r"><path d="M142 88 L176 36 L194 88 Z" fill="${NYU.body}" stroke="${NYU.ink}" stroke-width="9"/><path d="M156 82 L172 52 L180 82 Z" fill="${NYU.flap}"/></g>` +
    `<g><rect x="112" y="210" width="32" height="28" fill="${NYU.body}" stroke="${NYU.ink}" stroke-width="9"/>` +
    `<path d="M82 246 Q84 234 100 234 H156 Q172 234 174 246 Z" fill="${NYU.body}" stroke="${NYU.ink}" stroke-width="9"/></g>` +
    `<rect x="28" y="74" width="200" height="146" rx="24" fill="${NYU.body}" stroke="${NYU.ink}" stroke-width="9"/>` +
    `<circle class="no-edge" cx="204" cy="96" r="5.5" fill="${NYU.mint}" stroke="${NYU.ink}" stroke-width="3"/>` +
    `<rect x="44" y="116" width="168" height="88" rx="16" fill="${NYU.flap}" stroke="${NYU.ink}" stroke-width="7"/>` +
    catFace(mood) +
    (extra.front || "");
  return `<g stroke-linecap="round" stroke-linejoin="round">${sticker(20, inner)}</g>`;
}

/* ------------------------------------------------------------------------ */
/* Padlock cat (UwULock). The monitor cat without its stand: the shackle     */
/* arches up between the ears, a keyhole sits on her forehead, and the plate */
/* is the face. Same grid.                                                   */
/* ------------------------------------------------------------------------ */

function lockFigure(mood: NyuMood, extra: NyuExtra = {}) {
  const inner =
    (extra.behind || "") +
    `<path d="M83 84 V56 A45 45 0 0 1 173 56 V84 H147 V56 A19 19 0 0 0 109 56 V84 Z" fill="${NYU.lilac}" stroke="${NYU.ink}" stroke-width="9"/>` +
    `<g class="nyu-ear nyu-ear-l"><path d="M62 88 L80 36 L114 88 Z" fill="${NYU.body}" stroke="${NYU.ink}" stroke-width="9"/><path d="M76 82 L84 52 L100 82 Z" fill="${NYU.flap}"/></g>` +
    `<g class="nyu-ear nyu-ear-r"><path d="M142 88 L176 36 L194 88 Z" fill="${NYU.body}" stroke="${NYU.ink}" stroke-width="9"/><path d="M156 82 L172 52 L180 82 Z" fill="${NYU.flap}"/></g>` +
    `<rect x="28" y="74" width="200" height="146" rx="24" fill="${NYU.body}" stroke="${NYU.ink}" stroke-width="9"/>` +
    `<g class="no-edge" fill="${NYU.ink}"><circle cx="128" cy="95" r="6.5"/><path d="M124.5 98 L122 108.5 H134 L131.5 98 Z"/></g>` +
    `<rect x="44" y="116" width="168" height="88" rx="16" fill="${NYU.flap}" stroke="${NYU.ink}" stroke-width="7"/>` +
    catFace(mood) +
    (extra.front || "");
  return `<g stroke-linecap="round" stroke-linejoin="round">${sticker(20, inner)}</g>`;
}

/* ------------------------------------------------------------------------ */
/* Mirror cat (UwUMirror). A hand mirror: an oval frame on a short handle,   */
/* the glass is the face, a gem on top where the monitor had its power light */
/* and a shine across the glass. Same grid; the handle hangs below.          */
/* ------------------------------------------------------------------------ */

function mirrorFigure(mood: NyuMood, extra: NyuExtra = {}) {
  const inner =
    (extra.behind || "") +
    `<g class="nyu-ear nyu-ear-l"><path d="M62 96 L80 36 L114 84 Z" fill="${NYU.body}" stroke="${NYU.ink}" stroke-width="9"/><path d="M76 86 L84 54 L100 80 Z" fill="${NYU.flap}"/></g>` +
    `<g class="nyu-ear nyu-ear-r"><path d="M142 84 L176 36 L194 96 Z" fill="${NYU.body}" stroke="${NYU.ink}" stroke-width="9"/><path d="M156 80 L172 54 L180 86 Z" fill="${NYU.flap}"/></g>` +
    `<g><rect x="114" y="206" width="28" height="42" rx="12" fill="${NYU.body}" stroke="${NYU.ink}" stroke-width="9"/><path d="M114 234 H142" fill="none" stroke="${NYU.ink}" stroke-width="6"/></g>` +
    `<ellipse cx="128" cy="142" rx="100" ry="86" fill="${NYU.body}" stroke="${NYU.ink}" stroke-width="9"/>` +
    `<path class="no-edge" d="M128 58 L136 66 L128 74 L120 66 Z" fill="${NYU.mint}" stroke="${NYU.ink}" stroke-width="3"/>` +
    `<ellipse cx="128" cy="146" rx="80" ry="64" fill="${NYU.flap}" stroke="${NYU.ink}" stroke-width="7"/>` +
    `<g class="no-edge" fill="none" stroke="${NYU.paper}" stroke-width="6" opacity="0.85"><path d="M66 126 Q74 102 100 92"/><path d="M70 146 Q70 140 72 134"/></g>` +
    catFace(mood) +
    (extra.front || "");
  return `<g stroke-linecap="round" stroke-linejoin="round">${sticker(20, inner)}</g>`;
}

/* ------------------------------------------------------------------------ */
/* Badge cat (UwUAuth). An ID badge: the lanyard clip comes down between the */
/* ears, the photo is the face (one step higher than the terminal's screen), */
/* and below it her name with a golden seal: verified. Same grid.            */
/* ------------------------------------------------------------------------ */

function badgeFigure(mood: NyuMood, extra: NyuExtra = {}) {
  const inner =
    (extra.behind || "") +
    `<circle cx="128" cy="34" r="12" fill="none" stroke="${NYU.ink}" stroke-width="7"/>` +
    `<rect x="115" y="40" width="26" height="50" rx="8" fill="${NYU.lilac}" stroke="${NYU.ink}" stroke-width="8"/>` +
    `<g class="nyu-ear nyu-ear-l"><path d="M62 88 L80 36 L114 88 Z" fill="${NYU.body}" stroke="${NYU.ink}" stroke-width="9"/><path d="M76 82 L84 52 L100 82 Z" fill="${NYU.flap}"/></g>` +
    `<g class="nyu-ear nyu-ear-r"><path d="M142 88 L176 36 L194 88 Z" fill="${NYU.body}" stroke="${NYU.ink}" stroke-width="9"/><path d="M156 82 L172 52 L180 82 Z" fill="${NYU.flap}"/></g>` +
    `<rect x="34" y="74" width="188" height="164" rx="24" fill="${NYU.body}" stroke="${NYU.ink}" stroke-width="9"/>` +
    `<rect class="no-edge" x="110" y="84" width="36" height="9" rx="4.5" fill="${NYU.ink}"/>` +
    `<rect x="50" y="102" width="156" height="86" rx="16" fill="${NYU.flap}" stroke="${NYU.ink}" stroke-width="7"/>` +
    catFace(mood, -14) +
    `<g class="no-edge"><rect x="54" y="200" width="104" height="11" rx="5.5" fill="${NYU.ink}"/><rect x="54" y="218" width="68" height="8" rx="4" fill="${NYU.flap}"/></g>` +
    `<g class="no-edge"><circle cx="190" cy="212" r="15" fill="${NYU.star}" stroke="${NYU.ink}" stroke-width="6"/><path d="M183 212 L188.5 217.5 L198 207" fill="none" stroke="${NYU.ink}" stroke-width="5.5"/></g>` +
    (extra.front || "");
  return `<g stroke-linecap="round" stroke-linejoin="round">${sticker(20, inner)}</g>`;
}

/* ------------------------------------------------------------------------ */
/* Box cat (UwUSuite). Nyu peeks out of a cardboard box: the box that holds  */
/* all the apps, and the one she packs in the installers. 256 grid.          */
/* ------------------------------------------------------------------------ */

function boxFigure(mood: NyuMood, extra: NyuExtra = {}) {
  const heart =
    "M128 214 C114 205 108 197 110 190 C112 183 121 181 125 187 L128 191 L131 187 C135 181 144 183 146 190 C148 197 142 205 128 214Z";
  const inner =
    (extra.behind || "") +
    // back edge of the open box, seen above the front panel
    `<path d="M50 152 L60 128 H196 L206 152 Z" fill="${NYU.kraftDark}" stroke="${NYU.ink}" stroke-width="8"/>` +
    // ears and head
    `<g class="nyu-ear nyu-ear-l"><path d="M60 92 L78 34 L116 76 Z" fill="${NYU.body}" stroke="${NYU.ink}" stroke-width="9"/><path d="M74 82 L82 52 L100 76 Z" fill="${NYU.flap}"/></g>` +
    `<g class="nyu-ear nyu-ear-r"><path d="M196 92 L178 34 L140 76 Z" fill="${NYU.body}" stroke="${NYU.ink}" stroke-width="9"/><path d="M182 82 L174 52 L156 76 Z" fill="${NYU.flap}"/></g>` +
    `<rect x="42" y="62" width="172" height="130" rx="52" fill="${NYU.body}" stroke="${NYU.ink}" stroke-width="9"/>` +
    catFace(mood, -46) +
    // flaps, folded open
    `<path d="M44 152 L10 126 L24 108 L70 136 Z" fill="${NYU.kraftLight}" stroke="${NYU.ink}" stroke-width="8"/>` +
    `<path d="M212 152 L246 126 L232 108 L186 136 Z" fill="${NYU.kraftLight}" stroke="${NYU.ink}" stroke-width="8"/>` +
    // front panel
    `<rect x="36" y="146" width="184" height="88" rx="12" fill="${NYU.kraft}" stroke="${NYU.ink}" stroke-width="9"/>` +
    `<path class="no-edge" d="M52 166 H204" fill="none" stroke="${NYU.kraftDark}" stroke-width="5"/>` +
    `<path d="${heart}" fill="${NYU.body}" stroke="${NYU.ink}" stroke-width="6"/>` +
    // paws on the edge
    `<g class="nyu-paws"><ellipse cx="92" cy="148" rx="17" ry="13" fill="${NYU.body}" stroke="${NYU.ink}" stroke-width="8"/><path d="M88 150 v6 M96 150 v6" stroke="${NYU.ink}" stroke-width="4.5" fill="none"/>` +
    `<ellipse cx="164" cy="148" rx="17" ry="13" fill="${NYU.body}" stroke="${NYU.ink}" stroke-width="8"/><path d="M160 150 v6 M168 150 v6" stroke="${NYU.ink}" stroke-width="4.5" fill="none"/></g>` +
    (extra.front || "");
  return `<g stroke-linecap="round" stroke-linejoin="round">${sticker(20, inner)}</g>`;
}

/* ------------------------------------------------------------------------ */
/* Page cat (UwUNotes). A sheet of paper with a folded corner; the written    */
/* area is the face. Same grid as the terminal cat.                          */
/* ------------------------------------------------------------------------ */

const SHEET = "M42 74 H184 L228 118 V206 a14 14 0 0 1 -14 14 H42 a14 14 0 0 1 -14 -14 V88 a14 14 0 0 1 14 -14 Z";

function pageFigure(mood: NyuMood, extra: NyuExtra = {}) {
  const inner =
    (extra.behind || "") +
    // Ears first: the sheet covers where they meet it, so they tuck behind it.
    `<g class="nyu-ear nyu-ear-l"><path d="M62 88 L80 36 L114 88 Z" fill="${NYU.body}" stroke="${NYU.ink}" stroke-width="9"/><path d="M76 82 L84 52 L100 82 Z" fill="${NYU.flap}"/></g>` +
    `<g class="nyu-ear nyu-ear-r"><path d="M142 88 L176 36 L194 88 Z" fill="${NYU.body}" stroke="${NYU.ink}" stroke-width="9"/><path d="M156 82 L172 52 L180 82 Z" fill="${NYU.flap}"/></g>` +
    `<path d="${SHEET}" fill="${NYU.flap}" stroke="${NYU.ink}" stroke-width="9"/>` +
    `<path class="no-edge" d="M184 74 L228 118 H184 Z" fill="${NYU.body}"/>` +
    `<path d="M184 74 V118 H228" fill="none" stroke="${NYU.ink}" stroke-width="7"/>` +
    `<g class="no-edge" fill="none" stroke="${NYU.body}" stroke-width="7" stroke-linecap="round"><path d="M56 196 H172"/><path d="M56 206 H136"/></g>` +
    catFace(mood) +
    `<rect class="no-edge nyu-cursor" x="177" y="188" width="7" height="17" rx="2" fill="${NYU.blushSolid}"/>` +
    (extra.front || "");
  return `<g stroke-linecap="round" stroke-linejoin="round">${sticker(20, inner)}</g>`;
}

export const VIEWBOX: Record<NyuShell, string> = {
  mail: "52 40 408 380",
  terminal: "6 14 244 230",
  monitor: "6 14 244 250",
  box: "-6 14 268 236",
  page: "6 14 244 230",
  lock: "6 -2 244 246",
  mirror: "6 14 244 250",
  badge: "12 8 232 244",
};

export interface NyuSvgOptions {
  shell?: NyuShell;
  mood?: NyuMood;
  className?: string;
  /** The accessible name. An empty string hides the figure from screen readers. */
  label?: string;
  blink?: boolean;
}

/** Nyu as a whole <svg>. */
export function nyuSvg({
  shell = "box",
  mood = "uwu",
  className = "",
  label = "Nyu",
  blink = true,
}: NyuSvgOptions = {}) {
  if (!MOODS.includes(mood)) mood = "uwu";
  if (!SHELLS.includes(shell)) shell = "box";
  label = escapeAttr(label);
  const figure = {
    mail: mailFigure,
    terminal: termFigure,
    monitor: monitorFigure,
    page: pageFigure,
    box: boxFigure,
    lock: lockFigure,
    mirror: mirrorFigure,
    badge: badgeFigure,
  }[shell](mood);
  const classes = ["nyu", "nyu-host", `nyu-${shell}`, blink ? "nyu-blink" : "", escapeAttr(className)]
    .filter(Boolean)
    .join(" ");
  const aria = label ? `role="img" aria-label="${label}"` : 'aria-hidden="true"';
  return `<svg class="${classes}" data-shell="${shell}" data-mood="${mood}" viewBox="${VIEWBOX[shell]}" ${aria} focusable="false" overflow="visible">${figure}</svg>`;
}

/* ------------------------------------------------------------------------ */
/* Scenes                                                                    */
/* ------------------------------------------------------------------------ */

/** Envelope Nyu sitting on a little server with blinking lights. */
export function serverScene({ label = "Nyu" }: { label?: string } = {}) {
  label = escapeAttr(label);
  const bay = (y: number, led: string) =>
    `<rect x="168" y="${y}" width="176" height="34" rx="10" fill="${NYU.cloud}" stroke="${NYU.ink}" stroke-width="8"/>` +
    `<path d="M186 ${y + 17} H258" stroke="${NYU.lilac}" stroke-width="7" stroke-linecap="round"/>` +
    `<circle class="led ${led}" cx="320" cy="${y + 17}" r="7" fill="${led === "led-a" ? "#6EE7B0" : NYU.body}" stroke="${NYU.ink}" stroke-width="4"/>`;
  const rack =
    `<rect x="146" y="316" width="220" height="172" rx="26" fill="${NYU.lilac}" stroke="${NYU.ink}" stroke-width="12"/>` +
    bay(340, "led-a") +
    bay(386, "led-b") +
    bay(432, "led-c");
  const rackEdge = `<g class="nyu-edge" stroke-width="36">${rack}</g>`;
  const cat = `<g class="nyu-hopper" transform="translate(256 250) scale(0.62) translate(-256 -265)">${mailFigure("uwu")}</g>`;
  return (
    `<svg class="nyu nyu-scene nyu-blink" viewBox="96 40 320 470" role="img" aria-label="${label}" overflow="visible">` +
    `<g stroke-linecap="round" stroke-linejoin="round">${rackEdge}${rack}</g>${cat}` +
    `</svg>`
  );
}

/** Terminal Nyu guarding a key, as on the UwUSSH icon. */
export function keyScene({ label = "Nyu" }: { label?: string } = {}) {
  label = escapeAttr(label);
  const key =
    `<g transform="translate(212 196) rotate(22) scale(0.9)">` +
    `<g fill="none" stroke="#fff" stroke-width="26" stroke-linecap="round"><circle cx="0" cy="-14" r="20"/><path d="M0 6 L0 58"/><path d="M0 36 L20 36"/><path d="M0 52 L15 52"/></g>` +
    `<circle cx="0" cy="-14" r="20" fill="${NYU.lilac}" stroke="${NYU.ink}" stroke-width="9"/><circle cx="0" cy="-14" r="7" fill="${NYU.tile}"/>` +
    `<g fill="none" stroke="${NYU.ink}" stroke-width="9" stroke-linecap="round"><path d="M0 6 L0 58"/><path d="M0 36 L20 36"/><path d="M0 52 L15 52"/></g></g>`;
  return (
    `<svg class="nyu nyu-scene nyu-blink" viewBox="6 14 270 270" role="img" aria-label="${label}" overflow="visible">` +
    `<g class="nyu-hopper">${termFigure("uwu")}</g>${key}</svg>`
  );
}

/** Envelope Nyu with a heart letter flying off. */
export function letterScene({ label = "Nyu" }: { label?: string } = {}) {
  label = escapeAttr(label);
  const heart =
    "M0 10 C-14 1 -20 -7 -18 -14 C-16 -21 -7 -23 -3 -17 L0 -13 L3 -17 C7 -23 16 -21 18 -14 C20 -7 14 1 0 10Z";
  const letter =
    `<g class="fly-letter"><g transform="translate(410 120) rotate(12)">` +
    `<g class="nyu-edge" stroke-width="22"><rect x="-58" y="-40" width="116" height="80" rx="14"/></g>` +
    `<rect x="-58" y="-40" width="116" height="80" rx="14" fill="${NYU.paper}" stroke="${NYU.ink}" stroke-width="9"/>` +
    `<path d="M-52 -32 L0 6 L52 -32" fill="none" stroke="${NYU.ink}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>` +
    `<path d="${heart}" transform="translate(0 20) scale(0.8)" fill="${NYU.body}" stroke="${NYU.ink}" stroke-width="5"/></g></g>`;
  return (
    `<svg class="nyu nyu-scene nyu-blink" viewBox="52 40 440 400" role="img" aria-label="${label}" overflow="visible">` +
    `<g class="nyu-hopper">${mailFigure("happy")}</g>${letter}</svg>`
  );
}
