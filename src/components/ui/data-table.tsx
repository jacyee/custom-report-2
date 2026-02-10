'use client';

interface Column {
  key: string;
  label: string;
}

interface DataTableProps {
  columns: Column[];
  data: Record<string, unknown>[];
  maxRows?: number;
}

export function DataTable({ columns, data, maxRows = 50 }: DataTableProps) {
  const displayData = data.slice(0, maxRows);

  return (
    <div className="overflow-x-auto border border-zinc-800 rounded-lg">
      <table className="min-w-full divide-y divide-zinc-800">
        <thead className="bg-zinc-900">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-4 py-3 text-left text-xs font-semibold text-zinc-300 uppercase tracking-wider"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-zinc-950 divide-y divide-zinc-800">
          {displayData.map((row, i) => (
            <tr key={i} className="hover:bg-zinc-900/50">
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-2.5 text-sm text-zinc-300 whitespace-nowrap">
                  {String(row[col.key] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {data.length > maxRows && (
        <div className="px-4 py-2 bg-zinc-900 text-xs text-zinc-400 text-center border-t border-zinc-800">
          Showing {maxRows} of {data.length} rows
        </div>
      )}
    </div>
  );
}
