import { CustomersList } from '@/components/customers-list';

export default function CustomersPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Customers</h1>
          <p className="text-sm text-zinc-400 mt-1">Manage your customer records.</p>
        </div>
        <a
          href="/customers/new"
          className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors"
        >
          + New Customer
        </a>
      </div>
      <CustomersList />
    </div>
  );
}
