'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';

export default function NewCustomerPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    name: '',
    contractId: '',
    contractedPower: '',
    waterFlowRate: '',
    temperatureMin: '',
    temperatureMax: '',
    humidityMin: '',
    humidityMax: '',
    notes: '',
  });

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
      const res = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          contractId: form.contractId.trim() || undefined,
          contractedPower: form.contractedPower.trim() || undefined,
          waterFlowRate: form.waterFlowRate.trim() || undefined,
          temperatureMin: form.temperatureMin.trim() || undefined,
          temperatureMax: form.temperatureMax.trim() || undefined,
          humidityMin: form.humidityMin.trim() || undefined,
          humidityMax: form.humidityMax.trim() || undefined,
          notes: form.notes.trim() || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? 'Failed to create customer');
      }

      showToast('Customer created successfully', 'success');
      router.push('/');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Something went wrong', 'error');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-100">New Customer</h1>
        <p className="text-sm text-zinc-400 mt-1">Add a new customer record.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <div className="space-y-4">
          <Input
            label="Name *"
            placeholder="Customer A"
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            error={errors.name}
          />
          <Input
            label="Contract ID"
            placeholder="CTR-00123"
            value={form.contractId}
            onChange={(e) => set('contractId', e.target.value)}
          />
        </div>

        <div>
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">SLA</h2>
          <div className="space-y-4">
            <Input
              label="Contracted Power"
              placeholder="e.g. 500 kW"
              value={form.contractedPower}
              onChange={(e) => set('contractedPower', e.target.value)}
            />
            <Input
              label="Water Flow Rate (Litre/s)"
              placeholder="e.g. 12.5"
              value={form.waterFlowRate}
              onChange={(e) => set('waterFlowRate', e.target.value)}
            />
            <div>
              <p className="text-sm font-medium text-zinc-200 mb-2">Temperature</p>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Lower Limit"
                  placeholder="e.g. 18°C"
                  value={form.temperatureMin}
                  onChange={(e) => set('temperatureMin', e.target.value)}
                />
                <Input
                  label="Upper Limit"
                  placeholder="e.g. 27°C"
                  value={form.temperatureMax}
                  onChange={(e) => set('temperatureMax', e.target.value)}
                />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-200 mb-2">Humidity</p>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Lower Limit"
                  placeholder="e.g. 40%"
                  value={form.humidityMin}
                  onChange={(e) => set('humidityMin', e.target.value)}
                />
                <Input
                  label="Upper Limit"
                  placeholder="e.g. 70%"
                  value={form.humidityMax}
                  onChange={(e) => set('humidityMax', e.target.value)}
                />
              </div>
            </div>
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
            Create Customer
          </Button>
          <Button type="button" variant="secondary" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
