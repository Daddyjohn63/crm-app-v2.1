'use client';

import { useServiceIdParam } from '@/util/safeparam';
import { LoaderButton } from '@/components/loader-button';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { btnIconStyles, btnStyles } from '@/styles/icons';
import { DoorOpen, Trash } from 'lucide-react';
import { useState } from 'react';
import { useServerAction } from 'zsa-react';
import { cn } from '@/lib/utils';
import { useClientIdParam } from '@/util/safeparam';
import { deleteServiceAction } from '../actions';

export default function DeleteServiceButton() {
  const serviceId = useServiceIdParam();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const { execute, isPending } = useServerAction(deleteServiceAction, {
    onSuccess() {
      toast({
        title: 'Success',
        description: 'You deleted this service.'
      });
    },
    onError() {
      toast({
        title: 'Uh oh',
        variant: 'destructive',
        description: 'Something went wrong deleting your service.'
      });
    }
  });

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant={'destructive'} className={cn(btnStyles, 'w-fit')}>
          <Trash className={btnIconStyles} /> Delete Service
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Service</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this service?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <LoaderButton
            isLoading={isPending}
            onClick={() => {
              execute({ serviceId });
            }}
          >
            Delete Service
          </LoaderButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
