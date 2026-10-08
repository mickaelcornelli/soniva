"use client";

import { Heart, History } from "lucide-react";
import Link from "next/link";
import { TrackList } from "@/components/music/track-list";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/features/auth/auth-provider";
import { AccountCard } from "@/features/auth/components/account-card";
import { UserPlaylistsSection } from "@/features/playlists/components/user-playlists-section";
import { pluralize } from "@/lib/format/plural";
import { routes } from "@/lib/routes";
import { useLibraryStore } from "../store/library-store";

const SECTION_TITLE = "font-display text-xl font-semibold";

export function LibraryView() {
  const { state } = useAuth();
  const favorites = useLibraryStore((s) => s.favorites);
  const history = useLibraryStore((s) => s.history);

  return (
    <div className="flex flex-col gap-12">
      {state.status === "loading" ? (
        <Skeleton className="h-20 w-full rounded-2xl" />
      ) : state.status === "signed-in" ? (
        <AccountCard />
      ) : (
        <VisitorNotice />
      )}

      <section aria-labelledby="favoris" className="flex flex-col gap-4">
        <h2 id="favoris" className={SECTION_TITLE}>
          Favoris
          {favorites.length > 0 ? (
            <span className="ml-2 font-sans text-sm font-normal text-muted">
              {pluralize(favorites.length, "morceau", "morceaux")}
            </span>
          ) : null}
        </h2>
        {favorites.length > 0 ? (
          <TrackList tracks={favorites.map(({ track }) => track)} labelledBy="favoris" />
        ) : (
          <EmptyState
            icon={Heart}
            title="Aucun favori pour l'instant"
            description="Touche le cœur d'un morceau pour le retrouver ici."
          />
        )}
      </section>

      <UserPlaylistsSection />

      <section aria-labelledby="recents" className="flex flex-col gap-4">
        <h2 id="recents" className={SECTION_TITLE}>
          Écoutés récemment
        </h2>
        {history.length > 0 ? (
          <TrackList tracks={history.map(({ track }) => track)} labelledBy="recents" />
        ) : (
          <EmptyState
            icon={History}
            title="Rien écouté pour l'instant"
            description="Les morceaux écoutés plus de quelques secondes apparaîtront ici."
          />
        )}
      </section>
    </div>
  );
}

function VisitorNotice() {
  return (
    <p className="rounded-2xl border border-line bg-surface p-4 text-sm text-muted">
      Ta bibliothèque est enregistrée sur cet appareil.{" "}
      <Link
        href={`${routes.login}?next=${encodeURIComponent(routes.library)}`}
        className="font-medium text-accent underline underline-offset-4"
      >
        Connecte-toi
      </Link>{" "}
      pour la retrouver sur tous tes appareils : elle sera ajoutée à ton compte.
    </p>
  );
}
