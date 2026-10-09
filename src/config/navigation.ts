import { Compass, House, Library, type LucideIcon, Search } from "lucide-react";
import { routes } from "@/lib/routes";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const mainNavigation: readonly NavItem[] = [
  { href: routes.home, label: "Accueil", icon: House },
  { href: routes.search, label: "Rechercher", icon: Search },
  { href: routes.genres, label: "Genres", icon: Compass },
  { href: routes.library, label: "Bibliothèque", icon: Library },
];

export interface FooterLink {
  href: string;
  label: string;
}

export interface FooterColumn {
  /** Sert aussi d'identifiant au titre de la colonne (`aria-labelledby`). */
  id: string;
  title: string;
  links: readonly FooterLink[];
}

/** Colonnes du pied de page, reprises telles quelles par le plan du site. */
export const footerNavigation: readonly FooterColumn[] = [
  {
    id: "soniva",
    title: "Soniva",
    links: [
      { href: routes.about, label: "À propos" },
      { href: routes.forArtists, label: "Pour les artistes" },
      { href: routes.jobs, label: "Offres d'emploi" },
      { href: routes.reviews, label: "Avis" },
      { href: routes.credits, label: "Crédits et licences" },
    ],
  },
  {
    id: "aide",
    title: "Aide",
    links: [
      { href: routes.help, label: "Aide et FAQ" },
      { href: routes.contact, label: "Contact" },
      { href: routes.siteMap, label: "Plan du site" },
    ],
  },
];

export function isNavItemActive(href: string, pathname: string): boolean {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}
