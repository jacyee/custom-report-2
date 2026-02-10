'use client';

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { DashboardElement } from '@/lib/types';
import { sampleData } from '@/lib/sample-data';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

interface DashboardChartProps {
  element: DashboardElement;
}

export function DashboardChart({ element }: DashboardChartProps) {
  const { chartType, categoryField, valueField, title } = element;

  if (!categoryField || !valueField) {
    return (
      <div className="text-center py-8 text-zinc-500 text-sm">
        Chart not configured — select category and value fields.
      </div>
    );
  }

  const chartData = sampleData.map((item) => ({
    category: String((item as Record<string, unknown>)[categoryField] ?? ''),
    value: Number((item as Record<string, unknown>)[valueField] ?? 0),
  }));

  return (
    <div>
      <h3 className="font-semibold text-zinc-200 mb-3">{title}</h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'pie' ? (
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ name }) => name}
              >
                {chartData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          ) : chartType === 'line' ? (
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          ) : (
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                {chartData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
