import { ChevronDown } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { EditorialPage, type EditorialSection } from "@/components/layout/editorial-page";
import { siteConfig } from "@/config/site";
import { FAQ, type FaqItem } from "@/content/faq";
import { routes } from "@/lib/routes";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Aide et FAQ",
  description: `Les réponses aux questions fréquentes sur ${siteConfig.name} : écoute gratuite, compte, bibliothèque, recommandations et artistes.`,
  path: routes.help,
});

const SECTIONS: readonly EditorialSection[] = FAQ.map((group) => ({
  id: group.id,
  title: group.title,
  content: (
    <div className="flex flex-col gap-3">
      {group.items.map((item) => (
        <FaqEntry key={item.id} item={item} />
      ))}
    </div>
  ),
}));

export default function HelpPage() {
  return (
    <EditorialPage
      title="Aide et FAQ"
      description="Les questions qu'on nous pose le plus souvent."
      updatedAt="2026-10-09"
      sections={SECTIONS}
    >
      <p className="text-muted">
        Tu ne trouves pas ta réponse ? Écris-nous depuis la page{" "}
        <Link href={routes.contact}>Contact</Link>.
      </p>
    </EditorialPage>
  );
}

/** `<details>` natif : accessible au clavier et lisible sans JavaScript. */
function FaqEntry({ item }: { item: FaqItem }) {
  return (
    <details className="group rounded-2xl border border-line bg-surface open:bg-raised">
      <summary className="flex list-none items-center justify-between gap-4 px-5 py-4 font-medium text-foreground [&::-webkit-details-marker]:hidden">
        {item.question}
        <ChevronDown
          aria-hidden="true"
          className="size-4 shrink-0 text-muted transition-transform group-open:rotate-180 motion-reduce:transition-none"
        />
      </summary>
      <p className="px-5 pb-5 text-pretty">{item.answer}</p>
    </details>
  );
}
