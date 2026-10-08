import { Skeleton } from "@/components/ui/skeleton";
import { TrendingChartSkeleton } from "@/features/trending/components/trending-chart-skeleton";

export default function Loading() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-8 sm:px-8 md:py-12">
      <div className="flex flex-col gap-3">
        <Skeleton className="h-10 w-80 max-w-full" />
        <Skeleton className="h-6 w-96 max-w-full" />
      </div>
      <TrendingChartSkeleton />
    </div>
  );
}
