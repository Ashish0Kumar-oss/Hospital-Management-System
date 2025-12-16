'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { UserCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface DischargePatientButtonProps {
  patientId: string;
  patientName: string;
}

export default function DischargePatientButton({
  patientId,
  patientName
}: DischargePatientButtonProps) {
  const router = useRouter();
  const [isDischarging, setIsDischarging] = useState(false);
  const [open, setOpen] = useState(false);

  const handleDischarge = async () => {
    setIsDischarging(true);
    try {
      const response = await fetch(`/api/patients/${patientId}/discharge`, {
        method: 'POST'
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to discharge patient');
      }

      toast.success('Patient discharged successfully');
      router.push('/dashboard/patients');
      router.refresh();
      setOpen(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to discharge patient');
    } finally {
      setIsDischarging(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant='default'>
          <UserCheck className='mr-2 h-4 w-4' />
          Discharge Patient
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Discharge Patient?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to discharge {patientName}? This will free up
            their bed and mark them as discharged.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDischarging}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDischarge} disabled={isDischarging}>
            {isDischarging ? 'Discharging...' : 'Discharge'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
