interface PageHeaderProps {
  title: string;
  description?: string;
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <header className="flex max-w-2xl flex-col gap-3">
      <h1 className="font-display text-3xl font-bold tracking-tight text-balance sm:text-4xl">
        {title}
      </h1>
      {description ? <p className="text-lg text-pretty text-muted">{description}</p> : null}
    </header>
  );
}
