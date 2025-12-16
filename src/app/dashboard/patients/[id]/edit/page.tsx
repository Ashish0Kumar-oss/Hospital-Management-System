import PageContainer from '@/components/layout/page-container';
import PatientForm from '@/features/hospital/components/patient-form';
import { getPatient, getBeds, getDoctors } from '@/lib/db';
import { notFound } from 'next/navigation';

export default async function EditPatientPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const patient = await getPatient(id);
  const beds = await getBeds();
  const doctors = await getDoctors();

  if (!patient) {
    notFound();
  }

  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-6'>
        <PatientForm initialData={patient} beds={beds} doctors={doctors} />
      </div>
    </PageContainer>
  );
}
