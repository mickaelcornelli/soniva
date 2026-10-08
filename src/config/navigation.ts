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

export function isNavItemActive(href: string, pathname: string): boolean {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}
