'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { FormInput } from '@/components/forms/form-input';
import { FormTextarea } from '@/components/forms/form-textarea';
import { FormSelect, type FormOption } from '@/components/forms/form-select';
import {
  FormCheckboxGroup,
  type CheckboxGroupOption
} from '@/components/forms/form-checkbox-group';
import { FormDatePicker } from '@/components/forms/form-date-picker';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Patient, Symptom, PatientStatus, BedType } from '@/types/hospital';
import { useState } from 'react';

const patientFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone_num: z.string().min(10, 'Phone number must be at least 10 characters'),
  patient_relative_name: z.string().optional(),
  patient_relative_contact: z.string().optional(),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  symptoms: z.array(z.string()).optional(),
  prior_ailments: z.string().optional(),
  bed_id: z.string().min(1, 'Please select a bed'),
  dob: z.date().optional(),
  doctor_id: z.string().optional(),
  doctors_notes: z.string().optional(),
  doctors_visiting_time: z.string().optional(),
  status: z.enum(['Admitted', 'Recovered', 'Discharged', 'Deceased'])
});

type PatientFormData = z.infer<typeof patientFormSchema>;

const symptomOptions: CheckboxGroupOption[] = [
  { value: 'Fever', label: 'Fever' },
  { value: 'Dry cough', label: 'Dry cough' },
  { value: 'Tiredness', label: 'Tiredness' },
  { value: 'Aches and pains', label: 'Aches and pains' },
  { value: 'Sore throat', label: 'Sore throat' },
  { value: 'Diarrhoea', label: 'Diarrhoea' },
  { value: 'Loss of taste or smell', label: 'Loss of taste or smell' },
  {
    value: 'Difficulty in breathing or shortness of breath',
    label: 'Difficulty in breathing'
  },
  { value: 'Chest pain or pressure', label: 'Chest pain or pressure' },
  { value: 'Loss of speech or movement', label: 'Loss of speech or movement' }
];

const statusOptions: FormOption[] = [
  { value: 'Admitted', label: 'Admitted' },
  { value: 'Recovered', label: 'Recovered' },
  { value: 'Discharged', label: 'Discharged' },
  { value: 'Deceased', label: 'Deceased' }
];

interface PatientFormProps {
  initialData?: Patient | null;
  beds: Array<{
    id: string;
    bed_number: string;
    bed_type: BedType;
    room_number?: string;
  }>;
  doctors: Array<{ id: string; name: string; specialization: string }>;
}

export default function PatientForm({
  initialData,
  beds,
  doctors
}: PatientFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const bedOptions: FormOption[] = beds.map((bed) => ({
    value: bed.id,
    label: `${bed.bed_number} (${bed.bed_type}${bed.room_number ? ` - ${bed.room_number}` : ''})`
  }));

  const doctorOptions: FormOption[] = doctors.map((doctor) => ({
    value: doctor.id,
    label: `${doctor.name} (${doctor.specialization})`
  }));

  const form = useForm<PatientFormData>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: {
      name: initialData?.name || '',
      phone_num: initialData?.phone_num || '',
      patient_relative_name: initialData?.patient_relative_name || '',
      patient_relative_contact: initialData?.patient_relative_contact || '',
      address: initialData?.address || '',
      symptoms: initialData?.symptoms || [],
      prior_ailments: initialData?.prior_ailments || '',
      bed_id: initialData?.bed_id || '',
      dob: initialData?.dob ? new Date(initialData.dob) : undefined,
      doctor_id: initialData?.doctor_id || '',
      doctors_notes: initialData?.doctors_notes || '',
      doctors_visiting_time: initialData?.doctors_visiting_time || '',
      status: (initialData?.status as PatientStatus) || 'Admitted'
    }
  });

  const onSubmit = async (data: PatientFormData) => {
    setIsSubmitting(true);
    try {
      const url = initialData
        ? `/api/patients/${initialData.id}`
        : '/api/patients';
      const method = initialData ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          dob: data.dob ? data.dob.toISOString().split('T')[0] : undefined
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save patient');
      }

      toast.success(
        initialData
          ? 'Patient updated successfully'
          : 'Patient created successfully'
      );
      router.push('/dashboard/patients');
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save patient');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className='animate-in fade-in-50 duration-500'>
      <CardHeader>
        <CardTitle>
          {initialData ? 'Edit Patient' : 'Add New Patient'}
        </CardTitle>
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
              name='name'
              label='Patient Name'
              required
              placeholder='Enter patient name'
            />
            <FormInput
              control={form.control}
              name='phone_num'
              label='Phone Number'
              required
              type='tel'
              placeholder='Enter phone number'
            />
          </div>

          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <FormInput
              control={form.control}
              name='patient_relative_name'
              label='Relative Name'
              placeholder='Enter relative name'
            />
            <FormInput
              control={form.control}
              name='patient_relative_contact'
              label='Relative Contact'
              type='tel'
              placeholder='Enter relative contact'
            />
          </div>

          <FormTextarea
            control={form.control}
            name='address'
            label='Address'
            required
            placeholder='Enter patient address'
          />

          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <FormDatePicker
              control={form.control}
              name='dob'
              label='Date of Birth'
            />
            <FormSelect
              control={form.control}
              name='status'
              label='Status'
              required
              options={statusOptions}
            />
          </div>

          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <FormSelect
              control={form.control}
              name='bed_id'
              label='Bed'
              required
              options={bedOptions}
              placeholder='Select a bed'
            />
            <FormSelect
              control={form.control}
              name='doctor_id'
              label='Assigned Doctor'
              options={doctorOptions}
              placeholder='Select a doctor'
            />
          </div>

          <FormCheckboxGroup
            control={form.control}
            name='symptoms'
            label='Symptoms'
            options={symptomOptions}
          />

          <FormTextarea
            control={form.control}
            name='prior_ailments'
            label='Prior Ailments'
            placeholder='Enter prior medical conditions'
          />

          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <FormInput
              control={form.control}
              name='doctors_visiting_time'
              label='Doctor Visiting Time'
              placeholder='e.g., 10:00 AM - 11:00 AM'
            />
          </div>

          <FormTextarea
            control={form.control}
            name='doctors_notes'
            label="Doctor's Notes"
            placeholder='Enter doctor notes'
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
                  ? 'Update Patient'
                  : 'Create Patient'}
            </Button>
          </div>
        </Form>
      </CardContent>
    </Card>
  );
}
