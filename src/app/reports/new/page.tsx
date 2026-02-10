import { Wizard } from '@/components/report-config/wizard';

export default function NewReportPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-100 mb-6">New Report</h1>
      <Wizard />
    </div>
  );
}
