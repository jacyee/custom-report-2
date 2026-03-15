'use client';

import { useEffect, useState } from 'react';
import { Customer } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';

export function CustomersList() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    fetch('/api/customers')
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setCustomers(data); })
      .catch(() => addToast('Failed to load customers', 'error'))
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete customer "${name}"?`)) return;
    try {
      const res = await fetch(`/api/customers/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setCustomers((prev) => prev.filter((c) => c.id !== id));
        addToast(`Deleted "${name}"`, 'success');
      }
    } catch {
      addToast('Failed to delete', 'error');
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-zinc-400">Loading customers...</div>;
  }

  if (customers.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-4xl mb-3">&#128101;</div>
        <h2 className="text-lg font-semibold text-zinc-200">No customers yet</h2>
        <p className="text-zinc-400 mt-1 mb-6">Add your first customer to get started.</p>
        <a
          href="/customers/new"
          className="inline-flex items-center gap-1.5 px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-500"
        >
          + New Customer
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {customers.map((customer) => (
        <div
          key={customer.id}
          className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 flex items-center justify-between hover:border-zinc-700 transition-colors"
        >
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-zinc-100">{customer.name}</h3>
            <div className="flex flex-wrap gap-3 mt-1 text-xs text-zinc-500">
              {customer.contractId && <span>Contract: {customer.contractId}</span>}
              {customer.contractedPower && <span>Power: {customer.contractedPower}</span>}
              {customer.waterFlowRate && <span>Flow: {customer.waterFlowRate} L/s</span>}
              {(customer.temperatureMin || customer.temperatureMax) && (
                <span>Temp: {customer.temperatureMin ?? '—'} – {customer.temperatureMax ?? '—'}</span>
              )}
              {(customer.humidityMin || customer.humidityMax) && (
                <span>Humidity: {customer.humidityMin ?? '—'} – {customer.humidityMax ?? '—'}</span>
              )}
              <span>Added: {new Date(customer.createdAt).toLocaleDateString()}</span>
            </div>
            {customer.notes && (
              <p className="text-xs text-zinc-500 mt-1 truncate">{customer.notes}</p>
            )}
          </div>
          <div className="flex items-center gap-2 ml-4 shrink-0">
            <a href={`/customers/${customer.id}/edit`}>
              <Button variant="secondary" size="sm">Edit</Button>
            </a>
            <Button
              variant="danger"
              size="sm"
              onClick={() => handleDelete(customer.id, customer.name)}
            >
              Delete
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
