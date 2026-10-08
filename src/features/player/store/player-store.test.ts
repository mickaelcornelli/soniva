import { beforeEach, describe, expect, it } from "vitest";
import { makeTrack } from "@/test/factories";
import { selectCurrentItem, usePlayerStore } from "./player-store";
import { useProgressStore } from "./progress-store";

const tracks = ["a", "b", "c"].map((id) => makeTrack({ id, durationSeconds: 100 }));
const store = () => usePlayerStore.getState();
const currentId = () => selectCurrentItem(store())?.track.id;

beforeEach(() => {
  usePlayerStore.setState(usePlayerStore.getInitialState(), true);
  useProgressStore.getState().reset();
});

describe("playTracks", () => {
  it("remplace la file et lance le morceau choisi", () => {
    store().playTracks(tracks, 1);

    expect(currentId()).toBe("b");
    expect(store().isPlaying).toBe(true);
    expect(store().queue).toHaveLength(3);
  });

  it("en aléatoire, joue d'abord le morceau choisi", () => {
    usePlayerStore.setState({ shuffle: true });

    store().playTracks(tracks, 2);

    expect(currentId()).toBe("c");
    expect(store().currentIndex).toBe(0);
    expect(store().unshuffledQueue?.map((i) => i.track.id)).toEqual(["a", "b", "c"]);
  });
});

describe("next / previous", () => {
  it("enchaîne et s'arrête en fin de file", () => {
    store().playTracks(tracks, 2);

    store().next();

    expect(currentId()).toBe("c");
  });

  it("reboucle avec la répétition de la file", () => {
    usePlayerStore.setState({ repeat: "all" });
    store().playTracks(tracks, 2);

    store().next();

    expect(currentId()).toBe("a");
  });

  it("revient au début du morceau après quelques secondes d'écoute", () => {
    store().playTracks(tracks, 1);
    useProgressStore.getState().setCurrentTime(42);

    store().previous();

    expect(currentId()).toBe("b");
    expect(store().pendingSeek).toBe(0);
  });

  it("passe au morceau précédent en tout début d'écoute", () => {
    store().playTracks(tracks, 1);

    store().previous();

    expect(currentId()).toBe("a");
  });
});

describe("handleEnded", () => {
  it("passe au suivant", () => {
    store().playTracks(tracks, 0);

    store().handleEnded();

    expect(currentId()).toBe("b");
  });

  it("rejoue le même morceau en répétition simple", () => {
    usePlayerStore.setState({ repeat: "one" });
    store().playTracks(tracks, 0);

    store().handleEnded();

    expect(currentId()).toBe("a");
    expect(store().pendingSeek).toBe(0);
  });

  it("s'arrête à la fin de la file", () => {
    store().playTracks(tracks, 2);

    store().handleEnded();

    expect(store().isPlaying).toBe(false);
    expect(currentId()).toBe("c");
  });
});

describe("file d'attente", () => {
  it("ajoute un morceau en fin de file", () => {
    store().playTracks(tracks, 0);

    store().addToQueue(makeTrack({ id: "z" }));

    expect(store().queue.at(-1)?.track.id).toBe("z");
  });

  it("retire une entrée en gardant le morceau courant", () => {
    store().playTracks(tracks, 2);
    const first = store().queue[0]?.queueId ?? "";

    store().removeFromQueue(first);

    expect(store().queue).toHaveLength(2);
    expect(currentId()).toBe("c");
  });

  it("ne retire pas le morceau en cours", () => {
    store().playTracks(tracks, 1);

    store().removeFromQueue(selectCurrentItem(store())?.queueId ?? "");

    expect(store().queue).toHaveLength(3);
  });
});

describe("toggleShuffle", () => {
  it("restaure l'ordre d'origine en gardant le morceau courant", () => {
    store().playTracks(tracks, 1);

    store().toggleShuffle();
    store().toggleShuffle();

    expect(store().queue.map((i) => i.track.id)).toEqual(["a", "b", "c"]);
    expect(currentId()).toBe("b");
  });
});

describe("réglages", () => {
  it("fait tourner les modes de répétition", () => {
    store().cycleRepeat();
    expect(store().repeat).toBe("all");
    store().cycleRepeat();
    expect(store().repeat).toBe("one");
    store().cycleRepeat();
    expect(store().repeat).toBe("off");
  });

  it("borne le volume et coupe le son à zéro", () => {
    store().setVolume(1.5);
    expect(store().volume).toBe(1);

    store().setVolume(0);
    expect(store().muted).toBe(true);

    store().toggleMute();
    expect(store()).toMatchObject({ muted: false, volume: 0.5 });
  });
});
