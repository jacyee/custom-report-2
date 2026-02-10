'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { DashboardElement, FieldMapping, ChartType } from '@/lib/types';

interface DashboardConfiguratorProps {
  elements: DashboardElement[];
  fieldMappings: FieldMapping[];
  onChange: (elements: DashboardElement[]) => void;
}

let nextId = 1;
function genId() {
  return `el-${Date.now()}-${nextId++}`;
}

export function DashboardConfigurator({
  elements,
  fieldMappings,
  onChange,
}: DashboardConfiguratorProps) {
  const enabledFields = fieldMappings.filter((f) => f.enabled);
  const numericFields = enabledFields.filter((f) => f.type === 'number');
  const categoryFields = enabledFields.filter((f) => f.type === 'string' || f.type === 'date');

  // Auto-generate defaults when entering with no elements
  useEffect(() => {
    if (elements.length > 0) return;

    const defaults: DashboardElement[] = [
      { id: genId(), type: 'table', title: 'Data Table' },
    ];

    const catField = categoryFields[0]?.sourcePath;
    for (const nf of numericFields) {
      defaults.push({
        id: genId(),
        type: 'chart',
        title: `${nf.label} by ${categoryFields[0]?.label || 'Category'}`,
        chartType: 'bar',
        categoryField: catField,
        valueField: nf.sourcePath,
      });
    }

    if (defaults.length > 0) {
      onChange(defaults);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addTable = () => {
    onChange([...elements, { id: genId(), type: 'table', title: 'Data Table' }]);
  };

  const addChart = () => {
    onChange([
      ...elements,
      {
        id: genId(),
        type: 'chart',
        title: 'New Chart',
        chartType: 'bar',
        categoryField: categoryFields[0]?.sourcePath || '',
        valueField: numericFields[0]?.sourcePath || '',
      },
    ]);
  };

  const removeElement = (id: string) => {
    onChange(elements.filter((el) => el.id !== id));
  };

  const updateElement = (id: string, updates: Partial<DashboardElement>) => {
    onChange(elements.map((el) => (el.id === id ? { ...el, ...updates } : el)));
  };

  const chartTypeOptions = [
    { value: 'bar', label: 'Bar Chart' },
    { value: 'line', label: 'Line Chart' },
    { value: 'pie', label: 'Pie Chart' },
  ];

  const categoryOptions = categoryFields.map((f) => ({
    value: f.sourcePath,
    label: f.label,
  }));

  const valueOptions = numericFields.map((f) => ({
    value: f.sourcePath,
    label: f.label,
  }));

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-sm text-zinc-400">{elements.length} element(s)</span>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={addTable}>
            + Table
          </Button>
          <Button variant="secondary" size="sm" onClick={addChart} disabled={numericFields.length === 0}>
            + Chart
          </Button>
        </div>
      </div>

      {elements.length === 0 && (
        <div className="text-center py-8 text-zinc-500 text-sm">
          No dashboard elements yet. Add a table or chart above.
        </div>
      )}

      <div className="space-y-3">
        {elements.map((el) => (
          <div key={el.id} className="border border-zinc-800 rounded-lg p-4 space-y-3 bg-zinc-950">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-400 uppercase">
                {el.type === 'table' ? 'Table' : 'Chart'}
              </span>
              <button
                type="button"
                className="text-zinc-400 hover:text-red-500 text-sm"
                onClick={() => removeElement(el.id)}
              >
                Remove
              </button>
            </div>

            <input
              type="text"
              value={el.title}
              onChange={(e) => updateElement(el.id, { title: e.target.value })}
              className="block w-full text-sm border rounded-lg border-zinc-700 bg-zinc-900 text-zinc-100 px-3 py-1.5"
              placeholder="Element title"
            />

            {el.type === 'chart' && (
              <div className="grid grid-cols-3 gap-3">
                <Select
                  label="Chart Type"
                  value={el.chartType || 'bar'}
                  onChange={(e) => updateElement(el.id, { chartType: e.target.value as ChartType })}
                  options={chartTypeOptions}
                />
                <Select
                  label="Category Field"
                  value={el.categoryField || ''}
                  onChange={(e) => updateElement(el.id, { categoryField: e.target.value })}
                  options={categoryOptions}
                />
                <Select
                  label="Value Field"
                  value={el.valueField || ''}
                  onChange={(e) => updateElement(el.id, { valueField: e.target.value })}
                  options={valueOptions}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
