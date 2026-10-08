import { siteConfig } from "@/config/site";

const BAR_HEIGHTS = [28, 52, 76, 44, 92, 60, 36, 80, 48, 68, 24, 56];

export default function HomePage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-10 px-6 text-center">
      <div aria-hidden="true" className="flex h-24 items-end gap-1.5">
        {BAR_HEIGHTS.map((height, index) => (
          <span
            key={index}
            className="from-wave to-accent w-2 rounded-full bg-linear-to-t"
            style={{ height: `${height}%` }}
          />
        ))}
      </div>

      <div className="flex max-w-xl flex-col gap-4">
        <h1 className="font-display text-5xl font-bold tracking-tight sm:text-7xl">
          {siteConfig.name}
        </h1>
        <p className="text-muted text-lg sm:text-xl">{siteConfig.tagline}</p>
      </div>

      <p className="border-border bg-surface text-muted rounded-full border px-4 py-2 text-sm">
        En construction — tendances, recherche et lecteur arrivent bientôt.
      </p>
    </main>
  );
}
