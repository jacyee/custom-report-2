'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { Customer } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { useToast } from '@/components/ui/toast';

const REPORT_TYPE_OPTIONS = [
  { label: 'Select report type…', value: '' },
  { label: 'Standard EkkoSoft Report', value: 'standard' },
  { label: 'Custom Report Template', value: 'custom' },
  { label: 'Item CSV', value: 'item-csv' },
];

const ORGANISATION_OPTIONS = [
  { label: 'Select organisation…', value: '' },
  { label: 'Organisation 1', value: 'organisation-1' },
  { label: 'Organisation 2', value: 'organisation-2' },
  { label: 'Organisation 3', value: 'organisation-3' },
];

const SITE_OPTIONS = [
  { label: 'Select site…', value: '' },
  { label: 'Site 01', value: 'site-01' },
  { label: 'Site 02', value: 'site-02' },
  { label: 'Site 03 Building', value: 'site-03-building' },
];

const PAGE_OPTIONS = [
  { label: 'Select page…', value: '' },
  { label: 'Page 1', value: 'page-1' },
  { label: 'Page 2', value: 'page-2' },
  { label: 'Page 3', value: 'page-3' },
  { label: 'Page 4', value: 'page-4' },
  { label: 'Page 5', value: 'page-5' },
  { label: 'Page 6', value: 'page-6' },
];

const REPORTING_LEVEL_OPTIONS = [
  { label: 'Select reporting level…', value: '' },
  { label: 'Site', value: 'site' },
  { label: 'Room', value: 'room' },
];

const FREQUENCY_OPTIONS = [
  { label: 'Select frequency…', value: '' },
  { label: 'Daily', value: 'daily' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Monthly', value: 'monthly' },
];

export default function NewScheduleGroupPage() {
  const router = useRouter();
  const { addToast } = useToast();

  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    fetch('/api/customers')
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setCustomers(data); })
      .catch(() => {});
  }, []);

  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    name: '',
    organisation: '',
    customerId: '',
    site: '',
    page: '',
    reportingLevel: '',
    reportType: '',
    frequency: '',
    scheduledTime: '',
    recipients: '',
    notes: '',
  });

  const [dataFrom, setDataFrom] = useState<Date | null>(null);
  const [dataTo, setDataTo] = useState<Date | null>(null);

  function set(field: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: '' }));
  }

  function validate() {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    return errs;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSaving(true);
    try {
      const res = await fetch('/api/schedule-groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          customerId: form.customerId || undefined,
          site: form.site || undefined,
          page: form.page || undefined,
          reportingLevel: form.reportingLevel || undefined,
          reportType: form.reportType || undefined,
          frequency: form.frequency || undefined,
          scheduledTime: form.scheduledTime.trim() || undefined,
          recipients: form.recipients.trim() || undefined,
          dataFrom: dataFrom?.toISOString() ?? undefined,
          dataTo: dataTo?.toISOString() ?? undefined,
          notes: form.notes.trim() || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? 'Failed to create schedule group');
      }

      addToast('Schedule group created successfully', 'success');
      router.push('/');
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Something went wrong', 'error');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-100">New Report Schedule Group</h1>
        <p className="text-sm text-zinc-400 mt-1">Configure a new report schedule group.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <div className="space-y-4">
          <Input
            label="Name *"
            placeholder="Schedule Group A"
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            error={errors.name}
          />
          <div className="space-y-1">
            <label className="block text-sm font-medium text-zinc-200">Organisation</label>
            <select
              value={form.organisation}
              onChange={(e) => set('organisation', e.target.value)}
              className="block w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              {ORGANISATION_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-zinc-200">Report Type</label>
            <select
              value={form.reportType}
              onChange={(e) => set('reportType', e.target.value)}
              className="block w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              {REPORT_TYPE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-zinc-200">Customer</label>
            <select
              value={form.customerId}
              onChange={(e) => set('customerId', e.target.value)}
              className="block w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="">Select customer…</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-zinc-200">Site</label>
            <select
              value={form.site}
              onChange={(e) => set('site', e.target.value)}
              className="block w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              {SITE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-zinc-200">Page</label>
            <select
              value={form.page}
              onChange={(e) => set('page', e.target.value)}
              className="block w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              {PAGE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-zinc-200">Reporting Level</label>
            <select
              value={form.reportingLevel}
              onChange={(e) => set('reportingLevel', e.target.value)}
              className="block w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              {REPORTING_LEVEL_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">Schedule</h2>
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-zinc-200">Frequency</label>
              <select
                value={form.frequency}
                onChange={(e) => set('frequency', e.target.value)}
                className="block w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                {FREQUENCY_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            <Input
              label="Scheduled Time"
              type="time"
              value={form.scheduledTime}
              onChange={(e) => set('scheduledTime', e.target.value)}
            />
            <Input
              label="Recipients"
              placeholder="email1@example.com, email2@example.com"
              value={form.recipients}
              onChange={(e) => set('recipients', e.target.value)}
            />
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">Report Data Duration</h2>
          <div className="grid grid-cols-2 gap-3">
            <DatePicker
              label="From"
              value={dataFrom}
              onChange={setDataFrom}
              maxDate={dataTo ?? undefined}
            />
            <DatePicker
              label="To"
              value={dataTo}
              onChange={setDataTo}
              minDate={dataFrom ?? undefined}
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-zinc-200">Notes</label>
          <textarea
            rows={3}
            placeholder="Any additional notes…"
            value={form.notes}
            onChange={(e) => set('notes', e.target.value)}
            className="block w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
          />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <Button type="submit" loading={saving}>
            Create Schedule Group
          </Button>
          <Button type="button" variant="secondary" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
