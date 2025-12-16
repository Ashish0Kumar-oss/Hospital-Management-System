import PageContainer from '@/components/layout/page-container';
import BedForm from '@/features/hospital/components/bed-form';

export default async function NewBedPage() {
  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-6'>
        <BedForm />
      </div>
    </PageContainer>
  );
}
