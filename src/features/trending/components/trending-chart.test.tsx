import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { Track } from "@/types/music";
import { TrendingChart } from "./trending-chart";

function makeTrack(id: string, title: string): Track {
  return {
    id,
    title,
    durationSeconds: 200,
    genre: "Electronic",
    mood: null,
    playCount: 1_000,
    favoriteCount: 10,
    artwork: {},
    artist: { id: `a-${id}`, name: `Artiste ${id}`, handle: id, isVerified: false, avatar: {} },
  };
}

describe("TrendingChart", () => {
  it("met le premier morceau en vedette et numérote la suite à partir de 2", () => {
    render(
      <TrendingChart
        tracks={[
          makeTrack("1", "Premier"),
          makeTrack("2", "Deuxième"),
          makeTrack("3", "Troisième"),
        ]}
      />,
    );

    expect(screen.getByRole("heading", { name: "Premier" })).toBeInTheDocument();

    const list = screen.getByRole("list", { name: "La suite du classement" });
    expect(list).toHaveAttribute("start", "2");
    expect(
      within(list)
        .getAllByRole("listitem")
        .map((li) => li.textContent),
    ).toEqual([expect.stringContaining("Deuxième"), expect.stringContaining("Troisième")]);
  });

  it("n'affiche rien sans morceau", () => {
    const { container } = render(<TrendingChart tracks={[]} />);

    expect(container).toBeEmptyDOMElement();
  });
});
