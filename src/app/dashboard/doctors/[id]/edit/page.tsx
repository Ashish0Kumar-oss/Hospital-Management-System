import PageContainer from '@/components/layout/page-container';
import DoctorForm from '@/features/hospital/components/doctor-form';
import { getDoctor } from '@/lib/db';
import { notFound } from 'next/navigation';

export default async function EditDoctorPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const doctor = await getDoctor(id);

  if (!doctor) {
    notFound();
  }

  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-6'>
        <DoctorForm initialData={doctor} />
      </div>
    </PageContainer>
  );
}
