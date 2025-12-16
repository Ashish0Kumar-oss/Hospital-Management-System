import { NextRequest, NextResponse } from 'next/server';
import { getBeds, getAvailableBeds, createBed } from '@/lib/db';
import { Bed } from '@/types/hospital';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const availableOnly = searchParams.get('available') === 'true';

    const beds = availableOnly ? await getAvailableBeds() : await getBeds();
    return NextResponse.json(beds);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch beds' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const bed = await createBed(
      body as Omit<Bed, 'id' | 'created_at' | 'updated_at'>
    );
    return NextResponse.json(bed, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create bed' },
      { status: 400 }
    );
  }
}
