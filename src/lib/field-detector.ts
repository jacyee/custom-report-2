import { DetectedField, FieldType } from '@/lib/types';

function detectType(value: unknown): FieldType {
  if (value === null || value === undefined) return 'unknown';
  if (typeof value === 'number') return 'number';
  if (typeof value === 'boolean') return 'boolean';
  if (typeof value === 'string') {
    if (/^\d{4}-\d{2}-\d{2}/.test(value) && !isNaN(Date.parse(value))) {
      return 'date';
    }
    return 'string';
  }
  return 'unknown';
}

function walkObject(
  obj: Record<string, unknown>,
  prefix: string,
  results: DetectedField[]
): void {
  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key;

    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      walkObject(value as Record<string, unknown>, path, results);
    } else if (Array.isArray(value)) {
      results.push({ path, type: 'string', sampleValue: `[Array(${value.length})]` });
    } else {
      results.push({ path, type: detectType(value), sampleValue: value });
    }
  }
}

export function detectFields(data: unknown): DetectedField[] {
  const results: DetectedField[] = [];

  if (Array.isArray(data)) {
    if (data.length === 0) return results;
    const sample = data[0];
    if (typeof sample === 'object' && sample !== null) {
      walkObject(sample as Record<string, unknown>, '', results);
    }
  } else if (typeof data === 'object' && data !== null) {
    walkObject(data as Record<string, unknown>, '', results);
  }

  return results;
}
