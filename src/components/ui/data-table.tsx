interface DataTableProps {
  caption: string;
  columns: readonly string[];
  rows: readonly (readonly React.ReactNode[])[];
}

export function DataTable({ caption, columns, rows }: DataTableProps) {
  return (
    // Scrollable on mobile, so it must be focusable to scroll with the keyboard (WCAG 2.1.1).
    <div
      role="region"
      aria-label={caption}
      tabIndex={0}
      className="overflow-x-auto rounded-2xl border border-line"
    >
      <table className="w-full min-w-[34rem] text-left text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead className="bg-surface text-muted">
          <tr>
            {columns.map((column) => (
              <th key={column} scope="col" className="px-4 py-3 font-medium">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {rows.map(([head, ...cells], rowIndex) => (
            // Static tables: row order never changes.
            <tr key={rowIndex} className="align-top">
              <th scope="row" className="px-4 py-3 font-medium text-foreground">
                {head}
              </th>
              {cells.map((cell, cellIndex) => (
                <td key={cellIndex} className="px-4 py-3 text-muted">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
