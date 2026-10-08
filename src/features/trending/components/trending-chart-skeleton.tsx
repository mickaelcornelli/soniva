import { TrackListSkeleton } from "@/components/music/track-list-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export function TrendingChartSkeleton() {
  return (
    <div role="status" className="flex flex-col gap-12">
      <span className="sr-only">Chargement du classement…</span>
      <div className="grid items-end gap-6 sm:grid-cols-[minmax(0,18rem)_1fr] sm:gap-10">
        <Skeleton className="aspect-square w-full max-w-72 rounded-2xl" />
        <div className="flex flex-col gap-4">
          <Skeleton className="h-16 w-16" />
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-5 w-1/3" />
        </div>
      </div>
      <TrackListSkeleton rows={10} columns={2} />
    </div>
  );
}
