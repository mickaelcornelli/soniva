"use client";

import { LogOut } from "lucide-react";
import { useAuth } from "../auth-provider";
import { UserAvatar } from "./user-avatar";

export function AccountCard() {
  const { state, signOut } = useAuth();
  if (state.status !== "signed-in") return null;

  return (
    <div className="flex items-center gap-4 rounded-2xl border border-line bg-surface p-4">
      <UserAvatar user={state.user} className="size-12" />
      <div className="flex min-w-0 flex-1 flex-col">
        <p className="truncate font-medium">{state.user.name}</p>
        <p className="text-sm text-muted">Bibliothèque synchronisée</p>
      </div>
      <button
        type="button"
        onClick={() => void signOut()}
        className="flex items-center gap-2 rounded-full px-3 py-2 text-sm text-muted transition-colors hover:bg-raised hover:text-foreground"
      >
        <LogOut aria-hidden="true" className="size-4" />
        Se déconnecter
      </button>
    </div>
  );
}
