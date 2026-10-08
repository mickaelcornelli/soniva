import { House, Library, type LucideIcon, Search } from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const mainNavigation: readonly NavItem[] = [
  { href: "/", label: "Accueil", icon: House },
  { href: "/search", label: "Rechercher", icon: Search },
  { href: "/library", label: "Bibliothèque", icon: Library },
];

export function isNavItemActive(href: string, pathname: string): boolean {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}
