import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/page-container";
import { SignInView } from "@/features/auth/components/sign-in-view";
import { safeRedirectPath } from "@/lib/safe-redirect";

export const metadata: Metadata = {
  title: "Connexion",
  robots: { index: false },
};

interface LoginPageProps {
  searchParams: Promise<{ next?: string; erreur?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { next, erreur } = await searchParams;

  return (
    <PageContainer className="items-center pt-16 text-center md:pt-24">
      <SignInView next={safeRedirectPath(next)} failed={erreur !== undefined} />
    </PageContainer>
  );
}
