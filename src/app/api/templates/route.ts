import { NextResponse } from 'next/server';
import { TemplateInfo } from '@/lib/types';

const templates: TemplateInfo[] = [
  {
    id: 'default',
    name: 'Default',
    description: 'Clean report with title, description, summary bar, and data table',
  },
  {
    id: 'tabular',
    name: 'Tabular',
    description: 'Compact data table with monospace font, optimized for dense data',
  },
];

export async function GET() {
  return NextResponse.json(templates);
}
