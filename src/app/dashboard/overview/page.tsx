import PageContainer from '@/components/layout/page-container';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getDashboardStats } from '@/lib/db';
import {
  Users,
  UserCheck,
  Bed,
  Stethoscope,
  Activity,
  TrendingUp
} from 'lucide-react';
import { format } from 'date-fns';

export default async function DashboardOverview() {
  const stats = await getDashboardStats();

  const statCards = [
    {
      title: 'Total Patients',
      value: stats.total_patients,
      description: 'Active patients in system',
      icon: Users,
      trend: '+12%',
      trendUp: true
    },
    {
      title: 'Admitted',
      value: stats.admitted_count,
      description: 'Currently admitted',
      icon: Activity,
      trend: '+5%',
      trendUp: true
    },
    {
      title: 'Recovered',
      value: stats.recovered_count,
      description: 'Successfully recovered',
      icon: UserCheck,
      trend: '+8%',
      trendUp: true
    },
    {
      title: 'Available Beds',
      value: stats.beds_available,
      description: `of ${stats.total_beds} total beds`,
      icon: Bed,
      trend: `${Math.round((stats.beds_available / stats.total_beds) * 100)}%`,
      trendUp: true
    },
    {
      title: 'Total Doctors',
      value: stats.total_doctors,
      description: 'Active medical staff',
      icon: Stethoscope,
      trend: 'Active',
      trendUp: true
    },
    {
      title: 'Deceased',
      value: stats.deceased_count,
      description: 'Requires attention',
      icon: Activity,
      trend: '0%',
      trendUp: false
    }
  ];

  return (
    <PageContainer>
      <div className='animate-in fade-in-50 flex flex-1 flex-col space-y-6 duration-500'>
        <div className='flex items-center justify-between'>
          <div>
            <h2 className='text-3xl font-bold tracking-tight'>
              Hospital Dashboard
            </h2>
            <p className='text-muted-foreground'>
              Welcome back! Here's what's happening at your hospital today.
            </p>
          </div>
          <div className='text-muted-foreground text-sm'>
            {format(new Date(), 'EEEE, MMMM d, yyyy')}
          </div>
        </div>

        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card
                key={stat.title}
                className='animate-in fade-in-50 slide-in-from-bottom-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg'
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    {stat.title}
                  </CardTitle>
                  <Icon className='text-muted-foreground h-4 w-4' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>{stat.value}</div>
                  <p className='text-muted-foreground mt-1 text-xs'>
                    {stat.description}
                  </p>
                  <div className='mt-2'>
                    <Badge
                      variant={stat.trendUp ? 'default' : 'secondary'}
                      className='text-xs'
                    >
                      {stat.trendUp && <TrendingUp className='mr-1 h-3 w-3' />}
                      {stat.trend}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          <Card className='animate-in fade-in-50 slide-in-from-left-4 duration-500'>
            <CardHeader>
              <CardTitle>Bed Availability by Type</CardTitle>
              <CardDescription>Current bed occupancy status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {Object.entries(stats.bed_stats).map(([type, stats]) => {
                  const percentage =
                    stats.total > 0 ? (stats.occupied / stats.total) * 100 : 0;
                  return (
                    <div key={type} className='space-y-2'>
                      <div className='flex justify-between text-sm'>
                        <span className='font-medium'>{type}</span>
                        <span className='text-muted-foreground'>
                          {stats.occupied}/{stats.total} occupied
                        </span>
                      </div>
                      <div className='bg-secondary h-2 w-full rounded-full'>
                        <div
                          className='bg-primary h-2 rounded-full transition-all duration-500'
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <div className='text-muted-foreground flex justify-between text-xs'>
                        <span>{stats.available} available</span>
                        <span>{Math.round(percentage)}% occupied</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card className='animate-in fade-in-50 slide-in-from-right-4 duration-500'>
            <CardHeader>
              <CardTitle>Quick Statistics</CardTitle>
              <CardDescription>Key metrics at a glance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <div className='bg-muted/50 flex items-center justify-between rounded-lg p-3'>
                  <div>
                    <p className='text-sm font-medium'>Bed Occupancy Rate</p>
                    <p className='text-muted-foreground text-xs'>
                      {stats.total_beds - stats.beds_available} of{' '}
                      {stats.total_beds} beds
                    </p>
                  </div>
                  <div className='text-2xl font-bold'>
                    {Math.round(
                      ((stats.total_beds - stats.beds_available) /
                        stats.total_beds) *
                        100
                    )}
                    %
                  </div>
                </div>
                <div className='bg-muted/50 flex items-center justify-between rounded-lg p-3'>
                  <div>
                    <p className='text-sm font-medium'>Recovery Rate</p>
                    <p className='text-muted-foreground text-xs'>
                      Patients successfully recovered
                    </p>
                  </div>
                  <div className='text-2xl font-bold text-green-600'>
                    {stats.total_patients > 0
                      ? Math.round(
                          (stats.recovered_count / stats.total_patients) * 100
                        )
                      : 0}
                    %
                  </div>
                </div>
                <div className='bg-muted/50 flex items-center justify-between rounded-lg p-3'>
                  <div>
                    <p className='text-sm font-medium'>
                      Doctor to Patient Ratio
                    </p>
                    <p className='text-muted-foreground text-xs'>
                      Average patients per doctor
                    </p>
                  </div>
                  <div className='text-2xl font-bold'>
                    {stats.total_doctors > 0
                      ? (stats.admitted_count / stats.total_doctors).toFixed(1)
                      : 0}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
