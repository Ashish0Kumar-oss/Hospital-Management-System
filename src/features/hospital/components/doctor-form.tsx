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
import { Doctor, DoctorSpecialization } from '@/types/hospital';
import { useState } from 'react';

const doctorFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  specialization: z.enum([
    'General',
    'Cardiologist',
    'Neurologist',
    'Pediatrician',
    'Surgeon',
    'Orthopedic',
    'Dermatologist',
    'Psychiatrist',
    'Emergency',
    'Other'
  ]),
  phone: z.string().optional(),
  email: z.string().email('Invalid email address').optional().or(z.literal(''))
});

type DoctorFormData = z.infer<typeof doctorFormSchema>;

const specializationOptions: FormOption[] = [
  { value: 'General', label: 'General Physician' },
  { value: 'Cardiologist', label: 'Cardiologist' },
  { value: 'Neurologist', label: 'Neurologist' },
  { value: 'Pediatrician', label: 'Pediatrician' },
  { value: 'Surgeon', label: 'Surgeon' },
  { value: 'Orthopedic', label: 'Orthopedic' },
  { value: 'Dermatologist', label: 'Dermatologist' },
  { value: 'Psychiatrist', label: 'Psychiatrist' },
  { value: 'Emergency', label: 'Emergency Medicine' },
  { value: 'Other', label: 'Other' }
];

interface DoctorFormProps {
  initialData?: Doctor | null;
}

export default function DoctorForm({ initialData }: DoctorFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<DoctorFormData>({
    resolver: zodResolver(doctorFormSchema),
    defaultValues: {
      name: initialData?.name || '',
      specialization:
        (initialData?.specialization as DoctorSpecialization) || 'General',
      phone: initialData?.phone || '',
      email: initialData?.email || ''
    }
  });

  const onSubmit = async (data: DoctorFormData) => {
    setIsSubmitting(true);
    try {
      const url = initialData
        ? `/api/doctors/${initialData.id}`
        : '/api/doctors';
      const method = initialData ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          email: data.email || undefined,
          phone: data.phone || undefined
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save doctor');
      }

      toast.success(
        initialData
          ? 'Doctor updated successfully'
          : 'Doctor created successfully'
      );
      router.push('/dashboard/doctors');
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save doctor');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className='animate-in fade-in-50 duration-500'>
      <CardHeader>
        <CardTitle>{initialData ? 'Edit Doctor' : 'Add New Doctor'}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form
          {...form}
          onSubmit={form.handleSubmit(onSubmit)}
          className='space-y-6'
        >
          <FormInput
            control={form.control}
            name='name'
            label='Doctor Name'
            required
            placeholder='Enter doctor name'
          />

          <FormSelect
            control={form.control}
            name='specialization'
            label='Specialization'
            required
            options={specializationOptions}
          />

          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <FormInput
              control={form.control}
              name='phone'
              label='Phone Number'
              type='tel'
              placeholder='Enter phone number'
            />
            <FormInput
              control={form.control}
              name='email'
              label='Email'
              type='email'
              placeholder='Enter email address'
            />
          </div>

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
                  ? 'Update Doctor'
                  : 'Create Doctor'}
            </Button>
          </div>
        </Form>
      </CardContent>
    </Card>
  );
}
