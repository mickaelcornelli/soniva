"use client";

import { ArrowRight, SearchX, Search, WifiOff, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { TrackListSkeleton } from "@/components/music/track-list-skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { IconButton } from "@/components/ui/icon-button";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { routes } from "@/lib/routes";
import { isSearchable, MIN_SEARCH_LENGTH, normalizeSearchQuery } from "@/lib/search";
import type { SearchResults as SearchResultsData } from "@/types/music";
import { useSearchResults } from "../hooks/use-search-results";
import { hasResults, SearchResults } from "./search-results";

const DEBOUNCE_MS = 300;
const SUGGESTIONS = ["Electronic", "Hip-Hop", "Lo-fi", "House", "Jazz", "Ambient", "Techno"];

interface SearchViewProps {
  initialQuery: string;
  initialResults: SearchResultsData | null;
}

export function SearchView({ initialQuery, initialResults }: SearchViewProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [input, setInput] = useState(initialQuery);
  const query = normalizeSearchQuery(useDebouncedValue(input, DEBOUNCE_MS));
  const searchable = isSearchable(query);

  const { data, isFetching, isError, refetch, isPlaceholderData } = useSearchResults(query, {
    initial: initialResults ? { query: initialQuery, results: initialResults } : null,
  });

  // The URL follows the query (share, reload) without a new server render.
  useEffect(() => {
    window.history.replaceState(null, "", searchable ? routes.searchFor(query) : routes.search);
  }, [query, searchable]);

  return (
    <div className="flex flex-col gap-10">
      <form
        role="search"
        onSubmit={(event) => {
          event.preventDefault();
          // On mobile, close the keyboard so results are visible.
          inputRef.current?.blur();
        }}
        className="relative max-w-2xl"
      >
        <label htmlFor="recherche" className="sr-only">
          Rechercher un morceau, un artiste ou une playlist
        </label>
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-5 size-5 -translate-y-1/2 text-muted"
        />
        <input
          ref={inputRef}
          id="recherche"
          type="search"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Morceau, artiste, playlist…"
          autoComplete="off"
          enterKeyHint="search"
          autoFocus={initialQuery === ""}
          className="h-14 w-full rounded-full border border-field bg-surface pr-14 pl-13 text-lg placeholder:text-muted focus:border-accent focus:outline-none [&::-webkit-search-cancel-button]:hidden"
        />
        {input ? (
          <IconButton
            icon={X}
            label="Effacer la recherche"
            onClick={() => {
              setInput("");
              inputRef.current?.focus();
            }}
            className="absolute top-1/2 right-2 -translate-y-1/2"
          />
        ) : null}
      </form>

      <p aria-live="polite" className="sr-only">
        {searchable && isFetching ? "Recherche en cours…" : ""}
        {searchable && data && !isFetching
          ? hasResults(data)
            ? `Résultats pour ${query}`
            : `Aucun résultat pour ${query}`
          : ""}
      </p>

      {!searchable ? (
        <SearchPrompt tooShort={query.length > 0} onPick={setInput} />
      ) : isError && !data ? (
        <EmptyState
          icon={WifiOff}
          title="La recherche n'a pas abouti"
          description="Le service musical ne répond pas pour le moment. Réessaie dans un instant."
          action={
            <button
              type="button"
              onClick={() => void refetch()}
              className="rounded-full bg-accent px-5 py-2.5 font-semibold text-accent-foreground"
            >
              Réessayer
            </button>
          }
        />
      ) : !data ? (
        <TrackListSkeleton rows={6} />
      ) : hasResults(data) ? (
        // Previous results are dimmed while new ones load.
        <div className={`transition-opacity ${isPlaceholderData ? "opacity-50" : ""}`}>
          <SearchResults results={data} />
        </div>
      ) : (
        <EmptyState
          icon={SearchX}
          title={`Aucun résultat pour « ${query} »`}
          description="Vérifie l'orthographe ou essaie un nom d'artiste, un genre ou une ambiance."
        />
      )}
    </div>
  );
}

function SearchPrompt({
  tooShort,
  onPick,
}: {
  tooShort: boolean;
  onPick: (value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-muted">
        {tooShort
          ? `Encore un effort : au moins ${MIN_SEARCH_LENGTH} caractères.`
          : "Pas d'idée ? Commence par un genre."}
      </p>
      <ul className="flex flex-wrap gap-2">
        {SUGGESTIONS.map((suggestion) => (
          <li key={suggestion}>
            <button
              type="button"
              onClick={() => onPick(suggestion)}
              className="rounded-full border border-line px-4 py-2 text-sm transition-colors hover:border-accent hover:text-accent"
            >
              {suggestion}
            </button>
          </li>
        ))}
      </ul>
      <Link
        href={routes.genres}
        className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-accent hover:underline"
      >
        Parcourir tous les genres
        <ArrowRight aria-hidden="true" className="size-4" />
      </Link>
    </div>
  );
}
