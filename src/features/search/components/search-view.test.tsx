import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { makePlaylist, makeTrack } from "@/test/factories";
import type { SearchResults } from "@/types/music";
import { SearchView } from "./search-view";

function renderView(props: Parameters<typeof SearchView>[0]) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={client}>
      <SearchView {...props} />
    </QueryClientProvider>,
  );
}

afterEach(() => vi.unstubAllGlobals());

describe("SearchView", () => {
  it("affiche directement les résultats rendus par le serveur, sans nouvel appel", () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);
    const results: SearchResults = {
      tracks: [makeTrack({ id: "t1", title: "Night Drive" })],
      artists: [],
      playlists: [makePlaylist({ name: "Routes de nuit" })],
    };

    renderView({ initialQuery: "night", initialResults: results });

    expect(screen.getByRole("searchbox")).toHaveValue("night");
    expect(screen.getByRole("heading", { name: "Morceaux" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Routes de nuit" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Artistes" })).not.toBeInTheDocument();
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("propose des genres quand le champ est vide et les reporte dans le champ", () => {
    // The search fires after the typing delay; keep it pending.
    vi.stubGlobal(
      "fetch",
      vi.fn(() => new Promise(() => {})),
    );
    renderView({ initialQuery: "", initialResults: null });

    fireEvent.click(screen.getByRole("button", { name: "House" }));

    expect(screen.getByRole("searchbox")).toHaveValue("House");
  });
});
