import { NextRequest, NextResponse } from 'next/server';
import { deleteCustomer } from '@/lib/storage';

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const deleted = await deleteCustomer(id);
    if (!deleted) return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete customer';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
