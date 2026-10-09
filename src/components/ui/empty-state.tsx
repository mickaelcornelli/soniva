import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
  headingLevel?: 1 | 2;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  headingLevel = 2,
}: EmptyStateProps) {
  const Heading = headingLevel === 1 ? "h1" : "h2";
  return (
    <div className="flex flex-col items-center gap-4 rounded-3xl border border-dashed border-line px-6 py-16 text-center">
      <Icon aria-hidden="true" className="size-8 text-muted" strokeWidth={1.6} />
      <div className="flex max-w-md flex-col gap-2">
        <Heading className="font-display text-lg font-semibold">{title}</Heading>
        <p className="text-muted">{description}</p>
      </div>
      {action}
    </div>
  );
}
