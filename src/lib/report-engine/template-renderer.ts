import Handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';
import { FieldMapping } from '@/lib/types';

function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  const parts = path.split('.');
  let current: unknown = obj;
  for (const part of parts) {
    if (current === null || current === undefined || typeof current !== 'object') {
      return undefined;
    }
    current = (current as Record<string, unknown>)[part];
  }
  return current;
}

// Register Handlebars helpers
Handlebars.registerHelper('formatValue', function (value: unknown, format?: string) {
  if (value === null || value === undefined) return '';

  if (!format) return String(value);

  if (format === 'currency') {
    const num = Number(value);
    return isNaN(num) ? String(value) : `$${num.toFixed(2)}`;
  }

  if (format === 'percent') {
    const num = Number(value);
    return isNaN(num) ? String(value) : `${(num * 100).toFixed(1)}%`;
  }

  if (format.startsWith('date:')) {
    try {
      const date = new Date(String(value));
      return date.toLocaleDateString();
    } catch {
      return String(value);
    }
  }

  if (format === 'date') {
    try {
      const date = new Date(String(value));
      return date.toLocaleDateString();
    } catch {
      return String(value);
    }
  }

  return String(value);
});

Handlebars.registerHelper('eq', function (a: unknown, b: unknown) {
  return a === b;
});

Handlebars.registerHelper('inc', function (value: number) {
  return value + 1;
});

export interface TemplateData {
  title: string;
  description: string;
  generatedAt: string;
  columns: { label: string; key: string; format?: string }[];
  rows: Record<string, unknown>[];
  totalRows: number;
}

/**
 * Prepare template data from raw API data + field mappings
 */
export function prepareTemplateData(
  rawData: unknown,
  fieldMappings: FieldMapping[],
  reportName: string,
  reportDescription: string
): TemplateData {
  const enabledFields = fieldMappings.filter((f) => f.enabled);

  const dataArray = Array.isArray(rawData) ? rawData : [rawData];

  const rows = dataArray.map((item) => {
    const row: Record<string, unknown> = {};
    for (const field of enabledFields) {
      const value = getNestedValue(item as Record<string, unknown>, field.sourcePath);
      row[field.sourcePath] = value;
    }
    return row;
  });

  return {
    title: reportName,
    description: reportDescription,
    generatedAt: new Date().toLocaleString(),
    columns: enabledFields.map((f) => ({
      label: f.label,
      key: f.sourcePath,
      format: f.format,
    })),
    rows,
    totalRows: rows.length,
  };
}

/**
 * Render a report using a Handlebars template
 */
export function renderTemplate(templateId: string, data: TemplateData): string {
  const templateDir = path.join(process.cwd(), 'src', 'templates', templateId);
  const templatePath = path.join(templateDir, 'template.hbs');
  const cssPath = path.join(templateDir, 'styles.css');

  if (!fs.existsSync(templatePath)) {
    throw new Error(`Template "${templateId}" not found`);
  }

  const templateSource = fs.readFileSync(templatePath, 'utf-8');
  const css = fs.existsSync(cssPath) ? fs.readFileSync(cssPath, 'utf-8') : '';

  const template = Handlebars.compile(templateSource);
  const html = template({ ...data, styles: css });

  return html;
}
