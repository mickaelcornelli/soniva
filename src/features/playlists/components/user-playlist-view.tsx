"use client";

import { ListMusic, Pencil, SearchX, Trash2, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { DetailPageSkeleton } from "@/components/layout/detail-page-skeleton";
import { PageContainer } from "@/components/layout/page-container";
import { TrackList } from "@/components/music/track-list";
import { EmptyState } from "@/components/ui/empty-state";
import { IconButton } from "@/components/ui/icon-button";
import { useAuth } from "@/features/auth/auth-provider";
import { PlayTracksButton } from "@/features/player/components/play-tracks-button";
import { formatTotalDuration } from "@/lib/format/duration";
import { pluralize } from "@/lib/format/plural";
import { routes } from "@/lib/routes";
import { useAccountId, usePlaylistMutations, useUserPlaylist } from "../hooks/use-user-playlists";
import { normalizePlaylistName, PLAYLIST_NAME_MAX_LENGTH } from "../lib/playlist-name";
import type { UserPlaylistWithTracks } from "../types";
import { UserPlaylistCover } from "./user-playlist-cover";

const SECONDARY_BUTTON =
  "inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm font-medium transition-colors hover:border-accent hover:text-accent disabled:opacity-60";

/** Page d'une playlist perso : privée, entièrement rendue côté navigateur. */
export function UserPlaylistView({ id }: { id: string }) {
  const { state } = useAuth();
  const accountId = useAccountId();

  if (state.status === "signed-out") {
    return (
      <PageContainer>
        <EmptyState
          icon={ListMusic}
          title="Cette playlist est privée"
          description="Connecte-toi avec le compte qui l'a créée pour l'écouter."
          action={
            <Link
              href={`${routes.login}?next=${encodeURIComponent(routes.userPlaylist(id))}`}
              className="rounded-full bg-accent px-5 py-2.5 font-semibold text-accent-foreground"
            >
              Se connecter
            </Link>
          }
        />
      </PageContainer>
    );
  }

  if (!accountId) return <DetailPageSkeleton label="Chargement de la playlist…" />;
  return <PlaylistContent id={id} />;
}

function PlaylistContent({ id }: { id: string }) {
  const { data: playlist, isPending, isError, refetch } = useUserPlaylist(id);

  if (isPending) return <DetailPageSkeleton label="Chargement de la playlist…" />;

  if (isError || !playlist) {
    return (
      <PageContainer>
        <EmptyState
          icon={SearchX}
          title={isError ? "La playlist n'a pas pu être chargée" : "Playlist introuvable"}
          description={
            isError
              ? "Vérifie ta connexion puis réessaie."
              : "Elle a peut-être été supprimée, ou appartient à un autre compte."
          }
          action={
            isError ? (
              <button
                type="button"
                onClick={() => void refetch()}
                className="rounded-full bg-accent px-5 py-2.5 font-semibold text-accent-foreground"
              >
                Réessayer
              </button>
            ) : (
              <Link href={routes.library} className="text-accent underline underline-offset-4">
                Retour à la bibliothèque
              </Link>
            )
          }
        />
      </PageContainer>
    );
  }

  return <PlaylistDetails playlist={playlist} />;
}

function PlaylistDetails({ playlist }: { playlist: UserPlaylistWithTracks }) {
  const router = useRouter();
  const { rename, remove, removeTrack } = usePlaylistMutations();
  const [editing, setEditing] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const totalSeconds = playlist.tracks.reduce((sum, track) => sum + track.durationSeconds, 0);

  async function handleDelete() {
    try {
      await remove.mutateAsync(playlist.id);
      router.push(routes.library);
    } catch (error) {
      console.error(error);
      setConfirmingDelete(false);
    }
  }

  return (
    <PageContainer>
      <header className="grid items-end gap-6 sm:grid-cols-[minmax(0,16rem)_1fr] sm:gap-10">
        <UserPlaylistCover
          name={playlist.name}
          artwork={playlist.tracks[0]?.artwork}
          className="aspect-square w-full max-w-64 rounded-2xl shadow-[0_30px_80px_-30px] shadow-black"
        />
        <div className="flex min-w-0 flex-col gap-4">
          <p className="text-sm text-muted">Playlist perso</p>
          {editing ? (
            <RenameForm
              initialName={playlist.name}
              pending={rename.isPending}
              onCancel={() => setEditing(false)}
              onSave={async (name) => {
                await rename.mutateAsync({ id: playlist.id, name });
                setEditing(false);
              }}
            />
          ) : (
            <h1 className="font-display text-3xl leading-tight font-bold tracking-tight break-words sm:text-5xl">
              {playlist.name}
            </h1>
          )}
          <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
            <li>{pluralize(playlist.tracks.length, "morceau", "morceaux")}</li>
            {totalSeconds > 0 ? <li>{formatTotalDuration(totalSeconds)}</li> : null}
          </ul>
          <div className="flex flex-wrap items-center gap-3">
            <PlayTracksButton tracks={playlist.tracks} />
            {editing ? null : (
              <button type="button" onClick={() => setEditing(true)} className={SECONDARY_BUTTON}>
                <Pencil aria-hidden="true" className="size-4" />
                Renommer
              </button>
            )}
            {confirmingDelete ? (
              <>
                <button
                  type="button"
                  onClick={() => void handleDelete()}
                  disabled={remove.isPending}
                  className={`${SECONDARY_BUTTON} border-accent text-accent`}
                >
                  <Trash2 aria-hidden="true" className="size-4" />
                  {remove.isPending ? "Suppression…" : "Confirmer la suppression"}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmingDelete(false)}
                  className="text-sm text-muted hover:text-foreground"
                >
                  Annuler
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmingDelete(true)}
                className={SECONDARY_BUTTON}
              >
                <Trash2 aria-hidden="true" className="size-4" />
                Supprimer
              </button>
            )}
          </div>
        </div>
      </header>

      <section aria-labelledby="titres-playlist" className="flex flex-col gap-4">
        <h2 id="titres-playlist" className="sr-only">
          Titres
        </h2>
        {playlist.tracks.length > 0 ? (
          <TrackList
            tracks={playlist.tracks}
            labelledBy="titres-playlist"
            renderActions={(track) => (
              <IconButton
                icon={X}
                label={`Retirer ${track.title} de la playlist`}
                size="sm"
                disabled={removeTrack.isPending}
                onClick={() => removeTrack.mutate({ playlistId: playlist.id, trackId: track.id })}
              />
            )}
          />
        ) : (
          <EmptyState
            icon={ListMusic}
            title="Playlist vide"
            description="Ajoute des morceaux avec le bouton + de n'importe quel titre : tendances, recherche, pages artistes."
            action={
              <Link href={routes.search} className="text-accent underline underline-offset-4">
                Chercher des morceaux
              </Link>
            }
          />
        )}
      </section>
    </PageContainer>
  );
}

interface RenameFormProps {
  initialName: string;
  pending: boolean;
  onSave: (name: string) => Promise<void>;
  onCancel: () => void;
}

function RenameForm({ initialName, pending, onSave, onCancel }: RenameFormProps) {
  const [name, setName] = useState(initialName);
  const normalized = normalizePlaylistName(name);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (normalized) void onSave(normalized);
      }}
      className="flex flex-wrap items-center gap-2"
    >
      <label htmlFor="nom-playlist" className="sr-only">
        Nouveau nom de la playlist
      </label>
      <input
        id="nom-playlist"
        value={name}
        onChange={(event) => setName(event.target.value)}
        maxLength={PLAYLIST_NAME_MAX_LENGTH}
        autoFocus
        className="h-12 min-w-0 flex-1 rounded-xl border border-line bg-night px-4 font-display text-xl focus:border-accent focus:outline-none"
      />
      <button
        type="submit"
        disabled={!normalized || pending}
        className="h-12 rounded-full bg-accent px-5 font-semibold text-accent-foreground disabled:opacity-50"
      >
        Enregistrer
      </button>
      <IconButton icon={X} label="Annuler le renommage" onClick={onCancel} />
    </form>
  );
}
