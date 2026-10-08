import { Disc3 } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { TrendingChart } from "@/features/trending/components/trending-chart";
import { musicProvider } from "@/services/music";

export default async function HomePage() {
  const tracks = await musicProvider.getTrendingTracks({ period: "week" });

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-8 sm:px-8 md:py-12">
      <PageHeader
        title="Tendances de la semaine"
        description="Les morceaux les plus écoutés sur Audius ces sept derniers jours."
      />
      {tracks.length > 0 ? (
        <TrendingChart tracks={tracks} />
      ) : (
        <EmptyState
          icon={Disc3}
          title="Aucun morceau dans le classement"
          description="Audius n'a renvoyé aucune tendance lisible pour cette semaine. Reviens dans quelques minutes."
        />
      )}
    </div>
  );
}
