'use client';

import { DashboardElement, FieldMapping } from '@/lib/types';
import { DashboardTable } from './dashboard-table';
import { DashboardChart } from './dashboard-chart';

interface DashboardPreviewProps {
  elements: DashboardElement[];
  fieldMappings: FieldMapping[];
}

export function DashboardPreview({ elements, fieldMappings }: DashboardPreviewProps) {
  if (elements.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {elements.map((el) => (
        <div key={el.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          {el.type === 'table' ? (
            <DashboardTable title={el.title} fieldMappings={fieldMappings} />
          ) : (
            <DashboardChart element={el} />
          )}
        </div>
      ))}
    </div>
  );
}
