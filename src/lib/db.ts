import { PrismaClient } from '@prisma/client';
import { Patient, Doctor, Bed, DashboardStats } from '@/types/hospital';

const prisma = new PrismaClient();

// Patient operations
export async function getPatients(): Promise<Patient[]> {
  const patients = await prisma.patient.findMany({
    where: { isActive: true },
    include: { bed: true, doctor: true }
  });
  return patients.map((p: any) => ({
    id: p.id,
    name: p.name,
    phone_num: p.phoneNum,
    patient_relative_name: p.patientRelativeName || undefined,
    patient_relative_contact: p.patientRelativeContact || undefined,
    address: p.address,
    symptoms: p.symptoms as any,
    prior_ailments: p.priorAilments || undefined,
    bed_id: p.bedId,
    dob: p.dob || undefined,
    doctor_id: p.doctorId || undefined,
    doctors_notes: p.doctorsNotes || undefined,
    doctors_visiting_time: p.doctorsVisitingTime || undefined,
    status: p.status as any,
    admission_date: p.admissionDate.toISOString(),
    discharge_date: p.dischargeDate?.toISOString(),
    is_active: p.isActive,
    created_at: p.createdAt.toISOString(),
    updated_at: p.updatedAt.toISOString()
  }));
}

export async function getPatient(id: string): Promise<Patient | null> {
  const patient = await prisma.patient.findFirst({
    where: { id, isActive: true },
    include: { bed: true, doctor: true }
  });
  if (!patient) return null;
  return {
    id: patient.id,
    name: patient.name,
    phone_num: patient.phoneNum,
    patient_relative_name: patient.patientRelativeName || undefined,
    patient_relative_contact: patient.patientRelativeContact || undefined,
    address: patient.address,
    symptoms: patient.symptoms as any,
    prior_ailments: patient.priorAilments || undefined,
    bed_id: patient.bedId,
    dob: patient.dob || undefined,
    doctor_id: patient.doctorId || undefined,
    doctors_notes: patient.doctorsNotes || undefined,
    doctors_visiting_time: patient.doctorsVisitingTime || undefined,
    status: patient.status as any,
    admission_date: patient.admissionDate.toISOString(),
    discharge_date: patient.dischargeDate?.toISOString(),
    is_active: patient.isActive,
    created_at: patient.createdAt.toISOString(),
    updated_at: patient.updatedAt.toISOString()
  };
}

export async function createPatient(
  patient: Omit<Patient, 'id' | 'created_at' | 'updated_at'>
): Promise<Patient> {
  const newPatient = await prisma.patient.create({
    data: {
      id: `patient-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: patient.name,
      phoneNum: patient.phone_num,
      patientRelativeName: patient.patient_relative_name,
      patientRelativeContact: patient.patient_relative_contact,
      address: patient.address,
      symptoms: patient.symptoms || [],
      priorAilments: patient.prior_ailments,
      bedId: patient.bed_id,
      dob: patient.dob,
      doctorId: patient.doctor_id,
      doctorsNotes: patient.doctors_notes,
      doctorsVisitingTime: patient.doctors_visiting_time,
      status: patient.status,
      admissionDate: new Date(patient.admission_date),
      dischargeDate: patient.discharge_date ? new Date(patient.discharge_date) : null,
      isActive: true
    }
  });

  // Mark bed as occupied
  if (newPatient.bedId) {
    await updateBedOccupancy(newPatient.bedId, true);
  }

  return {
    id: newPatient.id,
    name: newPatient.name,
    phone_num: newPatient.phoneNum,
    patient_relative_name: newPatient.patientRelativeName || undefined,
    patient_relative_contact: newPatient.patientRelativeContact || undefined,
    address: newPatient.address,
    symptoms: newPatient.symptoms as any,
    prior_ailments: newPatient.priorAilments || undefined,
    bed_id: newPatient.bedId,
    dob: newPatient.dob || undefined,
    doctor_id: newPatient.doctorId || undefined,
    doctors_notes: newPatient.doctorsNotes || undefined,
    doctors_visiting_time: newPatient.doctorsVisitingTime || undefined,
    status: newPatient.status as any,
    admission_date: newPatient.admissionDate.toISOString(),
    discharge_date: newPatient.dischargeDate?.toISOString(),
    is_active: newPatient.isActive,
    created_at: newPatient.createdAt.toISOString(),
    updated_at: newPatient.updatedAt.toISOString()
  };
}

export async function updatePatient(
  id: string,
  updates: Partial<Patient>
): Promise<Patient | null> {
  const patient = await prisma.patient.findUnique({ where: { id } });
  if (!patient) return null;

  const oldBedId = patient.bedId;

  const updated = await prisma.patient.update({
    where: { id },
    data: {
      name: updates.name,
      phoneNum: updates.phone_num,
      patientRelativeName: updates.patient_relative_name,
      patientRelativeContact: updates.patient_relative_contact,
      address: updates.address,
      symptoms: updates.symptoms,
      priorAilments: updates.prior_ailments,
      bedId: updates.bed_id,
      dob: updates.dob,
      doctorId: updates.doctor_id,
      doctorsNotes: updates.doctors_notes,
      doctorsVisitingTime: updates.doctors_visiting_time,
      status: updates.status,
      admissionDate: updates.admission_date ? new Date(updates.admission_date) : undefined,
      dischargeDate: updates.discharge_date ? new Date(updates.discharge_date) : undefined
    }
  });

  // Handle bed changes
  if (updates.bed_id && updates.bed_id !== oldBedId) {
    if (oldBedId) await updateBedOccupancy(oldBedId, false);
    await updateBedOccupancy(updates.bed_id, true);
  }

  return {
    id: updated.id,
    name: updated.name,
    phone_num: updated.phoneNum,
    patient_relative_name: updated.patientRelativeName || undefined,
    patient_relative_contact: updated.patientRelativeContact || undefined,
    address: updated.address,
    symptoms: updated.symptoms as any,
    prior_ailments: updated.priorAilments || undefined,
    bed_id: updated.bedId,
    dob: updated.dob || undefined,
    doctor_id: updated.doctorId || undefined,
    doctors_notes: updated.doctorsNotes || undefined,
    doctors_visiting_time: updated.doctorsVisitingTime || undefined,
    status: updated.status as any,
    admission_date: updated.admissionDate.toISOString(),
    discharge_date: updated.dischargeDate?.toISOString(),
    is_active: updated.isActive,
    created_at: updated.createdAt.toISOString(),
    updated_at: updated.updatedAt.toISOString()
  };
}

export async function deletePatient(id: string): Promise<boolean> {
  const patient = await prisma.patient.findUnique({ where: { id } });
  if (!patient) return false;

  // Free up bed
  if (patient.bedId) {
    await updateBedOccupancy(patient.bedId, false);
  }

  await prisma.patient.update({
    where: { id },
    data: { isActive: false }
  });
  return true;
}

export async function dischargePatient(id: string): Promise<Patient | null> {
  const patient = await getPatient(id);
  if (!patient) return null;

  const updated = await updatePatient(id, {
    ...patient,
    status: 'Discharged',
    discharge_date: new Date().toISOString()
  });

  if (updated && updated.bed_id) {
    await updateBedOccupancy(updated.bed_id, false);
  }

  return updated;
}

// Doctor operations
export async function getDoctors(): Promise<Doctor[]> {
  const doctors = await prisma.doctor.findMany({
    where: { isActive: true },
    include: { patients: true }
  });
  return doctors.map((d: any) => ({
    id: d.id,
    name: d.name,
    specialization: d.specialization as any,
    phone: d.phone || undefined,
    email: d.email || undefined,
    is_active: d.isActive,
    created_at: d.createdAt.toISOString(),
    updated_at: d.updatedAt.toISOString(),
    patient_count: d.patients.filter((p: any) => p.isActive).length
  }));
}

export async function getDoctor(id: string): Promise<Doctor | null> {
  const doctor = await prisma.doctor.findFirst({
    where: { id, isActive: true },
    include: { patients: true }
  });
  if (!doctor) return null;
  return {
    id: doctor.id,
    name: doctor.name,
    specialization: doctor.specialization as any,
    phone: doctor.phone || undefined,
    email: doctor.email || undefined,
    is_active: doctor.isActive,
    created_at: doctor.createdAt.toISOString(),
    updated_at: doctor.updatedAt.toISOString(),
    patient_count: doctor.patients.filter((p: any) => p.isActive).length
  };
}

export async function createDoctor(
  doctor: Omit<Doctor, 'id' | 'created_at' | 'updated_at' | 'patient_count'>
): Promise<Doctor> {
  const newDoctor = await prisma.doctor.create({
    data: {
      id: `doctor-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: doctor.name,
      specialization: doctor.specialization,
      phone: doctor.phone,
      email: doctor.email,
      isActive: true
    },
    include: { patients: true }
  });
  return {
    id: newDoctor.id,
    name: newDoctor.name,
    specialization: newDoctor.specialization as any,
    phone: newDoctor.phone || undefined,
    email: newDoctor.email || undefined,
    is_active: newDoctor.isActive,
    created_at: newDoctor.createdAt.toISOString(),
    updated_at: newDoctor.updatedAt.toISOString(),
    patient_count: 0
  };
}

export async function updateDoctor(
  id: string,
  updates: Partial<Doctor>
): Promise<Doctor | null> {
  const doctor = await prisma.doctor.findUnique({ 
    where: { id },
    include: { patients: true }
  });
  if (!doctor) return null;

  const updated = await prisma.doctor.update({
    where: { id },
    data: {
      name: updates.name,
      specialization: updates.specialization,
      phone: updates.phone,
      email: updates.email
    },
    include: { patients: true }
  });
  return {
    id: updated.id,
    name: updated.name,
    specialization: updated.specialization as any,
    phone: updated.phone || undefined,
    email: updated.email || undefined,
    is_active: updated.isActive,
    created_at: updated.createdAt.toISOString(),
    updated_at: updated.updatedAt.toISOString(),
    patient_count: updated.patients.filter((p: any) => p.isActive).length
  };
}

export async function deleteDoctor(id: string): Promise<boolean> {
  const patients = await prisma.patient.findMany({
    where: { doctorId: id, isActive: true }
  });

  if (patients.length > 0) {
    throw new Error(
      `Cannot delete doctor - has ${patients.length} active patients`
    );
  }

  await prisma.doctor.update({
    where: { id },
    data: { isActive: false }
  });
  return true;
}

// Bed operations
export async function getBeds(): Promise<Bed[]> {
  const beds = await prisma.bed.findMany({
    where: { isActive: true }
  });
  return beds.map((b: any) => ({
    id: b.id,
    bed_number: b.bedNumber,
    room_number: b.roomNumber || undefined,
    bed_type: b.bedType as any,
    occupied: b.occupied,
    is_active: b.isActive,
    created_at: b.createdAt.toISOString(),
    updated_at: b.updatedAt.toISOString()
  }));
}

export async function getBed(id: string): Promise<Bed | null> {
  const bed = await prisma.bed.findFirst({
    where: { id, isActive: true }
  });
  if (!bed) return null;
  return {
    id: bed.id,
    bed_number: bed.bedNumber,
    room_number: bed.roomNumber || undefined,
    bed_type: bed.bedType as any,
    occupied: bed.occupied,
    is_active: bed.isActive,
    created_at: bed.createdAt.toISOString(),
    updated_at: bed.updatedAt.toISOString()
  };
}

export async function getAvailableBeds(): Promise<Bed[]> {
  const beds = await prisma.bed.findMany({
    where: { occupied: false, isActive: true }
  });
  return beds.map((b: any) => ({
    id: b.id,
    bed_number: b.bedNumber,
    room_number: b.roomNumber || undefined,
    bed_type: b.bedType as any,
    occupied: b.occupied,
    is_active: b.isActive,
    created_at: b.createdAt.toISOString(),
    updated_at: b.updatedAt.toISOString()
  }));
}

export async function createBed(
  bed: Omit<Bed, 'id' | 'created_at' | 'updated_at'>
): Promise<Bed> {
  const existingBed = await prisma.bed.findFirst({
    where: { bedNumber: bed.bed_number }
  });
  if (existingBed) {
    throw new Error(`Bed ${bed.bed_number} already exists`);
  }

  const newBed = await prisma.bed.create({
    data: {
      id: `bed-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      bedNumber: bed.bed_number,
      roomNumber: bed.room_number,
      bedType: bed.bed_type,
      occupied: bed.occupied,
      isActive: true
    }
  });
  return {
    id: newBed.id,
    bed_number: newBed.bedNumber,
    room_number: newBed.roomNumber || undefined,
    bed_type: newBed.bedType as any,
    occupied: newBed.occupied,
    is_active: newBed.isActive,
    created_at: newBed.createdAt.toISOString(),
    updated_at: newBed.updatedAt.toISOString()
  };
}

export async function updateBed(
  id: string,
  updates: Partial<Bed>
): Promise<Bed | null> {
  const bed = await prisma.bed.findUnique({ where: { id } });
  if (!bed) return null;

  const updated = await prisma.bed.update({
    where: { id },
    data: {
      bedNumber: updates.bed_number,
      roomNumber: updates.room_number,
      bedType: updates.bed_type,
      occupied: updates.occupied
    }
  });
  return {
    id: updated.id,
    bed_number: updated.bedNumber,
    room_number: updated.roomNumber || undefined,
    bed_type: updated.bedType as any,
    occupied: updated.occupied,
    is_active: updated.isActive,
    created_at: updated.createdAt.toISOString(),
    updated_at: updated.updatedAt.toISOString()
  };
}

async function updateBedOccupancy(bedId: string, occupied: boolean): Promise<void> {
  await prisma.bed.update({
    where: { id: bedId },
    data: { occupied }
  });
}

export async function deleteBed(id: string): Promise<boolean> {
  const bed = await prisma.bed.findUnique({ where: { id } });

  if (bed?.occupied) {
    throw new Error(`Cannot delete bed - currently occupied`);
  }

  await prisma.bed.update({
    where: { id },
    data: { isActive: false }
  });
  return true;
}

// Dashboard stats
export async function getDashboardStats(): Promise<DashboardStats> {
  const patients = await prisma.patient.findMany({
    where: { isActive: true }
  });
  const beds = await prisma.bed.findMany({
    where: { isActive: true }
  });
  const doctors = await prisma.doctor.findMany({
    where: { isActive: true }
  });

  const bedStats: Record<
    string,
    { total: number; occupied: number; available: number }
  > = {};

  const bedTypes = ['General', 'ICU', 'Private', 'Semi-Private', 'Emergency'];
  bedTypes.forEach((type) => {
    const typeBeds = beds.filter((b) => b.bedType === type);
    bedStats[type] = {
      total: typeBeds.length,
      occupied: typeBeds.filter((b) => b.occupied).length,
      available: typeBeds.filter((b) => !b.occupied).length
    };
  });

  return {
    total_patients: patients.length,
    recovered_count: patients.filter((p) => p.status === 'Recovered').length,
    deceased_count: patients.filter((p) => p.status === 'Deceased').length,
    admitted_count: patients.filter((p) => p.status === 'Admitted').length,
    beds_available: beds.filter((b) => !b.occupied).length,
    total_beds: beds.length,
    total_doctors: doctors.length,
    bed_stats: bedStats
  };
}
