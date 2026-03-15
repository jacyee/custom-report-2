import { NextRequest, NextResponse } from 'next/server';
import { createScheduleGroupSchema } from '@/lib/schemas';
import { getAllScheduleGroups, createScheduleGroup } from '@/lib/storage';

export async function GET() {
  try {
    const groups = await getAllScheduleGroups();
    return NextResponse.json(groups);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch schedule groups';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = createScheduleGroupSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid schedule group data', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const group = await createScheduleGroup(parsed.data);
    return NextResponse.json(group, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create schedule group';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
