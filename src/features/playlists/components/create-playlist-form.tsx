"use client";

import { useId, useState } from "react";
import { normalizePlaylistName, PLAYLIST_NAME_MAX_LENGTH } from "../lib/playlist-name";

interface CreatePlaylistFormProps {
  onCreate: (name: string) => Promise<void>;
  /** Libellé du bouton (« Créer », « Créer et ajouter »…). */
  submitLabel?: string;
  autoFocus?: boolean;
}

export function CreatePlaylistForm({
  onCreate,
  submitLabel = "Créer",
  autoFocus = false,
}: CreatePlaylistFormProps) {
  const inputId = useId();
  const [name, setName] = useState("");
  const [pending, setPending] = useState(false);
  const [failed, setFailed] = useState(false);
  const normalized = normalizePlaylistName(name);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!normalized) return;
    setPending(true);
    setFailed(false);
    try {
      await onCreate(normalized);
      setName("");
    } catch (error) {
      console.error(error);
      setFailed(true);
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={(event) => void handleSubmit(event)} className="flex flex-col gap-2">
      <label htmlFor={inputId} className="sr-only">
        Nom de la nouvelle playlist
      </label>
      <div className="flex gap-2">
        <input
          id={inputId}
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Nom de la playlist"
          maxLength={PLAYLIST_NAME_MAX_LENGTH}
          autoFocus={autoFocus}
          autoComplete="off"
          className="h-10 min-w-0 flex-1 rounded-full border border-field bg-night px-4 text-sm placeholder:text-muted focus:border-accent focus:outline-none"
        />
        <button
          type="submit"
          disabled={!normalized || pending}
          className="h-10 shrink-0 rounded-full bg-accent px-4 text-sm font-semibold text-accent-foreground disabled:opacity-50"
        >
          {pending ? "Création…" : submitLabel}
        </button>
      </div>
      {failed ? (
        <p role="alert" className="text-xs text-accent">
          La playlist n&apos;a pas pu être créée. Réessaie.
        </p>
      ) : null}
    </form>
  );
}
