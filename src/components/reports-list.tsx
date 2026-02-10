'use client';

import { useEffect, useState } from 'react';
import { ReportConfig } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';

export function ReportsList() {
  const [reports, setReports] = useState<ReportConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const fetchReports = async () => {
    try {
      const res = await fetch('/api/reports');
      if (res.ok) {
        setReports(await res.json());
      }
    } catch {
      addToast('Failed to load reports', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete report "${name}"?`)) return;
    try {
      const res = await fetch(`/api/reports/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setReports((prev) => prev.filter((r) => r.id !== id));
        addToast(`Deleted "${name}"`, 'success');
      }
    } catch {
      addToast('Failed to delete', 'error');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12 text-zinc-400">Loading reports...</div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-4xl mb-3">&#128202;</div>
        <h2 className="text-lg font-semibold text-zinc-200">No reports yet</h2>
        <p className="text-zinc-400 mt-1 mb-6">Create your first report to get started.</p>
        <a
          href="/reports/new"
          className="inline-flex items-center gap-1.5 px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-500"
        >
          + New Report
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {reports.map((report) => (
        <div
          key={report.id}
          className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 flex items-center justify-between hover:border-zinc-700 transition-colors"
        >
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-zinc-100 truncate">{report.name}</h3>
            {report.description && (
              <p className="text-sm text-zinc-400 truncate">{report.description}</p>
            )}
            <div className="flex gap-3 mt-1 text-xs text-zinc-500">
              <span>{report.fieldMappings.filter((f) => f.enabled).length} fields</span>
              <span>Template: {report.templateId}</span>
              <span>Updated: {new Date(report.updatedAt).toLocaleDateString()}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 ml-4 shrink-0">
            <a href={`/reports/${report.id}/preview`}>
              <Button variant="primary" size="sm">
                View
              </Button>
            </a>
            <a href={`/reports/${report.id}/edit`}>
              <Button variant="secondary" size="sm">
                Edit
              </Button>
            </a>
            <Button
              variant="danger"
              size="sm"
              onClick={() => handleDelete(report.id, report.name)}
            >
              Delete
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
