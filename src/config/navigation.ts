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
  id: string;
  title: string;
  links: readonly FooterLink[];
}

/** Reused as-is by the HTML site map. */
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
      { href: routes.report, label: "Signaler un contenu" },
    ],
  },
  {
    id: "legal",
    title: "Légal",
    links: [
      { href: routes.trust, label: "Confidentialité et sécurité" },
      { href: routes.legal, label: "Mentions légales" },
      { href: routes.terms, label: "Conditions d'utilisation" },
      { href: routes.privacy, label: "Politique de confidentialité" },
      { href: routes.cookies, label: "Cookies" },
      { href: routes.cookieSettings, label: "Paramètres des cookies" },
      { href: routes.accessibility, label: "Accessibilité" },
    ],
  },
];

export function isNavItemActive(href: string, pathname: string): boolean {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}
