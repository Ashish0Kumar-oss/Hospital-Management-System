'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { FormInput } from '@/components/forms/form-input';
import { FormSelect, type FormOption } from '@/components/forms/form-select';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Bed, BedType } from '@/types/hospital';
import { useState } from 'react';

const bedFormSchema = z.object({
  bed_number: z.string().min(1, 'Bed number is required'),
  room_number: z.string().optional(),
  bed_type: z.enum(['General', 'ICU', 'Private', 'Semi-Private', 'Emergency'])
});

type BedFormData = z.infer<typeof bedFormSchema>;

const bedTypeOptions: FormOption[] = [
  { value: 'General', label: 'General Ward' },
  { value: 'ICU', label: 'Intensive Care Unit' },
  { value: 'Private', label: 'Private Room' },
  { value: 'Semi-Private', label: 'Semi-Private Room' },
  { value: 'Emergency', label: 'Emergency Ward' }
];

interface BedFormProps {
  initialData?: Bed | null;
}

export default function BedForm({ initialData }: BedFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<BedFormData>({
    resolver: zodResolver(bedFormSchema),
    defaultValues: {
      bed_number: initialData?.bed_number || '',
      room_number: initialData?.room_number || '',
      bed_type: (initialData?.bed_type as BedType) || 'General'
    }
  });

  const onSubmit = async (data: BedFormData) => {
    setIsSubmitting(true);
    try {
      const url = initialData ? `/api/beds/${initialData.id}` : '/api/beds';
      const method = initialData ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          room_number: data.room_number || undefined,
          occupied: initialData?.occupied || false,
          is_active: true
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save bed');
      }

      toast.success(
        initialData ? 'Bed updated successfully' : 'Bed created successfully'
      );
      router.push('/dashboard/beds');
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save bed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className='animate-in fade-in-50 duration-500'>
      <CardHeader>
        <CardTitle>{initialData ? 'Edit Bed' : 'Add New Bed'}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form
          {...form}
          onSubmit={form.handleSubmit(onSubmit)}
          className='space-y-6'
        >
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <FormInput
              control={form.control}
              name='bed_number'
              label='Bed Number'
              required
              placeholder='e.g., B001'
            />
            <FormInput
              control={form.control}
              name='room_number'
              label='Room Number'
              placeholder='e.g., R101'
            />
          </div>

          <FormSelect
            control={form.control}
            name='bed_type'
            label='Bed Type'
            required
            options={bedTypeOptions}
          />

          <div className='flex justify-end gap-4'>
            <Button
              type='button'
              variant='outline'
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type='submit' disabled={isSubmitting}>
              {isSubmitting
                ? 'Saving...'
                : initialData
                  ? 'Update Bed'
                  : 'Create Bed'}
            </Button>
          </div>
        </Form>
      </CardContent>
    </Card>
  );
}
