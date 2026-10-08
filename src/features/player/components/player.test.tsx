import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { TrackList } from "@/components/music/track-list";
import { makeTrack } from "@/test/factories";
import { selectCurrentItem, usePlayerStore } from "../store/player-store";
import { useProgressStore } from "../store/progress-store";
import { PlayTracksButton } from "./play-tracks-button";
import { PlayerBar } from "./player-bar";

const tracks = [
  makeTrack({ id: "a", title: "Alpha" }),
  makeTrack({ id: "b", title: "Bravo" }),
  makeTrack({ id: "c", title: "Charlie" }),
];

beforeEach(() => {
  usePlayerStore.setState(usePlayerStore.getInitialState(), true);
  useProgressStore.getState().reset();
});

describe("lecture depuis une liste", () => {
  it("met toute la liste en file et lance le morceau cliqué", () => {
    render(
      <>
        <h2 id="liste">Liste</h2>
        <TrackList tracks={tracks} labelledBy="liste" />
      </>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Lire Bravo" }));

    const state = usePlayerStore.getState();
    expect(selectCurrentItem(state)?.track.id).toBe("b");
    expect(state.queue).toHaveLength(3);
    expect(screen.getByRole("button", { name: "Mettre en pause Bravo" })).toBeInTheDocument();
  });
});

describe("PlayTracksButton", () => {
  it("lance la file puis bascule en pause au second clic", () => {
    render(<PlayTracksButton tracks={tracks} />);

    fireEvent.click(screen.getByRole("button", { name: "Lire" }));
    expect(usePlayerStore.getState().isPlaying).toBe(true);

    fireEvent.click(screen.getByRole("button", { name: "Pause" }));
    expect(usePlayerStore.getState().isPlaying).toBe(false);
    expect(usePlayerStore.getState().queue).toHaveLength(3);
  });
});

describe("PlayerBar", () => {
  it("reste masquée tant qu'aucun morceau n'est chargé", () => {
    render(<PlayerBar />);

    expect(screen.queryByRole("region", { name: "Lecteur" })).not.toBeInTheDocument();
  });

  it("affiche le morceau en cours et commande la lecture", () => {
    usePlayerStore.getState().playTracks(tracks, 0);
    render(<PlayerBar />);

    expect(screen.getByRole("region", { name: "Lecteur" })).toBeInTheDocument();

    fireEvent.click(screen.getAllByRole("button", { name: "Morceau suivant" })[0]!);
    expect(selectCurrentItem(usePlayerStore.getState())?.track.id).toBe("b");

    fireEvent.click(screen.getAllByRole("button", { name: "Mettre en pause" })[0]!);
    expect(usePlayerStore.getState().isPlaying).toBe(false);
  });
});
