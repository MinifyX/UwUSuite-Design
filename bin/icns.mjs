// Writing and checking macOS .icns files, for uwu-icons. From UwUNotes 0.6 (scripts/icons.mjs):
// Tauri's own icns comes from the full-bleed tile, so uwu-icons writes this one from the master
// in Apple's grid (mac-icon.mjs).

import { inflateSync } from "node:zlib";

/**
 * Every ICNS entry: its type, the pixel size it holds, and how. `ic04` and `ic05` are the 16 and
 * 32 point sizes and carry raw ARGB, as `iconutil` writes them; everything from 32 pixels up is a
 * PNG. Together that is every size from 16 to 512 points, at 1x and at 2x.
 */
export const ICNS_ENTRIES = [
  { type: "ic04", size: 16, argb: true }, // 16
  { type: "ic05", size: 32, argb: true }, // 16@2x (32 at 1x on older systems)
  { type: "ic11", size: 32 }, // 16@2x
  { type: "ic12", size: 64 }, // 32@2x
  { type: "ic07", size: 128 }, // 128
  { type: "ic13", size: 256 }, // 128@2x
  { type: "ic08", size: 256 }, // 256
  { type: "ic14", size: 512 }, // 256@2x
  { type: "ic09", size: 512 }, // 512
  { type: "ic10", size: 1024 }, // 512@2x
];

/** The pixel sizes an icns needs, for `tauri icon -p`. */
export const ICNS_SIZES = [...new Set(ICNS_ENTRIES.map((entry) => entry.size))];

/** Width, height and RGBA bytes of an 8-bit RGBA PNG, the only kind Tauri writes. */
export function decodePng(png) {
  let at = 8;
  let width = 0;
  let height = 0;
  const data = [];
  while (at < png.length) {
    const length = png.readUInt32BE(at);
    const type = png.toString("latin1", at + 4, at + 8);
    const body = png.subarray(at + 8, at + 8 + length);
    if (type === "IHDR") {
      width = body.readUInt32BE(0);
      height = body.readUInt32BE(4);
      if (body[8] !== 8 || body[9] !== 6 || body[12] !== 0)
        throw new Error("Expected a non-interlaced 8-bit RGBA PNG.");
    } else if (type === "IDAT") data.push(body);
    else if (type === "IEND") break;
    at += 12 + length;
  }
  const raw = inflateSync(Buffer.concat(data));
  const stride = width * 4;
  const pixels = Buffer.alloc(stride * height);
  for (let y = 0; y < height; y++) {
    const filter = raw[y * (stride + 1)];
    const line = raw.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1));
    for (let x = 0; x < stride; x++) {
      const left = x >= 4 ? pixels[y * stride + x - 4] : 0;
      const up = y > 0 ? pixels[(y - 1) * stride + x] : 0;
      const corner = x >= 4 && y > 0 ? pixels[(y - 1) * stride + x - 4] : 0;
      let value = line[x];
      if (filter === 1) value += left;
      else if (filter === 2) value += up;
      else if (filter === 3) value += (left + up) >> 1;
      else if (filter === 4) {
        const p = left + up - corner;
        const [pa, pb, pc] = [Math.abs(p - left), Math.abs(p - up), Math.abs(p - corner)];
        value += pa <= pb && pa <= pc ? left : pb <= pc ? up : corner;
      }
      pixels[y * stride + x] = value & 0xff;
    }
  }
  return { width, height, pixels };
}

/**
 * One channel in Apple's PackBits: a byte below 128 is "the next n + 1 bytes as they are", 128
 * and up is "the next byte, n - 125 times" for runs of 3 to 130.
 */
export function packBits(channel) {
  const out = [];
  let i = 0;
  while (i < channel.length) {
    let run = 1;
    while (i + run < channel.length && run < 130 && channel[i + run] === channel[i]) run++;
    if (run >= 3) {
      out.push(run + 125, channel[i]);
      i += run;
      continue;
    }
    const start = i;
    while (i < channel.length && i - start < 128) {
      if (i + 2 < channel.length && channel[i] === channel[i + 1] && channel[i] === channel[i + 2]) break;
      i++;
    }
    out.push(i - start - 1, ...channel.subarray(start, i));
  }
  return Buffer.from(out);
}

/** An `ic04`/`ic05` payload: 'ARGB', then A, R, G and B, each packed on its own. */
function argbPayload(png) {
  const { width, height, pixels } = decodePng(png);
  const count = width * height;
  const channels = [3, 0, 1, 2].map((offset) => {
    const channel = Buffer.alloc(count);
    for (let i = 0; i < count; i++) channel[i] = pixels[i * 4 + offset];
    return packBits(channel);
  });
  return Buffer.concat([Buffer.from("ARGB", "latin1"), ...channels]);
}

/**
 * An ICNS file: 'icns', the total length, then one entry per image: four bytes of type, four of
 * length (header included), the payload. Big-endian throughout. `pngs` maps a pixel size to that
 * size's PNG.
 */
export function writeIcns(pngs) {
  const entries = ICNS_ENTRIES.map(({ type, size, argb }) => {
    const png = pngs.get(size);
    if (!png) throw new Error(`No ${size}px image for ${type}.`);
    const payload = argb ? argbPayload(png) : png;
    const header = Buffer.alloc(8);
    header.write(type, 0, "latin1");
    header.writeUInt32BE(payload.length + 8, 4);
    return Buffer.concat([header, payload]);
  });
  const header = Buffer.alloc(8);
  header.write("icns", 0, "latin1");
  header.writeUInt32BE(8 + entries.reduce((sum, entry) => sum + entry.length, 0), 4);
  return Buffer.concat([header, ...entries]);
}

/**
 * Reads an ICNS back and checks every entry: the lengths add up, each PNG has the size its type
 * promises, each ARGB entry unpacks to exactly four full channels. A broken icon file is otherwise
 * only noticed on a Mac, as a blank square in the Dock. Returns the number of entries.
 */
export function checkIcns(buf) {
  if (buf.toString("latin1", 0, 4) !== "icns" || buf.readUInt32BE(4) !== buf.length)
    throw new Error("Not an ICNS file, or its length is wrong.");
  const found = new Map();
  for (let at = 8; at < buf.length;) {
    const type = buf.toString("latin1", at, at + 4);
    const length = buf.readUInt32BE(at + 4);
    if (length < 8 || at + length > buf.length) throw new Error(`${type} runs over.`);
    found.set(type, buf.subarray(at + 8, at + length));
    at += length;
  }
  for (const { type, size, argb } of ICNS_ENTRIES) {
    const payload = found.get(type);
    if (!payload) throw new Error(`${type} is missing.`);
    if (argb) {
      if (payload.toString("latin1", 0, 4) !== "ARGB") throw new Error(`${type}: no ARGB tag.`);
      let produced = 0;
      for (let i = 4; i < payload.length;) {
        const control = payload[i];
        if (control < 128) {
          produced += control + 1;
          i += control + 2;
        } else {
          produced += control - 125;
          i += 2;
        }
      }
      if (produced !== size * size * 4) throw new Error(`${type}: unpacks to ${produced} bytes.`);
    } else {
      const isPng = payload.subarray(1, 4).toString("latin1") === "PNG";
      if (!isPng || payload.readUInt32BE(16) !== size || payload.readUInt32BE(20) !== size)
        throw new Error(`${type}: expected a ${size}×${size} PNG.`);
    }
  }
  return found.size;
}
