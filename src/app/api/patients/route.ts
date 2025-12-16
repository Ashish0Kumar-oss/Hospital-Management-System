import { NextRequest, NextResponse } from 'next/server';
import { getPatients, createPatient } from '@/lib/db';
import { Patient } from '@/types/hospital';

export async function GET() {
  try {
    const patients = await getPatients();
    return NextResponse.json(patients);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch patients' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const patient = await createPatient(
      body as Omit<Patient, 'id' | 'created_at' | 'updated_at'>
    );
    return NextResponse.json(patient, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create patient' },
      { status: 400 }
    );
  }
}
