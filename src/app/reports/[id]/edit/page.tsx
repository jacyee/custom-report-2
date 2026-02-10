'use client';

import { useEffect, useState, use } from 'react';
import { Wizard } from '@/components/report-config/wizard';
import { ReportConfig } from '@/lib/types';

export default function EditReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [report, setReport] = useState<ReportConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/reports/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Report not found');
        return res.json();
      })
      .then(setReport)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="text-center py-12 text-zinc-400">Loading...</div>;
  if (error) return <div className="text-center py-12 text-red-400">{error}</div>;
  if (!report) return <div className="text-center py-12 text-zinc-400">Report not found</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-100 mb-6">Edit: {report.name}</h1>
      <Wizard existingReport={report} />
    </div>
  );
}
