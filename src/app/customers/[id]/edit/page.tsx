'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';

export default function EditCustomerPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { addToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    name: '',
    contractId: '',
    contractedPower: '',
    allocatedPower: '',
    generatorFuelLevel: '',
    waterFlowRate: '',
    chilledWaterSupplyTemp: '',
    chilledWaterReturnTemp: '',
    temperatureMin: '',
    temperatureMax: '',
    humidityMin: '',
    humidityMax: '',
    notes: '',
  });

  useEffect(() => {
    fetch(`/api/customers/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setForm({
          name: data.name ?? '',
          contractId: data.contractId ?? '',
          contractedPower: data.contractedPower ?? '',
          allocatedPower: data.allocatedPower ?? '',
          generatorFuelLevel: data.generatorFuelLevel ?? '',
          waterFlowRate: data.waterFlowRate ?? '',
          chilledWaterSupplyTemp: data.chilledWaterSupplyTemp ?? '',
          chilledWaterReturnTemp: data.chilledWaterReturnTemp ?? '',
          temperatureMin: data.temperatureMin ?? '',
          temperatureMax: data.temperatureMax ?? '',
          humidityMin: data.humidityMin ?? '',
          humidityMax: data.humidityMax ?? '',
          notes: data.notes ?? '',
        });
      })
      .catch(() => addToast('Failed to load customer', 'error'))
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  function set(field: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: '' }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) { setErrors({ name: 'Name is required' }); return; }

    setSaving(true);
    try {
      const res = await fetch(`/api/customers/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          contractId: form.contractId.trim() || undefined,
          contractedPower: form.contractedPower.trim() || undefined,
          allocatedPower: form.allocatedPower.trim() || undefined,
          generatorFuelLevel: form.generatorFuelLevel.trim() || undefined,
          waterFlowRate: form.waterFlowRate.trim() || undefined,
          chilledWaterSupplyTemp: form.chilledWaterSupplyTemp.trim() || undefined,
          chilledWaterReturnTemp: form.chilledWaterReturnTemp.trim() || undefined,
          temperatureMin: form.temperatureMin.trim() || undefined,
          temperatureMax: form.temperatureMax.trim() || undefined,
          humidityMin: form.humidityMin.trim() || undefined,
          humidityMax: form.humidityMax.trim() || undefined,
          notes: form.notes.trim() || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? 'Failed to update customer');
      }

      addToast('Customer updated', 'success');
      router.push('/customers');
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Something went wrong', 'error');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="text-center py-12 text-zinc-400">Loading...</div>;
  }

  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-100">Edit Customer</h1>
        <p className="text-sm text-zinc-400 mt-1">Update customer record.</p>
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
              label="Allocated Power"
              placeholder="e.g. 450 kW"
              value={form.allocatedPower}
              onChange={(e) => set('allocatedPower', e.target.value)}
            />
            <Input
              label="Generator Fuel Level (Litre)"
              placeholder="e.g. 2000"
              value={form.generatorFuelLevel}
              onChange={(e) => set('generatorFuelLevel', e.target.value)}
            />
            <Input
              label="Water Flow Rate (Litre/s)"
              placeholder="e.g. 12.5"
              value={form.waterFlowRate}
              onChange={(e) => set('waterFlowRate', e.target.value)}
            />
            <Input
              label="Chilled Water Supply Temperature"
              placeholder="e.g. 7°C"
              value={form.chilledWaterSupplyTemp}
              onChange={(e) => set('chilledWaterSupplyTemp', e.target.value)}
            />
            <Input
              label="Chilled Water Return Temperature"
              placeholder="e.g. 12°C"
              value={form.chilledWaterReturnTemp}
              onChange={(e) => set('chilledWaterReturnTemp', e.target.value)}
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
            Save Changes
          </Button>
          <Button type="button" variant="secondary" onClick={() => router.push('/customers')}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
