'use client';

import { useEffect, useState, use } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';
import { useReportGeneration } from '@/hooks/use-report-generation';
import { ReportConfig, OutputFormat } from '@/lib/types';
import { DashboardPreview } from '@/components/dashboard/dashboard-preview';

const FORMAT_OPTIONS: { format: OutputFormat; label: string; icon: string }[] = [
  { format: 'html', label: 'HTML', icon: '&#127760;' },
  { format: 'pdf', label: 'PDF', icon: '&#128196;' },
  { format: 'excel', label: 'Excel', icon: '&#128202;' },
  { format: 'csv', label: 'CSV', icon: '&#128196;' },
];

export default function PreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [report, setReport] = useState<ReportConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const { generate, generating } = useReportGeneration();
  const { addToast } = useToast();

  useEffect(() => {
    fetch(`/api/reports/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then(setReport)
      .catch(() => setReport(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleGenerate = async (format: OutputFormat) => {
    try {
      await generate(id, format);
      addToast(`${format.toUpperCase()} report generated!`, 'success');
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Generation failed', 'error');
    }
  };

  if (loading) return <div className="text-center py-12 text-zinc-400">Loading...</div>;
  if (!report) return <div className="text-center py-12 text-red-400">Report not found</div>;

  const enabledFields = report.fieldMappings.filter((f) => f.enabled);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">{report.name}</h1>
          {report.description && <p className="text-zinc-400 mt-1">{report.description}</p>}
        </div>
        <a href={`/reports/${id}/edit`}>
          <Button variant="secondary" size="sm">
            Edit
          </Button>
        </a>
      </div>

      {/* Report details */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-6">
        <h2 className="font-semibold text-zinc-200 mb-3">Configuration</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-zinc-400">Template:</span>
            <p className="mt-0.5 capitalize text-zinc-100">{report.templateId}</p>
          </div>
          <div>
            <span className="text-zinc-400">Fields ({enabledFields.length}):</span>
            <p className="mt-0.5 text-xs text-zinc-300">
              {enabledFields.map((f) => f.label).join(', ')}
            </p>
          </div>
        </div>
      </div>

      {/* Dashboard elements */}
      {report.dashboardElements && report.dashboardElements.length > 0 && (
        <div className="mb-6">
          <DashboardPreview
            elements={report.dashboardElements}
            fieldMappings={report.fieldMappings}
          />
        </div>
      )}

      {/* Export buttons */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <h2 className="font-semibold text-zinc-200 mb-4">Generate Report</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {FORMAT_OPTIONS.map(({ format, label, icon }) => (
            <button
              key={format}
              onClick={() => handleGenerate(format)}
              disabled={generating}
              className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-zinc-800 hover:border-blue-500 hover:bg-blue-950/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="text-2xl" dangerouslySetInnerHTML={{ __html: icon }} />
              <span className="text-sm font-medium text-zinc-200">{label}</span>
            </button>
          ))}
        </div>
        {generating && (
          <p className="text-sm text-blue-400 mt-3 text-center">Generating report...</p>
        )}
      </div>

      <div className="mt-6 text-center">
        <a href="/" className="text-sm text-zinc-400 hover:text-zinc-300">
          &larr; Back to all reports
        </a>
      </div>
    </div>
  );
}
