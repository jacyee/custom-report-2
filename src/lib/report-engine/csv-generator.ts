import { TemplateData } from './template-renderer';

function escapeCSV(value: unknown): string {
  const str = value === null || value === undefined ? '' : String(value);
  // Escape if contains comma, quote, or newline
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Generate a CSV string from template data
 */
export function generateCsv(data: TemplateData): string {
  const lines: string[] = [];

  // Header row
  lines.push(data.columns.map((col) => escapeCSV(col.label)).join(','));

  // Data rows
  for (const row of data.rows) {
    const values = data.columns.map((col) => escapeCSV(row[col.key]));
    lines.push(values.join(','));
  }

  return lines.join('\n');
}
