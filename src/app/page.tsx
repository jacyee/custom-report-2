import { ReportsList } from '@/components/reports-list';

export default function Home() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-100">Your Reports</h1>
        <p className="text-zinc-400 mt-1">
          Configure API endpoints, map response fields, and generate reports in multiple formats.
        </p>
      </div>
      <ReportsList />
    </div>
  );
}
