import { NextRequest, NextResponse } from 'next/server';
import { createReportSchema } from '@/lib/schemas';
import { getAllReports, createReport } from '@/lib/storage';

export async function GET() {
  try {
    const reports = await getAllReports();
    return NextResponse.json(reports);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch reports';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = createReportSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid report config', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const report = await createReport(parsed.data);
    return NextResponse.json(report, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create report';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
