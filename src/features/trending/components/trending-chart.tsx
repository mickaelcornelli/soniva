import type { Track } from "@/types/music";
import { TrendingLeader } from "./trending-leader";
import { TrendingRow } from "./trending-row";

interface TrendingChartProps {
  tracks: readonly Track[];
}

/** Classement des tendances : le n°1 en vedette, puis la suite numérotée. */
export function TrendingChart({ tracks }: TrendingChartProps) {
  const [leader, ...others] = tracks;
  if (!leader) return null;

  return (
    <div className="flex flex-col gap-12">
      <TrendingLeader track={leader} />

      {others.length > 0 ? (
        <section aria-labelledby="suite-classement" className="flex flex-col gap-4">
          <h2 id="suite-classement" className="font-display text-xl font-semibold">
            La suite du classement
          </h2>
          <ol
            start={2}
            aria-labelledby="suite-classement"
            className="grid gap-x-8 gap-y-1 lg:grid-cols-2"
          >
            {others.map((track, index) => (
              <li key={track.id}>
                <TrendingRow track={track} rank={index + 2} />
              </li>
            ))}
          </ol>
        </section>
      ) : null}
    </div>
  );
}
