import { NextRequest, NextResponse } from 'next/server';
import { updateReportSchema } from '@/lib/schemas';
import { getReportById, updateReport, deleteReport } from '@/lib/storage';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const report = await getReportById(id);
    if (!report) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }
    return NextResponse.json(report);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch report';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = updateReportSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid update data', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const updated = await updateReport(id, parsed.data);
    if (!updated) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update report';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = await deleteReport(id);
    if (!deleted) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete report';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
