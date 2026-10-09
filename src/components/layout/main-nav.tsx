"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoMark } from "@/components/brand/logo-mark";
import { AccountMenu } from "@/features/auth/components/account-menu";
import { isNavItemActive, mainNavigation } from "@/config/navigation";
import { siteConfig } from "@/config/site";

/** One component for both layouts (desktop rail, mobile tab bar) so links aren't duplicated. */
export function MainNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navigation principale"
      className="fixed inset-x-0 bottom-0 z-40 h-mobile-nav border-t border-line bg-night/90 backdrop-blur-md md:inset-y-0 md:right-auto md:h-auto md:w-rail md:border-t-0 md:border-r"
    >
      <div className="flex h-full items-center justify-around md:flex-col md:justify-start md:gap-2 md:py-6">
        <Link href="/" className="mb-6 hidden md:block" aria-label={`${siteConfig.name}, accueil`}>
          <LogoMark className="size-9" />
        </Link>

        {mainNavigation.map(({ href, label, icon: Icon }) => {
          const active = isNavItemActive(href, pathname);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={`flex flex-col items-center gap-1 rounded-xl px-3 py-2 text-[0.6875rem] font-medium transition-colors ${
                active ? "text-accent" : "text-muted hover:text-foreground"
              }`}
            >
              <Icon aria-hidden="true" className="size-5" strokeWidth={active ? 2.4 : 1.8} />
              {label}
            </Link>
          );
        })}

        <div className="mt-auto hidden md:block">
          <AccountMenu />
        </div>
      </div>
    </nav>
  );
}
