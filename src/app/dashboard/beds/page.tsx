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
import { getBeds } from '@/lib/db';
import { Plus, Edit, Trash2, Bed } from 'lucide-react';
import Link from 'next/link';
import DeleteBedButton from '@/features/hospital/components/delete-bed-button';

export default async function BedsPage() {
  const beds = await getBeds();

  const bedStats = beds.reduce(
    (acc, bed) => {
      if (!acc[bed.bed_type]) {
        acc[bed.bed_type] = { total: 0, occupied: 0, available: 0 };
      }
      acc[bed.bed_type].total++;
      if (bed.occupied) {
        acc[bed.bed_type].occupied++;
      } else {
        acc[bed.bed_type].available++;
      }
      return acc;
    },
    {} as Record<string, { total: number; occupied: number; available: number }>
  );

  return (
    <PageContainer>
      <div className='animate-in fade-in-50 flex flex-1 flex-col space-y-6 duration-500'>
        <div className='flex items-center justify-between'>
          <div>
            <h2 className='text-3xl font-bold tracking-tight'>Beds</h2>
            <p className='text-muted-foreground'>
              Manage all hospital beds and availability
            </p>
          </div>
          <Link href='/dashboard/beds/new'>
            <Button className='animate-in fade-in-50 slide-in-from-right-4'>
              <Plus className='mr-2 h-4 w-4' />
              Add Bed
            </Button>
          </Link>
        </div>

        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5'>
          {Object.entries(bedStats).map(([type, stats]) => (
            <Card
              key={type}
              className='animate-in fade-in-50 slide-in-from-bottom-4'
            >
              <CardHeader>
                <CardTitle className='text-lg'>{type}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-2'>
                  <div className='text-2xl font-bold'>{stats.total}</div>
                  <div className='text-muted-foreground text-sm'>
                    <div>Available: {stats.available}</div>
                    <div>Occupied: {stats.occupied}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className='animate-in fade-in-50 slide-in-from-bottom-4'>
          <CardHeader>
            <CardTitle>All Beds</CardTitle>
            <CardDescription>
              {beds.length} {beds.length === 1 ? 'bed' : 'beds'} in the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            {beds.length === 0 ? (
              <div className='py-12 text-center'>
                <p className='text-muted-foreground mb-4'>No beds found</p>
                <Link href='/dashboard/beds/new'>
                  <Button>
                    <Plus className='mr-2 h-4 w-4' />
                    Add First Bed
                  </Button>
                </Link>
              </div>
            ) : (
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
                {beds.map((bed, index) => (
                  <Card
                    key={bed.id}
                    className={`animate-in fade-in-50 slide-in-from-bottom-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${
                      bed.occupied
                        ? 'border-red-200 dark:border-red-900'
                        : 'border-green-200 dark:border-green-900'
                    }`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <CardHeader>
                      <div className='flex items-start justify-between'>
                        <div className='flex items-center gap-2'>
                          <Bed className='text-primary h-5 w-5' />
                          <CardTitle className='text-lg'>
                            {bed.bed_number}
                          </CardTitle>
                        </div>
                        <Badge
                          variant={bed.occupied ? 'destructive' : 'default'}
                        >
                          {bed.occupied ? 'Occupied' : 'Available'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className='space-y-3'>
                      <div className='space-y-1 text-sm'>
                        <div>
                          <span className='text-muted-foreground'>Type:</span>{' '}
                          <span className='font-medium'>{bed.bed_type}</span>
                        </div>
                        {bed.room_number && (
                          <div>
                            <span className='text-muted-foreground'>Room:</span>{' '}
                            <span className='font-medium'>
                              {bed.room_number}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className='flex gap-2 pt-2'>
                        <Link
                          href={`/dashboard/beds/${bed.id}/edit`}
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
                        <DeleteBedButton
                          bedId={bed.id}
                          bedNumber={bed.bed_number}
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
