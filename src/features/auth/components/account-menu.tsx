"use client";

import { LogIn, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { routes } from "@/lib/routes";
import { useAuth } from "../auth-provider";
import { UserAvatar } from "./user-avatar";

const MENU_ID = "menu-compte";

export function AccountMenu() {
  const { state, signOut } = useAuth();
  const pathname = usePathname();

  if (state.status === "loading") {
    return <span aria-hidden="true" className="size-9 animate-pulse rounded-full bg-raised" />;
  }

  if (state.status === "signed-out") {
    return (
      <Link
        href={`${routes.login}?next=${encodeURIComponent(pathname)}`}
        className="flex flex-col items-center gap-1 rounded-xl px-3 py-2 text-[0.6875rem] font-medium text-muted transition-colors hover:text-foreground"
      >
        <LogIn aria-hidden="true" className="size-5" strokeWidth={1.8} />
        Connexion
      </Link>
    );
  }

  return (
    <>
      {/* Native popover: outside click and Escape handling come from the browser. */}
      <button
        type="button"
        popoverTarget={MENU_ID}
        aria-label={`Compte de ${state.user.name}`}
        className="rounded-full transition-transform hover:scale-105"
      >
        <UserAvatar user={state.user} />
      </button>
      <div
        id={MENU_ID}
        popover="auto"
        className="fixed inset-auto bottom-6 left-[calc(var(--spacing-rail)+0.5rem)] m-0 w-56 rounded-2xl border border-line bg-surface p-2 text-foreground shadow-[0_20px_60px_-20px] shadow-black"
      >
        <p className="truncate px-3 py-2 text-sm font-medium">{state.user.name}</p>
        <button
          type="button"
          popoverTarget={MENU_ID}
          popoverTargetAction="hide"
          onClick={() => void signOut()}
          className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-muted transition-colors hover:bg-raised hover:text-foreground"
        >
          <LogOut aria-hidden="true" className="size-4" />
          Se déconnecter
        </button>
      </div>
    </>
  );
}
