interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function PageContainer({ children, className = "" }: PageContainerProps) {
  return (
    <div
      className={`mx-auto flex max-w-6xl flex-col gap-10 px-4 py-8 sm:px-8 md:py-12 ${className}`}
    >
      {children}
    </div>
  );
}
