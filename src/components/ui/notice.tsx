import { Info } from "lucide-react";

interface NoticeProps {
  title: string;
  children: React.ReactNode;
}

export function Notice({ title, children }: NoticeProps) {
  return (
    <aside
      role="note"
      className="flex gap-3 rounded-2xl border border-line bg-raised p-4 text-sm sm:p-5"
    >
      <Info aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-foreground" />
      <div className="flex flex-col gap-1">
        <p className="font-semibold">{title}</p>
        <div className="text-pretty text-muted">{children}</div>
      </div>
    </aside>
  );
}
