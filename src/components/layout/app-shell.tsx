import { AudioEngine } from "@/features/player/engine/audio-engine";
import { PlayerBar } from "@/features/player/components/player-bar";
import { RadioEngine } from "@/features/radio/components/radio-engine";
import { MainNav } from "./main-nav";
import { SiteFooter } from "./site-footer";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh md:pl-rail">
      <a
        href="#contenu"
        className="sr-only z-50 rounded-lg bg-accent px-4 py-2 font-medium text-accent-foreground focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
      >
        Aller au contenu
      </a>
      <MainNav />
      <main id="contenu">{children}</main>
      <SiteFooter />
      <PlayerBar />
      <AudioEngine />
      <RadioEngine />
    </div>
  );
}
