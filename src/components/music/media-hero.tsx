import { ArtworkImage } from "@/components/ui/artwork-image";
import type { Artwork } from "@/types/music";

interface MediaHeroProps {
  artwork: Artwork;
  artworkAlt: string;
  title: string;
  /** Nature du contenu quand elle n'est pas évidente (« Album », « Playlist »). */
  kind?: string;
  children?: React.ReactNode;
}

/** En-tête des pages morceau et playlist : pochette à gauche, informations à droite. */
export function MediaHero({ artwork, artworkAlt, title, kind, children }: MediaHeroProps) {
  return (
    <header className="grid items-end gap-6 sm:grid-cols-[minmax(0,16rem)_1fr] sm:gap-10">
      <ArtworkImage
        artwork={artwork}
        size="large"
        alt={artworkAlt}
        priority
        className="aspect-square w-full max-w-64 rounded-2xl shadow-[0_30px_80px_-30px] shadow-black"
      />
      <div className="flex min-w-0 flex-col gap-4">
        {kind ? <p className="text-sm text-muted">{kind}</p> : null}
        <h1 className="font-display text-3xl leading-tight font-bold tracking-tight text-balance break-words sm:text-5xl">
          {title}
        </h1>
        {children}
      </div>
    </header>
  );
}
