import PageContainer from '@/components/layout/page-container';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getPatient, getBed, getDoctor } from '@/lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Edit, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { PatientStatus } from '@/types/hospital';
import DischargePatientButton from '@/features/hospital/components/discharge-patient-button';

const statusColors: Record<PatientStatus, string> = {
  Admitted: 'bg-blue-500',
  Recovered: 'bg-green-500',
  Discharged: 'bg-gray-500',
  Deceased: 'bg-red-500'
};

export default async function PatientDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const patient = await getPatient(id);

  if (!patient) {
    notFound();
  }

  const bed = patient.bed_id ? await getBed(patient.bed_id) : null;
  const doctor = patient.doctor_id ? await getDoctor(patient.doctor_id) : null;

  return (
    <PageContainer>
      <div className='animate-in fade-in-50 flex flex-1 flex-col space-y-6 duration-500'>
        <div className='flex items-center justify-between'>
          <Link href='/dashboard/patients'>
            <Button variant='ghost' size='sm'>
              <ArrowLeft className='mr-2 h-4 w-4' />
              Back to Patients
            </Button>
          </Link>
          <div className='flex gap-2'>
            {patient.status === 'Admitted' && (
              <DischargePatientButton
                patientId={patient.id}
                patientName={patient.name}
              />
            )}
            <Link href={`/dashboard/patients/${id}/edit`}>
              <Button>
                <Edit className='mr-2 h-4 w-4' />
                Edit
              </Button>
            </Link>
          </div>
        </div>

        <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
          <Card className='animate-in fade-in-50 slide-in-from-left-4 md:col-span-2'>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <CardTitle className='text-2xl'>{patient.name}</CardTitle>
                <Badge className={`${statusColors[patient.status]} text-white`}>
                  {patient.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div>
                <h3 className='mb-3 font-semibold'>Personal Information</h3>
                <div className='grid grid-cols-2 gap-4 text-sm'>
                  <div>
                    <p className='text-muted-foreground'>Phone Number</p>
                    <p className='font-medium'>{patient.phone_num}</p>
                  </div>
                  {patient.dob && (
                    <div>
                      <p className='text-muted-foreground'>Date of Birth</p>
                      <p className='font-medium'>
                        {format(new Date(patient.dob), 'MMM d, yyyy')}
                      </p>
                    </div>
                  )}
                  <div className='col-span-2'>
                    <p className='text-muted-foreground'>Address</p>
                    <p className='font-medium'>{patient.address}</p>
                  </div>
                </div>
              </div>

              {patient.patient_relative_name && (
                <div>
                  <h3 className='mb-3 font-semibold'>Relative Information</h3>
                  <div className='grid grid-cols-2 gap-4 text-sm'>
                    <div>
                      <p className='text-muted-foreground'>Relative Name</p>
                      <p className='font-medium'>
                        {patient.patient_relative_name}
                      </p>
                    </div>
                    {patient.patient_relative_contact && (
                      <div>
                        <p className='text-muted-foreground'>
                          Relative Contact
                        </p>
                        <p className='font-medium'>
                          {patient.patient_relative_contact}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div>
                <h3 className='mb-3 font-semibold'>Medical Information</h3>
                <div className='space-y-4 text-sm'>
                  {bed && (
                    <div>
                      <p className='text-muted-foreground'>Assigned Bed</p>
                      <p className='font-medium'>
                        {bed.bed_number} ({bed.bed_type}
                        {bed.room_number ? ` - Room ${bed.room_number}` : ''})
                      </p>
                    </div>
                  )}
                  {doctor && (
                    <div>
                      <p className='text-muted-foreground'>Assigned Doctor</p>
                      <p className='font-medium'>
                        Dr. {doctor.name} ({doctor.specialization})
                      </p>
                    </div>
                  )}
                  {patient.symptoms && patient.symptoms.length > 0 && (
                    <div>
                      <p className='text-muted-foreground mb-2'>Symptoms</p>
                      <div className='flex flex-wrap gap-2'>
                        {patient.symptoms.map((symptom, idx) => (
                          <Badge key={idx} variant='outline'>
                            {symptom}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {patient.prior_ailments && (
                    <div>
                      <p className='text-muted-foreground'>Prior Ailments</p>
                      <p className='font-medium'>{patient.prior_ailments}</p>
                    </div>
                  )}
                  {patient.doctors_notes && (
                    <div>
                      <p className='text-muted-foreground'>Doctor's Notes</p>
                      <p className='font-medium'>{patient.doctors_notes}</p>
                    </div>
                  )}
                  {patient.doctors_visiting_time && (
                    <div>
                      <p className='text-muted-foreground'>Visiting Time</p>
                      <p className='font-medium'>
                        {patient.doctors_visiting_time}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className='animate-in fade-in-50 slide-in-from-right-4'>
            <CardHeader>
              <CardTitle>Admission Details</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4 text-sm'>
              <div>
                <p className='text-muted-foreground'>Admission Date</p>
                <p className='font-medium'>
                  {format(
                    new Date(patient.admission_date),
                    'MMM d, yyyy h:mm a'
                  )}
                </p>
              </div>
              {patient.discharge_date && (
                <div>
                  <p className='text-muted-foreground'>Discharge Date</p>
                  <p className='font-medium'>
                    {format(
                      new Date(patient.discharge_date),
                      'MMM d, yyyy h:mm a'
                    )}
                  </p>
                </div>
              )}
              <div>
                <p className='text-muted-foreground'>Created</p>
                <p className='font-medium'>
                  {format(new Date(patient.created_at), 'MMM d, yyyy')}
                </p>
              </div>
              <div>
                <p className='text-muted-foreground'>Last Updated</p>
                <p className='font-medium'>
                  {format(new Date(patient.updated_at), 'MMM d, yyyy h:mm a')}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
