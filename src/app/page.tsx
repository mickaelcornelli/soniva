import { Disc3 } from "lucide-react";
import { PageContainer } from "@/components/layout/page-container";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { TrendingChart } from "@/features/trending/components/trending-chart";
import { TrendingPlaylists } from "@/features/trending/components/trending-playlists";
import { loadOptional } from "@/lib/load-optional";
import { musicProvider } from "@/services/music";

export default async function HomePage() {
  const [tracks, playlists] = await Promise.all([
    musicProvider.getTrendingTracks({ period: "week" }),
    // Section secondaire : son échec ne doit pas faire tomber tout l'accueil.
    loadOptional(() => musicProvider.getTrendingPlaylists(), [], "accueil"),
  ]);

  return (
    <PageContainer>
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
      <TrendingPlaylists playlists={playlists} />
    </PageContainer>
  );
}
