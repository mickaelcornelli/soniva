import { TrackListSkeleton } from "@/components/music/track-list-skeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { PageContainer } from "./page-container";

/** Squelette des pages morceau et playlist : en-tête avec pochette, puis une liste. */
export function DetailPageSkeleton({ label }: { label: string }) {
  return (
    <PageContainer>
      <div role="status" className="flex flex-col gap-12">
        <span className="sr-only">{label}</span>
        <div className="grid items-end gap-6 sm:grid-cols-[minmax(0,16rem)_1fr] sm:gap-10">
          <Skeleton className="aspect-square w-full max-w-64 rounded-2xl" />
          <div className="flex flex-col gap-4">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
        <TrackListSkeleton rows={6} />
      </div>
    </PageContainer>
  );
}
