import { describe, expect, it } from "vitest";
// @ts-expect-error plain JavaScript module without types
import { readIco, writeIco } from "../bin/ico.mjs";

describe("ico", () => {
  it("writes what it reads", () => {
    const frames = new Map([
      [16, Buffer.from("sixteen")],
      [256, Buffer.from("two hundred fifty six")],
    ]);
    const ico: Buffer = writeIco(frames);
    expect(ico.readUInt16LE(2)).toBe(1);
    const back: Map<number, Buffer> = readIco(ico);
    expect([...back.keys()]).toEqual([16, 256]);
    expect(back.get(256)!.toString()).toBe("two hundred fifty six");
  });
});
