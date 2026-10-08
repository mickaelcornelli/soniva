export function TagList({ tags }: { tags: readonly string[] }) {
  if (tags.length === 0) return null;

  return (
    <ul aria-label="Tags" className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <li key={tag} className="rounded-full border border-line px-3 py-1 text-sm text-muted">
          {tag}
        </li>
      ))}
    </ul>
  );
}
