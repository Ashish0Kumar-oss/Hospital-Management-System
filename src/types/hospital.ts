export type PatientStatus =
  | 'Admitted'
  | 'Recovered'
  | 'Discharged'
  | 'Deceased';

export type Symptom =
  | 'Fever'
  | 'Dry cough'
  | 'Tiredness'
  | 'Aches and pains'
  | 'Sore throat'
  | 'Diarrhoea'
  | 'Loss of taste or smell'
  | 'Difficulty in breathing or shortness of breath'
  | 'Chest pain or pressure'
  | 'Loss of speech or movement';

export type BedType =
  | 'General'
  | 'ICU'
  | 'Private'
  | 'Semi-Private'
  | 'Emergency';

export type DoctorSpecialization =
  | 'General'
  | 'Cardiologist'
  | 'Neurologist'
  | 'Pediatrician'
  | 'Surgeon'
  | 'Orthopedic'
  | 'Dermatologist'
  | 'Psychiatrist'
  | 'Emergency'
  | 'Other';

export interface Patient {
  id: string;
  name: string;
  phone_num: string;
  patient_relative_name?: string;
  patient_relative_contact?: string;
  address: string;
  symptoms?: Symptom[];
  prior_ailments?: string;
  bed_id: string;
  dob?: string;
  doctor_id?: string;
  doctors_notes?: string;
  doctors_visiting_time?: string;
  status: PatientStatus;
  admission_date: string;
  discharge_date?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialization: DoctorSpecialization;
  phone?: string;
  email?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  patient_count?: number;
}

export interface Bed {
  id: string;
  bed_number: string;
  room_number?: string;
  bed_type: BedType;
  occupied: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DashboardStats {
  total_patients: number;
  recovered_count: number;
  deceased_count: number;
  admitted_count: number;
  beds_available: number;
  total_beds: number;
  total_doctors: number;
  bed_stats: Record<
    string,
    { total: number; occupied: number; available: number }
  >;
}
