import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { makeTrack } from "@/test/factories";
import { TrackList } from "./track-list";

describe("TrackList", () => {
  it("affiche les actions propres au contexte sur chaque ligne", () => {
    const onRemove = vi.fn();
    render(
      <>
        <h2 id="liste">Liste</h2>
        <TrackList
          tracks={[makeTrack({ id: "a", title: "Alpha" }), makeTrack({ id: "b", title: "Bravo" })]}
          labelledBy="liste"
          renderActions={(track) => (
            <button type="button" onClick={() => onRemove(track.id)}>
              Retirer {track.title}
            </button>
          )}
        />
      </>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Retirer Bravo" }));

    expect(onRemove).toHaveBeenCalledWith("b");
  });

  it("propose d'ajouter chaque morceau à une playlist", () => {
    render(
      <>
        <h2 id="liste">Liste</h2>
        <TrackList tracks={[makeTrack({ id: "a", title: "Alpha" })]} labelledBy="liste" />
      </>,
    );

    expect(
      screen.getByRole("button", { name: "Ajouter Alpha à une playlist" }),
    ).toBeInTheDocument();
  });
});
