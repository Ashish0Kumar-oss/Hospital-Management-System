import { NextRequest, NextResponse } from 'next/server';
import { getBed, updateBed, deleteBed } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const bed = await getBed(id);
    if (!bed) {
      return NextResponse.json({ error: 'Bed not found' }, { status: 404 });
    }
    return NextResponse.json(bed);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch bed' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const bed = await updateBed(id, body);
    if (!bed) {
      return NextResponse.json({ error: 'Bed not found' }, { status: 404 });
    }
    return NextResponse.json(bed);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update bed' },
      { status: 400 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await deleteBed(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete bed' },
      { status: 400 }
    );
  }
}
