import { PageContainer } from "@/components/layout/page-container";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingChartSkeleton } from "@/features/trending/components/trending-chart-skeleton";

export default function Loading() {
  return (
    <PageContainer>
      <div className="flex flex-col gap-3">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-14 w-72 max-w-full" />
        <Skeleton className="h-6 w-80 max-w-full" />
        <div className="flex gap-2">
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} className="h-9 w-28 rounded-full" />
          ))}
        </div>
      </div>
      <TrendingChartSkeleton />
    </PageContainer>
  );
}
