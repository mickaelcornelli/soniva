import { PageContainer } from "@/components/layout/page-container";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingChartSkeleton } from "@/features/trending/components/trending-chart-skeleton";

export default function Loading() {
  return (
    <PageContainer>
      <div className="flex flex-col gap-3">
        <Skeleton className="h-10 w-80 max-w-full" />
        <Skeleton className="h-6 w-96 max-w-full" />
      </div>
      <TrendingChartSkeleton />
    </PageContainer>
  );
}
