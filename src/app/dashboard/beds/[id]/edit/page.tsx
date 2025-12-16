import PageContainer from '@/components/layout/page-container';
import BedForm from '@/features/hospital/components/bed-form';
import { getBed } from '@/lib/db';
import { notFound } from 'next/navigation';

export default async function EditBedPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const bed = await getBed(id);

  if (!bed) {
    notFound();
  }

  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-6'>
        <BedForm initialData={bed} />
      </div>
    </PageContainer>
  );
}
