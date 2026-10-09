"use client";

import { Check, ListPlus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useId, useRef, useState } from "react";
import { IconButton } from "@/components/ui/icon-button";
import { routes } from "@/lib/routes";
import type { Track } from "@/types/music";
import { useAccountId, usePlaylistMutations, useUserPlaylists } from "../hooks/use-user-playlists";
import type { UserPlaylist } from "../types";
import { CreatePlaylistForm } from "./create-playlist-form";

interface AddToPlaylistButtonProps {
  track: Track;
  size?: "sm" | "md";
  className?: string;
  revealOnHover?: boolean;
}

/** Leaves time to read the confirmation before closing. */
const CLOSE_DELAY_MS = 900;

/** Native popover. Its content mounts on open, so playlists are only fetched when needed. */
export function AddToPlaylistButton({
  track,
  size = "sm",
  className = "",
  revealOnHover = false,
}: AddToPlaylistButtonProps) {
  const popoverId = useId();
  const popoverRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  const visibility = revealOnHover
    ? "opacity-0 group-focus-within:opacity-100 group-hover:opacity-100 focus-visible:opacity-100 pointer-coarse:opacity-100"
    : "";

  return (
    <>
      <IconButton
        icon={ListPlus}
        label={`Ajouter ${track.title} à une playlist`}
        popoverTarget={popoverId}
        size={size}
        className={`${visibility} ${className}`}
      />
      <div
        ref={popoverRef}
        id={popoverId}
        popover="auto"
        onToggle={(event) => setOpen((event.nativeEvent as ToggleEvent).newState === "open")}
        className="m-auto w-[min(22rem,calc(100vw-2rem))] rounded-2xl border border-line bg-surface p-4 text-foreground shadow-[0_20px_60px_-20px] shadow-black backdrop:bg-black/40"
      >
        {open ? (
          <AddToPlaylistPanel track={track} onDone={() => popoverRef.current?.hidePopover()} />
        ) : null}
      </div>
    </>
  );
}

function AddToPlaylistPanel({ track, onDone }: { track: Track; onDone: () => void }) {
  const userId = useAccountId();
  const pathname = usePathname();

  return (
    <div className="flex flex-col gap-3">
      <div>
        <h2 className="font-display text-base font-semibold">Ajouter à une playlist</h2>
        <p className="truncate text-sm text-muted">{track.title}</p>
      </div>
      {userId ? (
        <PlaylistPicker track={track} onDone={onDone} />
      ) : (
        <p className="text-sm text-muted">
          Les playlists sont liées à ton compte.{" "}
          <Link
            href={`${routes.login}?next=${encodeURIComponent(pathname)}`}
            className="font-medium text-accent underline underline-offset-4"
          >
            Connecte-toi
          </Link>{" "}
          pour en créer.
        </p>
      )}
    </div>
  );
}

function PlaylistPicker({ track, onDone }: { track: Track; onDone: () => void }) {
  const { data: playlists, isPending, isError } = useUserPlaylists();
  const { addTrack, create } = usePlaylistMutations();
  const [status, setStatus] = useState<{ message: string; ok: boolean } | null>(null);

  async function addTo(playlist: Pick<UserPlaylist, "id" | "name">) {
    try {
      const result = await addTrack.mutateAsync({ playlistId: playlist.id, trackId: track.id });
      if (result === "duplicate") {
        setStatus({ message: `Déjà dans « ${playlist.name} ».`, ok: true });
        return;
      }
      setStatus({ message: `Ajouté à « ${playlist.name} ».`, ok: true });
      setTimeout(onDone, CLOSE_DELAY_MS);
    } catch (error) {
      console.error(error);
      setStatus({ message: "L'ajout n'a pas abouti. Réessaie.", ok: false });
    }
  }

  return (
    <>
      {isPending ? (
        <p className="text-sm text-muted">Chargement de tes playlists…</p>
      ) : isError ? (
        <p className="text-sm text-accent">Tes playlists n&apos;ont pas pu être chargées.</p>
      ) : playlists.length > 0 ? (
        <ul className="-mx-2 flex max-h-56 flex-col overflow-y-auto">
          {playlists.map((playlist) => (
            <li key={playlist.id}>
              <button
                type="button"
                onClick={() => void addTo(playlist)}
                disabled={addTrack.isPending}
                className="flex w-full items-center justify-between gap-3 rounded-xl px-2 py-2 text-left text-sm transition-colors hover:bg-raised disabled:opacity-60"
              >
                <span className="truncate">{playlist.name}</span>
                <span className="shrink-0 text-xs text-muted tabular-nums">
                  {playlist.trackCount}
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted">Tu n&apos;as pas encore de playlist.</p>
      )}

      <CreatePlaylistForm
        submitLabel="Créer et ajouter"
        onCreate={async (name) => addTo(await create.mutateAsync(name))}
      />

      <p aria-live="polite" className="flex items-center gap-1.5 text-sm text-accent empty:hidden">
        {status?.ok ? <Check aria-hidden="true" className="size-4 shrink-0" /> : null}
        {status?.message}
      </p>
    </>
  );
}
