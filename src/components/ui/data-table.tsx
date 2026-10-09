interface DataTableProps {
  /** Décrit le tableau aux lecteurs d'écran (non affiché). */
  caption: string;
  columns: readonly string[];
  /** La première cellule de chaque ligne sert d'en-tête de ligne. */
  rows: readonly (readonly React.ReactNode[])[];
}

/** Tableau de référence des pages éditoriales, défilable horizontalement sur mobile. */
export function DataTable({ caption, columns, rows }: DataTableProps) {
  return (
    // Défilant sur mobile : focusable pour pouvoir le faire défiler au clavier (WCAG 2.1.1).
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
            // Tableaux statiques : l'ordre des lignes ne change jamais.
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
