import { Skeleton } from "@/components/ui/skeleton";

const PLACEHOLDER_ROWS = 10;

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
      <div className="grid gap-x-8 gap-y-3 lg:grid-cols-2">
        {Array.from({ length: PLACEHOLDER_ROWS }, (_, index) => (
          <div key={index} className="flex items-center gap-4 px-2">
            <Skeleton className="size-12 shrink-0 rounded-lg" />
            <div className="flex flex-1 flex-col gap-2">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-3 w-1/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
