// Reading and writing Windows .ico files with PNG frames, for uwu-icons.

/** ICO entries by size: { size → image bytes }. A width byte of 0 means 256. */
export function readIco(buf) {
  const entries = new Map();
  for (let i = 0; i < buf.readUInt16LE(4); i++) {
    const at = 6 + i * 16;
    const size = buf[at] || 256;
    const length = buf.readUInt32LE(at + 8);
    const offset = buf.readUInt32LE(at + 12);
    entries.set(size, buf.subarray(offset, offset + length));
  }
  return entries;
}

export function writeIco(entries) {
  const sizes = [...entries.keys()].sort((a, b) => a - b);
  const header = Buffer.alloc(6 + sizes.length * 16);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(sizes.length, 4);
  let offset = header.length;
  sizes.forEach((size, i) => {
    const at = 6 + i * 16;
    header[at] = header[at + 1] = size % 256;
    header.writeUInt16LE(1, at + 4); // planes
    header.writeUInt16LE(32, at + 6); // bits per pixel
    header.writeUInt32LE(entries.get(size).length, at + 8);
    header.writeUInt32LE(offset, at + 12);
    offset += entries.get(size).length;
  });
  return Buffer.concat([header, ...sizes.map((size) => entries.get(size))]);
}
