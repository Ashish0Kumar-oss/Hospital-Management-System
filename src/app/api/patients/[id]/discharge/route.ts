import { NextRequest, NextResponse } from 'next/server';
import { dischargePatient } from '@/lib/db';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const patient = await dischargePatient(id);
    if (!patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }
    return NextResponse.json(patient);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to discharge patient' },
      { status: 400 }
    );
  }
}
