import { AudioEngine } from "@/features/player/engine/audio-engine";
import { PlayerBar } from "@/features/player/components/player-bar";
import { RadioEngine } from "@/features/radio/components/radio-engine";
import { MainNav } from "./main-nav";

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
      {/* Le padding bas réserve la place de la barre mobile et du lecteur flottant. */}
      <main id="contenu" className="pb-[calc(var(--spacing-mobile-nav)+6rem)] md:pb-32">
        {children}
      </main>
      <PlayerBar />
      <AudioEngine />
      <RadioEngine />
    </div>
  );
}
