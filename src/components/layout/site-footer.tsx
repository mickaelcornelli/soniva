import Link from "next/link";
import { LogoMark } from "@/components/brand/logo-mark";
import { footerNavigation } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { routes } from "@/lib/routes";
import { SocialLinks } from "./social-links";

export function SiteFooter() {
  return (
    // Le padding bas réserve la place de la barre mobile et du lecteur flottant.
    <footer className="mt-8 border-t border-line pb-[calc(var(--spacing-mobile-nav)+6rem)] md:pb-32">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 pt-12 sm:px-8 lg:flex-row lg:justify-between">
        <div className="flex max-w-xs flex-col gap-5">
          <Link
            href={routes.home}
            className="flex w-fit items-center gap-3"
            aria-label={`${siteConfig.name}, accueil`}
          >
            <LogoMark className="size-8" />
            <span aria-hidden="true" className="font-display text-lg font-semibold">
              {siteConfig.name}
            </span>
          </Link>
          <p className="text-sm text-pretty text-muted">
            {siteConfig.tagline} Des milliers d&apos;artistes indépendants, en écoute libre et
            gratuite.
          </p>
          <SocialLinks />
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 sm:gap-16">
          {footerNavigation.map((column) => {
            const headingId = `pied-${column.id}`;
            return (
              <nav key={column.id} aria-labelledby={headingId} className="flex flex-col gap-4">
                <h2 id={headingId} className="text-sm font-semibold">
                  {column.title}
                </h2>
                <ul className="flex flex-col gap-3 text-sm">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-muted transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            );
          })}
        </div>
      </div>

      <div className="mx-auto mt-12 flex max-w-6xl flex-col gap-2 px-4 text-xs text-muted sm:flex-row sm:justify-between sm:px-8">
        <p>
          © {new Date().getFullYear()} {siteConfig.name}
        </p>
        <p>
          Musique et flux audio fournis par{" "}
          <a
            href="https://audius.co"
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-line underline-offset-4 transition-colors hover:text-foreground"
          >
            Audius
          </a>
          .
        </p>
      </div>
    </footer>
  );
}
