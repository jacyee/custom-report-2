'use client';

import { useState } from 'react';
import { OutputFormat } from '@/lib/types';

export function useReportGeneration() {
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = async (reportId: string, format: OutputFormat) => {
    setGenerating(true);
    setError(null);

    try {
      const res = await fetch('/api/reports/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportId, format }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Generation failed' }));
        throw new Error(err.error || 'Generation failed');
      }

      if (format === 'html') {
        // Open HTML in new tab
        const html = await res.text();
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
        return;
      }

      // Download file
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;

      const ext = format === 'excel' ? 'xlsx' : format;
      const disposition = res.headers.get('Content-Disposition');
      const filenameMatch = disposition?.match(/filename="(.+?)"/);
      a.download = filenameMatch?.[1] || `report.${ext}`;

      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Generation failed';
      setError(message);
      throw err;
    } finally {
      setGenerating(false);
    }
  };

  return { generate, generating, error };
}
