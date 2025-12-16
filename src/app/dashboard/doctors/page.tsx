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
import { getDoctors } from '@/lib/db';
import { Plus, Edit, Trash2, Stethoscope } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import DeleteDoctorButton from '@/features/hospital/components/delete-doctor-button';

export default async function DoctorsPage() {
  const doctors = await getDoctors();

  return (
    <PageContainer>
      <div className='animate-in fade-in-50 flex flex-1 flex-col space-y-6 duration-500'>
        <div className='flex items-center justify-between'>
          <div>
            <h2 className='text-3xl font-bold tracking-tight'>Doctors</h2>
            <p className='text-muted-foreground'>
              Manage all doctors and medical staff
            </p>
          </div>
          <Link href='/dashboard/doctors/new'>
            <Button className='animate-in fade-in-50 slide-in-from-right-4'>
              <Plus className='mr-2 h-4 w-4' />
              Add Doctor
            </Button>
          </Link>
        </div>

        <Card className='animate-in fade-in-50 slide-in-from-bottom-4'>
          <CardHeader>
            <CardTitle>All Doctors</CardTitle>
            <CardDescription>
              {doctors.length} {doctors.length === 1 ? 'doctor' : 'doctors'} in
              the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            {doctors.length === 0 ? (
              <div className='py-12 text-center'>
                <p className='text-muted-foreground mb-4'>No doctors found</p>
                <Link href='/dashboard/doctors/new'>
                  <Button>
                    <Plus className='mr-2 h-4 w-4' />
                    Add First Doctor
                  </Button>
                </Link>
              </div>
            ) : (
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
                {doctors.map((doctor, index) => (
                  <Card
                    key={doctor.id}
                    className='animate-in fade-in-50 slide-in-from-bottom-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg'
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <CardHeader>
                      <div className='flex items-start justify-between'>
                        <div className='flex items-center gap-2'>
                          <Stethoscope className='text-primary h-5 w-5' />
                          <CardTitle className='text-lg'>
                            {doctor.name}
                          </CardTitle>
                        </div>
                        <Badge variant='outline'>{doctor.specialization}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className='space-y-3'>
                      <div className='space-y-1 text-sm'>
                        {doctor.phone && (
                          <div>
                            <span className='text-muted-foreground'>
                              Phone:
                            </span>{' '}
                            <span className='font-medium'>{doctor.phone}</span>
                          </div>
                        )}
                        {doctor.email && (
                          <div>
                            <span className='text-muted-foreground'>
                              Email:
                            </span>{' '}
                            <span className='font-medium'>{doctor.email}</span>
                          </div>
                        )}
                        <div>
                          <span className='text-muted-foreground'>
                            Patients:
                          </span>{' '}
                          <span className='font-medium'>
                            {doctor.patient_count || 0}
                          </span>
                        </div>
                      </div>
                      <div className='flex gap-2 pt-2'>
                        <Link
                          href={`/dashboard/doctors/${doctor.id}/edit`}
                          className='flex-1'
                        >
                          <Button
                            variant='outline'
                            size='sm'
                            className='w-full'
                          >
                            <Edit className='mr-2 h-4 w-4' />
                            Edit
                          </Button>
                        </Link>
                        <DeleteDoctorButton
                          doctorId={doctor.id}
                          doctorName={doctor.name}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
