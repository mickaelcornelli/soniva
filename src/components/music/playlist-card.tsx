import Link from "next/link";
import { ArtworkImage } from "@/components/ui/artwork-image";
import { routes } from "@/lib/routes";
import type { Playlist } from "@/types/music";

export function PlaylistCard({ playlist }: { playlist: Playlist }) {
  return (
    <article className="group relative flex flex-col gap-3">
      <ArtworkImage
        artwork={playlist.artwork}
        size="medium"
        sizes="(min-width: 1024px) 12rem, (min-width: 640px) 30vw, 45vw"
        alt=""
        className="aspect-square w-full rounded-2xl transition-transform duration-300 group-hover:-translate-y-1 motion-reduce:transition-none"
      />
      <div className="flex min-w-0 flex-col">
        <h3 className="truncate font-medium">
          <Link href={routes.playlist(playlist.id)} className="after:absolute after:inset-0">
            {playlist.name}
          </Link>
        </h3>
        <p className="truncate text-sm text-muted">{playlist.owner.name}</p>
      </div>
    </article>
  );
}
