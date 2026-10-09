"use client";

import { ArrowRight, BarChart3, Heart, History, UserRound } from "lucide-react";
import Link from "next/link";
import { ArtistCard } from "@/components/music/artist-card";
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
  const follows = useLibraryStore((s) => s.follows);

  return (
    <div className="flex flex-col gap-12">
      {state.status === "loading" ? (
        <Skeleton className="h-20 w-full rounded-2xl" />
      ) : state.status === "signed-in" ? (
        <AccountCard />
      ) : (
        <VisitorNotice />
      )}

      <Link
        href={routes.libraryStats()}
        className="group flex items-center gap-4 rounded-2xl border border-line bg-surface p-4 transition-colors hover:border-accent/60 sm:p-5"
      >
        <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
          <BarChart3 aria-hidden="true" className="size-5" />
        </span>
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="font-display font-semibold">Ton mois en musique</span>
          <span className="text-sm text-muted">
            Minutes d&apos;écoute, artistes et genres préférés du mois.
          </span>
        </span>
        <ArrowRight
          aria-hidden="true"
          className="size-5 text-muted transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
        />
      </Link>

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

      <section aria-labelledby="artistes-suivis" className="flex flex-col gap-4">
        <h2 id="artistes-suivis" className={SECTION_TITLE}>
          Artistes suivis
          {follows.length > 0 ? (
            <span className="ml-2 font-sans text-sm font-normal text-muted">
              {pluralize(follows.length, "artiste", "artistes")}
            </span>
          ) : null}
        </h2>
        {follows.length > 0 ? (
          <ul
            aria-labelledby="artistes-suivis"
            className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-6"
          >
            {follows.map(({ artist }) => (
              <li key={artist.id}>
                <ArtistCard artist={artist} />
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            icon={UserRound}
            title="Aucun artiste suivi"
            description="Suis un artiste depuis sa page pour retrouver ses nouveautés sur l'accueil."
          />
        )}
      </section>

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
