/**
 * Genres musicaux proposés à l'exploration. `name` est la valeur canonique échangée avec
 * le provider (celle d'Audius aujourd'hui) ; `slug` sert aux URL ; `label` à l'affichage.
 * Les catégories non musicales du provider (podcasts, livres audio…) sont volontairement
 * absentes : elles n'ont pas de page.
 */
export interface Genre {
  slug: string;
  name: string;
  label: string;
  family: GenreFamily;
}

export type GenreFamily = "main" | "electronic";

export const GENRE_FAMILIES: readonly { id: GenreFamily; label: string }[] = [
  { id: "main", label: "Grands genres" },
  { id: "electronic", label: "Électronique" },
];

function genre(slug: string, name: string, family: GenreFamily, label = name): Genre {
  return { slug, name, label, family };
}

export const GENRES: readonly Genre[] = [
  genre("electronic", "Electronic", "main", "Électronique"),
  genre("hip-hop-rap", "Hip-Hop/Rap", "main", "Hip-hop / Rap"),
  genre("pop", "Pop", "main"),
  genre("rock", "Rock", "main"),
  genre("rnb-soul", "R&B/Soul", "main", "R&B / Soul"),
  genre("alternative", "Alternative", "main", "Alternatif"),
  genre("lo-fi", "Lo-Fi", "main"),
  genre("ambient", "Ambient", "main"),
  genre("jazz", "Jazz", "main"),
  genre("latin", "Latin", "main", "Latino"),
  genre("reggae", "Reggae", "main"),
  genre("dancehall", "Dancehall", "main"),
  genre("funk", "Funk", "main"),
  genre("blues", "Blues", "main"),
  genre("country", "Country", "main"),
  genre("folk", "Folk", "main"),
  genre("acoustic", "Acoustic", "main", "Acoustique"),
  genre("classical", "Classical", "main", "Classique"),
  genre("soundtrack", "Soundtrack", "main", "Bandes originales"),
  genre("world", "World", "main", "Musiques du monde"),
  genre("metal", "Metal", "main"),
  genre("punk", "Punk", "main"),
  genre("experimental", "Experimental", "main", "Expérimental"),
  genre("hyperpop", "Hyperpop", "main"),
  genre("devotional", "Devotional", "main", "Spirituel"),
  genre("kids", "Kids", "main", "Enfants"),
  genre("house", "House", "electronic"),
  genre("deep-house", "Deep House", "electronic"),
  genre("tech-house", "Tech House", "electronic"),
  genre("progressive-house", "Progressive House", "electronic"),
  genre("future-house", "Future House", "electronic"),
  genre("tropical-house", "Tropical House", "electronic"),
  genre("techno", "Techno", "electronic"),
  genre("trance", "Trance", "electronic"),
  genre("drum-and-bass", "Drum & Bass", "electronic"),
  genre("dubstep", "Dubstep", "electronic"),
  genre("trap", "Trap", "electronic"),
  genre("future-bass", "Future Bass", "electronic"),
  genre("downtempo", "Downtempo", "electronic"),
  genre("disco", "Disco", "electronic"),
  genre("electro", "Electro", "electronic"),
  genre("jungle", "Jungle", "electronic"),
  genre("hardstyle", "Hardstyle", "electronic"),
  genre("glitch-hop", "Glitch Hop", "electronic"),
  genre("jersey-club", "Jersey Club", "electronic"),
  genre("vaporwave", "Vaporwave", "electronic"),
  genre("moombahton", "Moombahton", "electronic"),
];

const bySlug = new Map(GENRES.map((g) => [g.slug, g]));
const byName = new Map(GENRES.map((g) => [g.name.toLowerCase(), g]));

export function findGenreBySlug(slug: string): Genre | undefined {
  return bySlug.get(slug);
}

/** Retrouve un genre à partir de la valeur renvoyée par le provider (casse ignorée). */
export function findGenreByName(name: string | null | undefined): Genre | undefined {
  return name ? byName.get(name.toLowerCase()) : undefined;
}

/** Libellé affichable d'un genre du provider, même hors catalogue. */
export function genreLabel(name: string): string {
  return findGenreByName(name)?.label ?? name;
}

/** Autres genres de la même famille, pour inviter à poursuivre l'exploration. */
export function relatedGenres(target: Genre, limit: number): Genre[] {
  return GENRES.filter((g) => g.family === target.family && g.slug !== target.slug).slice(0, limit);
}
