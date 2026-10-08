import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { makeTrack } from "@/test/factories";
import { useLibraryStore } from "../store/library-store";
import { FavoriteButton } from "./favorite-button";

beforeEach(() => {
  useLibraryStore.setState(useLibraryStore.getInitialState(), true);
});

describe("FavoriteButton", () => {
  it("ajoute puis retire un favori, en local pour un visiteur", () => {
    render(<FavoriteButton track={makeTrack({ id: "a", title: "Alpha" })} />);

    fireEvent.click(screen.getByRole("button", { name: "Ajouter Alpha aux favoris" }));
    expect(useLibraryStore.getState().favorites.map((f) => f.track.id)).toEqual(["a"]);

    const button = screen.getByRole("button", { name: "Retirer Alpha des favoris" });
    expect(button).toHaveAttribute("aria-pressed", "true");

    fireEvent.click(button);
    expect(useLibraryStore.getState().favorites).toEqual([]);
  });
});
