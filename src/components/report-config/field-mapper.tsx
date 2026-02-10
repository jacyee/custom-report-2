'use client';

import { FieldMapping, DetectedField, FieldType } from '@/lib/types';
import { Select } from '@/components/ui/select';

interface FieldMapperProps {
  detectedFields: DetectedField[];
  fieldMappings: FieldMapping[];
  onChange: (mappings: FieldMapping[]) => void;
}

const typeOptions = [
  { value: 'string', label: 'Text' },
  { value: 'number', label: 'Number' },
  { value: 'boolean', label: 'Boolean' },
  { value: 'date', label: 'Date' },
  { value: 'unknown', label: 'Unknown' },
];

const formatOptions = [
  { value: '', label: 'None' },
  { value: 'currency', label: 'Currency ($)' },
  { value: 'percent', label: 'Percent (%)' },
  { value: 'date', label: 'Date' },
];

export function FieldMapper({ detectedFields, fieldMappings, onChange }: FieldMapperProps) {
  // Initialize from detected fields if no mappings yet
  const mappings: FieldMapping[] =
    fieldMappings.length > 0
      ? fieldMappings
      : detectedFields.map((f) => ({
          sourcePath: f.path,
          label: f.path
            .split('.')
            .pop()!
            .replace(/([A-Z])/g, ' $1')
            .replace(/[_-]/g, ' ')
            .replace(/^\w/, (c) => c.toUpperCase())
            .trim(),
          type: f.type,
          enabled: true,
        }));

  // If we just initialized, push up
  if (fieldMappings.length === 0 && mappings.length > 0) {
    // Use a microtask to avoid state update during render
    Promise.resolve().then(() => onChange(mappings));
  }

  const updateMapping = (index: number, updates: Partial<FieldMapping>) => {
    const next = mappings.map((m, i) => (i === index ? { ...m, ...updates } : m));
    onChange(next);
  };

  const toggleAll = (enabled: boolean) => {
    onChange(mappings.map((m) => ({ ...m, enabled })));
  };

  return (
    <div className="space-y-3">
      {mappings.length === 0 ? (
        <div className="text-center py-8 text-zinc-400">
          <p>No fields detected. Please test the API connection first.</p>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-zinc-400">{mappings.length} fields detected</span>
            <div className="flex gap-2">
              <button
                type="button"
                className="text-xs text-blue-500 hover:text-blue-400"
                onClick={() => toggleAll(true)}
              >
                Select all
              </button>
              <button
                type="button"
                className="text-xs text-blue-500 hover:text-blue-400"
                onClick={() => toggleAll(false)}
              >
                Deselect all
              </button>
            </div>
          </div>

          <div className="border border-zinc-800 rounded-lg divide-y divide-zinc-800">
            {mappings.map((mapping, i) => (
              <div
                key={mapping.sourcePath}
                className={`p-3 flex items-center gap-3 ${!mapping.enabled ? 'opacity-50 bg-zinc-900/50' : 'bg-zinc-950'}`}
              >
                <input
                  type="checkbox"
                  checked={mapping.enabled}
                  onChange={(e) => updateMapping(i, { enabled: e.target.checked })}
                  className="rounded border-zinc-700 text-blue-600 focus:ring-blue-500 bg-zinc-900"
                />

                <div className="flex-1 min-w-0">
                  <code className="text-xs text-zinc-500 block truncate">{mapping.sourcePath}</code>
                  <input
                    type="text"
                    value={mapping.label}
                    onChange={(e) => updateMapping(i, { label: e.target.value })}
                    className="mt-1 block w-full text-sm border-0 border-b border-zinc-800 focus:border-blue-500 focus:ring-0 px-0 py-0.5 bg-transparent text-zinc-100"
                    placeholder="Column label"
                  />
                </div>

                <div className="w-28 shrink-0">
                  <Select
                    value={mapping.type}
                    onChange={(e) => updateMapping(i, { type: e.target.value as FieldType })}
                    options={typeOptions}
                  />
                </div>

                <div className="w-32 shrink-0">
                  <Select
                    value={mapping.format || ''}
                    onChange={(e) => updateMapping(i, { format: e.target.value || undefined })}
                    options={formatOptions}
                  />
                </div>

                {detectedFields[i] && (
                  <span className="text-xs text-zinc-500 w-24 truncate shrink-0" title={String(detectedFields[i].sampleValue)}>
                    {String(detectedFields[i].sampleValue ?? '')}
                  </span>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
