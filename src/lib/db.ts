import { Patient, Doctor, Bed, DashboardStats } from '@/types/hospital';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const PATIENTS_FILE = path.join(DATA_DIR, 'patients.json');
const DOCTORS_FILE = path.join(DATA_DIR, 'doctors.json');
const BEDS_FILE = path.join(DATA_DIR, 'beds.json');

// Ensure data directory exists
async function ensureDataDir() {
  if (!existsSync(DATA_DIR)) {
    await mkdir(DATA_DIR, { recursive: true });
  }
}

// Initialize with sample data if files don't exist
async function initializeData() {
  await ensureDataDir();

  if (!existsSync(PATIENTS_FILE)) {
    await writeFile(PATIENTS_FILE, JSON.stringify([], null, 2));
  }

  if (!existsSync(DOCTORS_FILE)) {
    const defaultDoctors: Doctor[] = [
      {
        id: '1',
        name: 'Dr. John Smith',
        specialization: 'General',
        phone: '+1234567890',
        email: 'john.smith@hospital.com',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Dr. Sarah Johnson',
        specialization: 'Cardiologist',
        phone: '+1234567891',
        email: 'sarah.johnson@hospital.com',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '3',
        name: 'Dr. Michael Brown',
        specialization: 'Neurologist',
        phone: '+1234567892',
        email: 'michael.brown@hospital.com',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
    await writeFile(DOCTORS_FILE, JSON.stringify(defaultDoctors, null, 2));
  }

  if (!existsSync(BEDS_FILE)) {
    const defaultBeds: Bed[] = [];
    // Create 20 beds of different types
    const bedTypes: Bed['bed_type'][] = [
      'General',
      'ICU',
      'Private',
      'Semi-Private',
      'Emergency'
    ];
    for (let i = 1; i <= 20; i++) {
      const bedType = bedTypes[Math.floor((i - 1) / 4) % bedTypes.length];
      defaultBeds.push({
        id: `bed-${i}`,
        bed_number: `B${String(i).padStart(3, '0')}`,
        room_number: `R${Math.ceil(i / 2)}`,
        bed_type: bedType,
        occupied: false,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    }
    await writeFile(BEDS_FILE, JSON.stringify(defaultBeds, null, 2));
  }
}

// Read data from file
async function readData<T>(filePath: string): Promise<T[]> {
  await initializeData();
  try {
    const data = await readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// Write data to file
async function writeData<T>(filePath: string, data: T[]): Promise<void> {
  await ensureDataDir();
  await writeFile(filePath, JSON.stringify(data, null, 2));
}

// Patient operations
export async function getPatients(): Promise<Patient[]> {
  return readData<Patient>(PATIENTS_FILE);
}

export async function getPatient(id: string): Promise<Patient | null> {
  const patients = await getPatients();
  return patients.find((p) => p.id === id && p.is_active) || null;
}

export async function createPatient(
  patient: Omit<Patient, 'id' | 'created_at' | 'updated_at'>
): Promise<Patient> {
  const patients = await getPatients();
  const newPatient: Patient = {
    ...patient,
    id: `patient-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    // Default admission metadata
    admission_date: patient.admission_date || new Date().toISOString(),
    is_active: patient.is_active ?? true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  patients.push(newPatient);

  // Mark bed as occupied
  if (newPatient.bed_id) {
    await updateBedOccupancy(newPatient.bed_id, true);
  }

  await writeData(PATIENTS_FILE, patients);
  return newPatient;
}

export async function updatePatient(
  id: string,
  updates: Partial<Patient>
): Promise<Patient | null> {
  const patients = await getPatients();
  const index = patients.findIndex((p) => p.id === id);
  if (index === -1) return null;

  const oldBedId = patients[index].bed_id;
  patients[index] = {
    ...patients[index],
    ...updates,
    updated_at: new Date().toISOString()
  };

  // Handle bed changes
  if (updates.bed_id && updates.bed_id !== oldBedId) {
    if (oldBedId) await updateBedOccupancy(oldBedId, false);
    await updateBedOccupancy(updates.bed_id, true);
  }

  await writeData(PATIENTS_FILE, patients);
  return patients[index];
}

export async function deletePatient(id: string): Promise<boolean> {
  const patients = await getPatients();
  const index = patients.findIndex((p) => p.id === id);
  if (index === -1) return false;

  const patient = patients[index];
  // Free up bed
  if (patient.bed_id) {
    await updateBedOccupancy(patient.bed_id, false);
  }

  patients[index].is_active = false;
  await writeData(PATIENTS_FILE, patients);
  return true;
}

export async function dischargePatient(id: string): Promise<Patient | null> {
  const patient = await getPatient(id);
  if (!patient) return null;

  const updated = await updatePatient(id, {
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
  const doctors = await readData<Doctor>(DOCTORS_FILE);
  const patients = await getPatients();

  // Calculate patient count for each doctor
  return doctors.map((doctor) => ({
    ...doctor,
    patient_count: patients.filter(
      (p) => p.doctor_id === doctor.id && p.is_active
    ).length
  }));
}

export async function getDoctor(id: string): Promise<Doctor | null> {
  const doctors = await getDoctors();
  return doctors.find((d) => d.id === id && d.is_active) || null;
}

export async function createDoctor(
  doctor: Omit<Doctor, 'id' | 'created_at' | 'updated_at' | 'patient_count'>
): Promise<Doctor> {
  const doctors = await readData<Doctor>(DOCTORS_FILE);
  const newDoctor: Doctor = {
    ...doctor,
    id: `doctor-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  doctors.push(newDoctor);
  await writeData(DOCTORS_FILE, doctors);
  return newDoctor;
}

export async function updateDoctor(
  id: string,
  updates: Partial<Doctor>
): Promise<Doctor | null> {
  const doctors = await readData<Doctor>(DOCTORS_FILE);
  const index = doctors.findIndex((d) => d.id === id);
  if (index === -1) return null;

  doctors[index] = {
    ...doctors[index],
    ...updates,
    updated_at: new Date().toISOString()
  };
  await writeData(DOCTORS_FILE, doctors);
  return doctors[index];
}

export async function deleteDoctor(id: string): Promise<boolean> {
  const doctors = await readData<Doctor>(DOCTORS_FILE);
  const patients = await getPatients();

  // Check if doctor has active patients
  const activePatients = patients.filter(
    (p) => p.doctor_id === id && p.is_active
  );
  if (activePatients.length > 0) {
    throw new Error(
      `Cannot delete doctor - has ${activePatients.length} active patients`
    );
  }

  const index = doctors.findIndex((d) => d.id === id);
  if (index === -1) return false;

  doctors[index].is_active = false;
  await writeData(DOCTORS_FILE, doctors);
  return true;
}

// Bed operations
export async function getBeds(): Promise<Bed[]> {
  return readData<Bed>(BEDS_FILE);
}

export async function getBed(id: string): Promise<Bed | null> {
  const beds = await getBeds();
  return beds.find((b) => b.id === id && b.is_active) || null;
}

export async function getAvailableBeds(): Promise<Bed[]> {
  const beds = await getBeds();
  return beds.filter((b) => !b.occupied && b.is_active);
}

export async function createBed(
  bed: Omit<Bed, 'id' | 'created_at' | 'updated_at'>
): Promise<Bed> {
  const beds = await getBeds();

  // Check if bed number already exists
  if (beds.some((b) => b.bed_number === bed.bed_number)) {
    throw new Error(`Bed ${bed.bed_number} already exists`);
  }

  const newBed: Bed = {
    ...bed,
    id: `bed-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  beds.push(newBed);
  await writeData(BEDS_FILE, beds);
  return newBed;
}

export async function updateBed(
  id: string,
  updates: Partial<Bed>
): Promise<Bed | null> {
  const beds = await getBeds();
  const index = beds.findIndex((b) => b.id === id);
  if (index === -1) return null;

  beds[index] = {
    ...beds[index],
    ...updates,
    updated_at: new Date().toISOString()
  };
  await writeData(BEDS_FILE, beds);
  return beds[index];
}

async function updateBedOccupancy(
  bedId: string,
  occupied: boolean
): Promise<void> {
  const beds = await getBeds();
  const index = beds.findIndex((b) => b.id === bedId);
  if (index !== -1) {
    beds[index].occupied = occupied;
    beds[index].updated_at = new Date().toISOString();
    await writeData(BEDS_FILE, beds);
  }
}

export async function deleteBed(id: string): Promise<boolean> {
  const beds = await getBeds();
  const bed = beds.find((b) => b.id === id);

  if (bed?.occupied) {
    throw new Error(`Cannot delete bed - currently occupied`);
  }

  const index = beds.findIndex((b) => b.id === id);
  if (index === -1) return false;

  beds[index].is_active = false;
  await writeData(BEDS_FILE, beds);
  return true;
}

// Dashboard stats
export async function getDashboardStats(): Promise<DashboardStats> {
  const patients = await getPatients();
  const beds = await getBeds();
  const doctors = await getDoctors();

  const activePatients = patients.filter((p) => p.is_active);
  const bedStats: Record<
    string,
    { total: number; occupied: number; available: number }
  > = {};

  const bedTypes: Bed['bed_type'][] = [
    'General',
    'ICU',
    'Private',
    'Semi-Private',
    'Emergency'
  ];
  bedTypes.forEach((type) => {
    const typeBeds = beds.filter((b) => b.bed_type === type && b.is_active);
    bedStats[type] = {
      total: typeBeds.length,
      occupied: typeBeds.filter((b) => b.occupied).length,
      available: typeBeds.filter((b) => !b.occupied).length
    };
  });

  return {
    total_patients: activePatients.length,
    recovered_count: activePatients.filter((p) => p.status === 'Recovered')
      .length,
    deceased_count: activePatients.filter((p) => p.status === 'Deceased')
      .length,
    admitted_count: activePatients.filter((p) => p.status === 'Admitted')
      .length,
    beds_available: beds.filter((b) => !b.occupied && b.is_active).length,
    total_beds: beds.filter((b) => b.is_active).length,
    total_doctors: doctors.filter((d) => d.is_active).length,
    bed_stats: bedStats
  };
}
