import { TrackList } from "@/components/music/track-list";
import type { Track } from "@/types/music";
import { TrendingLeader } from "./trending-leader";

interface TrendingChartProps {
  tracks: readonly Track[];
}

/** Classement des tendances : le n°1 en vedette, puis la suite numérotée. */
export function TrendingChart({ tracks }: TrendingChartProps) {
  const [leader, ...others] = tracks;
  if (!leader) return null;

  return (
    <div className="flex flex-col gap-12">
      <TrendingLeader track={leader} chart={tracks} />

      {others.length > 0 ? (
        <section aria-labelledby="suite-classement" className="flex flex-col gap-4">
          <h2 id="suite-classement" className="font-display text-xl font-semibold">
            La suite du classement
          </h2>
          <TrackList tracks={others} startAt={2} columns={2} labelledBy="suite-classement" />
        </section>
      ) : null}
    </div>
  );
}
