import { describe, expect, it } from "vitest";
import { makeTrack } from "@/test/factories";
import {
  createQueueItems,
  getNextIndex,
  getPreviousIndex,
  restoreOrder,
  shuffle,
  shuffleUpcoming,
} from "./queue";

const items = createQueueItems(["a", "b", "c", "d", "e"].map((id) => makeTrack({ id })));
const ids = (queue: { track: { id: string } }[]) => queue.map((item) => item.track.id);

// Générateur pseudo-aléatoire déterministe pour des tests stables.
function seeded(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

describe("createQueueItems", () => {
  it("donne un identifiant unique à chaque entrée, même pour un morceau répété", () => {
    const track = makeTrack();
    const [first, second] = createQueueItems([track, track]);

    expect(first?.queueId).not.toBe(second?.queueId);
  });
});

describe("getNextIndex", () => {
  it("avance dans la file", () => {
    expect(getNextIndex(3, 0, "off")).toBe(1);
  });

  it("s'arrête en fin de file sans répétition", () => {
    expect(getNextIndex(3, 2, "off")).toBeNull();
    expect(getNextIndex(3, 2, "one")).toBeNull();
  });

  it("reboucle en répétition de la file", () => {
    expect(getNextIndex(3, 2, "all")).toBe(0);
  });

  it("gère une file vide", () => {
    expect(getNextIndex(0, 0, "all")).toBeNull();
  });
});

describe("getPreviousIndex", () => {
  it("recule dans la file", () => {
    expect(getPreviousIndex(3, 2, "off")).toBe(1);
  });

  it("s'arrête au début, ou reboucle en répétition", () => {
    expect(getPreviousIndex(3, 0, "off")).toBeNull();
    expect(getPreviousIndex(3, 0, "all")).toBe(2);
  });
});

describe("shuffle", () => {
  it("garde les mêmes éléments sans modifier l'original", () => {
    const original = [1, 2, 3, 4, 5];
    const result = shuffle(original, seeded(42));

    expect([...result].sort()).toEqual(original);
    expect(original).toEqual([1, 2, 3, 4, 5]);
  });
});

describe("shuffleUpcoming", () => {
  it("ne mélange que les morceaux à venir", () => {
    const result = shuffleUpcoming(items, 1, seeded(7));

    expect(ids(result).slice(0, 2)).toEqual(["a", "b"]);
    expect(ids(result).slice(2).sort()).toEqual(["c", "d", "e"]);
  });
});

describe("restoreOrder", () => {
  it("revient à l'ordre d'origine, sans les entrées retirées et avec les ajouts à la fin", () => {
    const [added] = createQueueItems([makeTrack({ id: "z" })]);
    const shuffled = [items[3], items[0], items[4], added, items[1]].filter((i) => i !== undefined);

    expect(ids(restoreOrder(shuffled, items))).toEqual(["a", "b", "d", "e", "z"]);
  });
});
