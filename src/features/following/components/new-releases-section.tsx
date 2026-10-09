"use client";

import { useEffect, useId } from "react";
import { TrackList } from "@/components/music/track-list";
import { TrackListSkeleton } from "@/components/music/track-list-skeleton";
import { useLatestReleases } from "../hooks/use-latest-releases";

const DISPLAYED_RELEASES = 10;

/**
 * « Nouveautés de tes artistes » : derniers morceaux des artistes suivis. Section
 * secondaire, invisible sans artiste suivi et masquée plutôt qu'affichée en erreur.
 */
export function NewReleasesSection() {
  const headingId = useId();
  const { hasFollows, data, isLoading, isError, error } = useLatestReleases();

  useEffect(() => {
    if (isError) console.error("[nouveautés] indisponibles", error);
  }, [isError, error]);

  if (!hasFollows || isError) return null;
  if (!isLoading && (!data || data.length === 0)) return null;

  return (
    <section aria-labelledby={headingId} aria-busy={isLoading} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 id={headingId} className="font-display text-xl font-semibold">
          Nouveautés de tes artistes
        </h2>
        <p className="text-sm text-muted">Les derniers morceaux des artistes que tu suis.</p>
      </div>
      {isLoading || !data ? (
        <TrackListSkeleton rows={6} columns={2} />
      ) : (
        <TrackList tracks={data.slice(0, DISPLAYED_RELEASES)} columns={2} labelledBy={headingId} />
      )}
    </section>
  );
}
