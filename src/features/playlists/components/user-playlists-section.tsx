"use client";

import { ListMusic, Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/features/auth/auth-provider";
import { pluralize } from "@/lib/format/plural";
import { routes } from "@/lib/routes";
import { useAccountId, usePlaylistMutations, useUserPlaylists } from "../hooks/use-user-playlists";
import { CreatePlaylistForm } from "./create-playlist-form";
import { UserPlaylistCover } from "./user-playlist-cover";

const GRID = "grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-5";

export function UserPlaylistsSection() {
  const { state } = useAuth();
  const accountId = useAccountId();

  return (
    <section aria-labelledby="mes-playlists" className="flex flex-col gap-4">
      <h2 id="mes-playlists" className="font-display text-xl font-semibold">
        Mes playlists
      </h2>
      {state.status === "signed-out" ? (
        <p className="text-muted">
          <Link
            href={`${routes.login}?next=${encodeURIComponent(routes.library)}`}
            className="font-medium text-accent underline underline-offset-4"
          >
            Connecte-toi
          </Link>{" "}
          pour créer tes propres playlists.
        </p>
      ) : accountId ? (
        <PlaylistsGrid />
      ) : (
        // Session loading or library still syncing.
        <PlaylistsGridSkeleton />
      )}
    </section>
  );
}

function PlaylistsGrid() {
  const { data: playlists, isPending, isError, refetch } = useUserPlaylists();
  const { create } = usePlaylistMutations();
  const [creating, setCreating] = useState(false);

  if (isPending) return <PlaylistsGridSkeleton />;

  if (isError) {
    return (
      <EmptyState
        icon={ListMusic}
        title="Tes playlists n'ont pas pu être chargées"
        description="Vérifie ta connexion puis réessaie."
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
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="max-w-md">
        {creating ? (
          <CreatePlaylistForm
            autoFocus
            onCreate={async (name) => {
              await create.mutateAsync(name);
              setCreating(false);
            }}
          />
        ) : (
          <button
            type="button"
            onClick={() => setCreating(true)}
            className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm font-medium transition-colors hover:border-accent hover:text-accent"
          >
            <Plus aria-hidden="true" className="size-4" />
            Nouvelle playlist
          </button>
        )}
      </div>

      {playlists.length > 0 ? (
        <ul className={GRID}>
          {playlists.map((playlist) => (
            <li key={playlist.id}>
              <article className="group relative flex flex-col gap-3">
                <UserPlaylistCover
                  name={playlist.name}
                  className="aspect-square w-full rounded-2xl transition-transform duration-300 group-hover:-translate-y-1 motion-reduce:transition-none"
                />
                <div className="flex min-w-0 flex-col">
                  <h3 className="truncate font-medium">
                    <Link
                      href={routes.userPlaylist(playlist.id)}
                      className="after:absolute after:inset-0"
                    >
                      {playlist.name}
                    </Link>
                  </h3>
                  <p className="text-sm text-muted">
                    {pluralize(playlist.trackCount, "morceau", "morceaux")}
                  </p>
                </div>
              </article>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          icon={ListMusic}
          title="Aucune playlist pour l'instant"
          description="Crée ta première playlist, puis ajoute des morceaux avec le bouton + de chaque titre."
        />
      )}
    </div>
  );
}

function PlaylistsGridSkeleton() {
  return (
    <div className={GRID}>
      {Array.from({ length: 4 }, (_, index) => (
        <Skeleton key={index} className="aspect-square rounded-2xl" />
      ))}
    </div>
  );
}
