'use client';

import { useEffect, useState } from 'react';
import { TemplateInfo } from '@/lib/types';

interface TemplateSelectorProps {
  value: string;
  onChange: (templateId: string) => void;
}

export function TemplateSelector({ value, onChange }: TemplateSelectorProps) {
  const [templates, setTemplates] = useState<TemplateInfo[]>([]);

  useEffect(() => {
    fetch('/api/templates')
      .then((res) => res.json())
      .then(setTemplates)
      .catch(() => {});
  }, []);

  return (
    <div className="grid grid-cols-2 gap-4">
      {templates.map((tpl) => (
        <button
          key={tpl.id}
          type="button"
          onClick={() => onChange(tpl.id)}
          className={`p-4 rounded-lg border-2 text-left transition-all ${
            value === tpl.id
              ? 'border-blue-500 bg-blue-950/30 ring-2 ring-blue-900/50'
              : 'border-zinc-800 hover:border-zinc-700 bg-zinc-950'
          }`}
        >
          <div className="font-semibold text-sm text-zinc-100">{tpl.name}</div>
          <div className="text-xs text-zinc-400 mt-1">{tpl.description}</div>

          {/* Mini preview */}
          <div className="mt-3 rounded border border-zinc-800 bg-white p-2">
            {tpl.id === 'default' ? (
              <div className="space-y-1.5">
                <div className="h-2 w-20 bg-blue-400 rounded" />
                <div className="h-1.5 w-32 bg-gray-200 rounded" />
                <div className="mt-2 space-y-1">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="flex gap-1">
                      <div className="h-1.5 w-8 bg-gray-300 rounded" />
                      <div className="h-1.5 w-16 bg-gray-200 rounded" />
                      <div className="h-1.5 w-12 bg-gray-200 rounded" />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-0.5">
                <div className="h-2 bg-gray-800 rounded-t" />
                {[1, 2, 3, 4].map((n) => (
                  <div
                    key={n}
                    className={`h-1.5 rounded-sm ${n % 2 === 0 ? 'bg-gray-100' : 'bg-gray-50'}`}
                  />
                ))}
              </div>
            )}
          </div>
        </button>
      ))}
    </div>
  );
}
