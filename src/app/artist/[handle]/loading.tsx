import { PageContainer } from "@/components/layout/page-container";
import { TrackListSkeleton } from "@/components/music/track-list-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <PageContainer>
      <div role="status" className="flex flex-col gap-12">
        <span className="sr-only">Chargement de l&apos;artiste…</span>
        <div className="flex flex-col">
          <Skeleton className="h-40 w-full rounded-3xl sm:h-64" />
          <div className="-mt-12 flex items-end gap-6 px-2 sm:-mt-16 sm:px-6">
            <Skeleton className="size-28 shrink-0 rounded-full border-4 border-night sm:size-36" />
            <div className="flex flex-1 flex-col gap-3 pb-1">
              <Skeleton className="h-10 w-1/2" />
              <Skeleton className="h-4 w-1/3" />
            </div>
          </div>
        </div>
        <TrackListSkeleton rows={6} />
      </div>
    </PageContainer>
  );
}
