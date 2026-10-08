import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-3xl border border-dashed border-line px-6 py-16 text-center">
      <Icon aria-hidden="true" className="size-8 text-muted" strokeWidth={1.6} />
      <div className="flex max-w-md flex-col gap-2">
        <h2 className="font-display text-lg font-semibold">{title}</h2>
        <p className="text-muted">{description}</p>
      </div>
      {action}
    </div>
  );
}
