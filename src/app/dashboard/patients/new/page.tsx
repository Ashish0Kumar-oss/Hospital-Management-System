import PageContainer from '@/components/layout/page-container';
import PatientForm from '@/features/hospital/components/patient-form';
import { getAvailableBeds, getDoctors } from '@/lib/db';

export default async function NewPatientPage() {
  const beds = await getAvailableBeds();
  const doctors = await getDoctors();

  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-6'>
        <PatientForm beds={beds} doctors={doctors} />
      </div>
    </PageContainer>
  );
}
