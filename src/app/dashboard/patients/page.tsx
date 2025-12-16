import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getPatients, getBed, getDoctor } from '@/lib/db';
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { PatientStatus } from '@/types/hospital';

const statusColors: Record<PatientStatus, string> = {
  Admitted: 'bg-blue-500',
  Recovered: 'bg-green-500',
  Discharged: 'bg-gray-500',
  Deceased: 'bg-red-500'
};

export default async function PatientsPage() {
  const patients = await getPatients();

  // Fetch bed and doctor details for each patient
  const patientsWithDetails = await Promise.all(
    patients.map(async (patient) => {
      const bed = patient.bed_id ? await getBed(patient.bed_id) : null;
      const doctor = patient.doctor_id
        ? await getDoctor(patient.doctor_id)
        : null;
      return { ...patient, bed, doctor };
    })
  );

  return (
    <PageContainer>
      <div className='animate-in fade-in-50 flex flex-1 flex-col space-y-6 duration-500'>
        <div className='flex items-center justify-between'>
          <div>
            <h2 className='text-3xl font-bold tracking-tight'>Patients</h2>
            <p className='text-muted-foreground'>
              Manage all patient records and information
            </p>
          </div>
          <Link href='/dashboard/patients/new'>
            <Button className='animate-in fade-in-50 slide-in-from-right-4'>
              <Plus className='mr-2 h-4 w-4' />
              Add Patient
            </Button>
          </Link>
        </div>

        <Card className='animate-in fade-in-50 slide-in-from-bottom-4'>
          <CardHeader>
            <CardTitle>All Patients</CardTitle>
            <CardDescription>
              {patients.length} {patients.length === 1 ? 'patient' : 'patients'}{' '}
              in the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            {patients.length === 0 ? (
              <div className='py-12 text-center'>
                <p className='text-muted-foreground mb-4'>No patients found</p>
                <Link href='/dashboard/patients/new'>
                  <Button>
                    <Plus className='mr-2 h-4 w-4' />
                    Add First Patient
                  </Button>
                </Link>
              </div>
            ) : (
              <div className='space-y-4'>
                {patientsWithDetails.map((patient, index) => (
                  <div
                    key={patient.id}
                    className='hover:bg-muted/50 animate-in fade-in-50 slide-in-from-left-4 flex items-center justify-between rounded-lg border p-4 transition-all duration-200'
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className='flex-1'>
                      <div className='flex items-center gap-3'>
                        <h3 className='text-lg font-semibold'>
                          {patient.name}
                        </h3>
                        <Badge
                          className={`${statusColors[patient.status]} text-white`}
                        >
                          {patient.status}
                        </Badge>
                      </div>
                      <div className='text-muted-foreground mt-2 grid grid-cols-2 gap-4 text-sm md:grid-cols-4'>
                        <div>
                          <span className='font-medium'>Phone:</span>{' '}
                          {patient.phone_num}
                        </div>
                        <div>
                          <span className='font-medium'>Bed:</span>{' '}
                          {patient.bed?.bed_number || 'N/A'}
                        </div>
                        {patient.admission_date && (
                          <div>
                            <span className='font-medium'>Admitted:</span>{' '}
                            {format(
                              new Date(patient.admission_date),
                              'MMM d, yyyy'
                            )}
                          </div>
                        )}
                        {patient.doctor && (
                          <div>
                            <span className='font-medium'>Doctor:</span> Dr.{' '}
                            {patient.doctor.name}
                          </div>
                        )}
                      </div>
                      {patient.symptoms && patient.symptoms.length > 0 && (
                        <div className='mt-2 flex flex-wrap gap-2'>
                          {patient.symptoms.map((symptom, idx) => (
                            <Badge
                              key={idx}
                              variant='outline'
                              className='text-xs'
                            >
                              {symptom}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className='ml-4 flex items-center gap-2'>
                      <Link href={`/dashboard/patients/${patient.id}`}>
                        <Button variant='ghost' size='icon'>
                          <Eye className='h-4 w-4' />
                        </Button>
                      </Link>
                      <Link href={`/dashboard/patients/${patient.id}/edit`}>
                        <Button variant='ghost' size='icon'>
                          <Edit className='h-4 w-4' />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
