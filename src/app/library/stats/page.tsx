import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/page-container";
import { MonthlyStatsView } from "@/features/stats/components/monthly-stats-view";

export const metadata: Metadata = {
  title: "Ton mois en musique",
  robots: { index: false },
};

interface StatsPageProps {
  searchParams: Promise<{ month?: string | string[] }>;
}

export default async function StatsPage({ searchParams }: StatsPageProps) {
  const { month } = await searchParams;
  return (
    <PageContainer>
      <MonthlyStatsView period={month === "previous" ? "previous" : "current"} />
    </PageContainer>
  );
}
