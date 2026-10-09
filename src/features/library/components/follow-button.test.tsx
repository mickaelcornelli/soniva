import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { makeArtist } from "@/test/factories";
import { useLibraryStore } from "../store/library-store";
import { FollowButton } from "./follow-button";

beforeEach(() => {
  useLibraryStore.setState(useLibraryStore.getInitialState(), true);
});

describe("FollowButton", () => {
  it("suit puis ne suit plus l'artiste, sur l'appareil pour un visiteur", () => {
    render(<FollowButton artist={makeArtist({ id: "a1", name: "Lune Rouge" })} />);

    fireEvent.click(screen.getByRole("button", { name: "Suivre Lune Rouge" }));

    const following = screen.getByRole("button", { name: "Ne plus suivre Lune Rouge" });
    expect(following).toHaveAttribute("aria-pressed", "true");
    expect(useLibraryStore.getState().follows.map((f) => f.artist.id)).toEqual(["a1"]);

    fireEvent.click(following);

    expect(useLibraryStore.getState().follows).toEqual([]);
  });
});
