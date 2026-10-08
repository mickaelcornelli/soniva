import { Skeleton } from "@/components/ui/skeleton";

interface TrackListSkeletonProps {
  rows?: number;
  columns?: 1 | 2;
}

export function TrackListSkeleton({ rows = 8, columns = 1 }: TrackListSkeletonProps) {
  return (
    <div className={`grid gap-x-8 gap-y-3 ${columns === 2 ? "lg:grid-cols-2" : ""}`}>
      {Array.from({ length: rows }, (_, index) => (
        <div key={index} className="flex items-center gap-4 px-2">
          <Skeleton className="size-12 shrink-0 rounded-lg" />
          <div className="flex flex-1 flex-col gap-2">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3 w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}
