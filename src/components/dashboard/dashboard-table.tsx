'use client';

import { DataTable } from '@/components/ui/data-table';
import { FieldMapping } from '@/lib/types';
import { sampleData } from '@/lib/sample-data';

interface DashboardTableProps {
  title: string;
  fieldMappings: FieldMapping[];
}

export function DashboardTable({ title, fieldMappings }: DashboardTableProps) {
  const enabledFields = fieldMappings.filter((f) => f.enabled);

  const columns = enabledFields.map((f) => ({
    key: f.sourcePath,
    label: f.label,
  }));

  const data = sampleData.map((item) => {
    const row: Record<string, unknown> = {};
    for (const field of enabledFields) {
      row[field.sourcePath] = (item as Record<string, unknown>)[field.sourcePath];
    }
    return row;
  });

  return (
    <div>
      <h3 className="font-semibold text-zinc-200 mb-3">{title}</h3>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
