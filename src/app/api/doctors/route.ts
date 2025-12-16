import { NextRequest, NextResponse } from 'next/server';
import { getDoctors, createDoctor } from '@/lib/db';
import { Doctor } from '@/types/hospital';

export async function GET() {
  try {
    const doctors = await getDoctors();
    return NextResponse.json(doctors);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch doctors' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const doctor = await createDoctor(
      body as Omit<Doctor, 'id' | 'created_at' | 'updated_at' | 'patient_count'>
    );
    return NextResponse.json(doctor, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create doctor' },
      { status: 400 }
    );
  }
}
