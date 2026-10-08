import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { makeTrack } from "@/test/factories";
import { TrendingChart } from "./trending-chart";

describe("TrendingChart", () => {
  it("met le premier morceau en vedette et numérote la suite à partir de 2", () => {
    render(
      <TrendingChart
        tracks={[
          makeTrack({ id: "1", title: "Premier" }),
          makeTrack({ id: "2", title: "Deuxième" }),
          makeTrack({ id: "3", title: "Troisième" }),
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

  it("relie chaque morceau à sa page", () => {
    render(
      <TrendingChart tracks={[makeTrack({ id: "1" }), makeTrack({ id: "abc", title: "B" })]} />,
    );

    expect(screen.getByRole("link", { name: "B" })).toHaveAttribute("href", "/track/abc");
  });

  it("n'affiche rien sans morceau", () => {
    const { container } = render(<TrendingChart tracks={[]} />);

    expect(container).toBeEmptyDOMElement();
  });
});
