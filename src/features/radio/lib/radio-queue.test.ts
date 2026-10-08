import { describe, expect, it } from "vitest";
import { makeTrack } from "@/test/factories";
import { pickRadioTracks, shouldExtendQueue } from "./radio-queue";

const position = { radio: true, repeat: "off" as const, queueLength: 5, currentIndex: 3 };

describe("shouldExtendQueue", () => {
  it("prolonge la file quand il ne reste qu'un morceau ou moins", () => {
    expect(shouldExtendQueue(position)).toBe(true);
    expect(shouldExtendQueue({ ...position, currentIndex: 4 })).toBe(true);
  });

  it("attend tant qu'il reste plusieurs morceaux", () => {
    expect(shouldExtendQueue({ ...position, currentIndex: 2 })).toBe(false);
  });

  it("ne fait rien radio coupée, en répétition ou sans morceau", () => {
    expect(shouldExtendQueue({ ...position, radio: false })).toBe(false);
    expect(shouldExtendQueue({ ...position, repeat: "all" })).toBe(false);
    expect(shouldExtendQueue({ ...position, queueLength: 0, currentIndex: -1 })).toBe(false);
  });
});

describe("pickRadioTracks", () => {
  const candidates = ["a", "b", "a", "c", "d"].map((id) => makeTrack({ id }));
  // Toujours 0 : le mélange de Fisher-Yates devient déterministe.
  const noRandom = () => 0;

  it("écarte les morceaux exclus et les doublons", () => {
    const picked = pickRadioTracks(candidates, new Set(["c"]), 10, noRandom);

    expect(picked.map((t) => t.id).sort()).toEqual(["a", "b", "d"]);
  });

  it("respecte la limite", () => {
    expect(pickRadioTracks(candidates, new Set(), 2, noRandom)).toHaveLength(2);
  });
});
