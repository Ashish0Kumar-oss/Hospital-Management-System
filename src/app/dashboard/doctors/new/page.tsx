import PageContainer from '@/components/layout/page-container';
import DoctorForm from '@/features/hospital/components/doctor-form';

export default async function NewDoctorPage() {
  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-6'>
        <DoctorForm />
      </div>
    </PageContainer>
  );
}
