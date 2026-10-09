import { PageHeader } from "@/components/ui/page-header";
import { formatLongDate } from "@/lib/format/date";
import { PageContainer } from "./page-container";

export interface EditorialSection {
  id: string;
  title: string;
  content: React.ReactNode;
}

interface EditorialPageProps {
  title: string;
  description?: string;
  updatedAt?: string;
  notice?: React.ReactNode;
  sections?: readonly EditorialSection[];
  children?: React.ReactNode;
}

const MIN_SECTIONS_FOR_TOC = 4;

export function EditorialPage({
  title,
  description,
  updatedAt,
  notice,
  sections = [],
  children,
}: EditorialPageProps) {
  const updatedLabel = updatedAt ? formatLongDate(updatedAt) : null;
  const showToc = sections.length >= MIN_SECTIONS_FOR_TOC;

  return (
    <PageContainer>
      <div className="flex flex-col gap-4">
        <PageHeader title={title} description={description} />
        {updatedAt && updatedLabel ? (
          <p className="text-sm text-muted">
            Mis à jour le <time dateTime={updatedAt}>{updatedLabel}</time>
          </p>
        ) : null}
      </div>

      {notice}

      <div
        className={showToc ? "flex flex-col gap-10 lg:grid lg:grid-cols-[13rem_1fr] lg:gap-16" : ""}
      >
        {showToc ? (
          <nav aria-labelledby="sommaire" className="lg:sticky lg:top-8 lg:self-start">
            <h2 id="sommaire" className="mb-3 text-sm font-semibold">
              Sommaire
            </h2>
            <ol className="flex flex-col gap-2 border-l border-line text-sm">
              {sections.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="-ml-px block border-l border-transparent pl-4 text-muted transition-colors hover:border-foreground hover:text-foreground"
                  >
                    {section.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        ) : null}

        <div className="editorial flex min-w-0 flex-col gap-12">
          {sections.map((section) => (
            <section key={section.id} aria-labelledby={section.id} className="flex flex-col gap-4">
              <h2
                id={section.id}
                className="scroll-mt-8 font-display text-xl font-semibold text-foreground sm:text-2xl"
              >
                {section.title}
              </h2>
              {section.content}
            </section>
          ))}
          {children}
        </div>
      </div>
    </PageContainer>
  );
}
