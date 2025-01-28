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
import { Trash } from 'lucide-react';
import { useState } from 'react';
import { useServerAction } from 'zsa-react';
import { cn } from '@/lib/utils';
import { deleteServiceAction } from '../actions';

export default function DeleteServiceButton() {
  const serviceId = useServiceIdParam();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const { execute, isPending } = useServerAction(deleteServiceAction, {
    onSuccess() {
      toast({
        title: 'Success',
        description: 'You deleted this service.',
        duration: 2000
      });
      setIsOpen(false);
    },
    onError() {
      toast({
        title: 'Uh oh',
        variant: 'destructive',
        description: 'Something went wrong deleting your service.',
        duration: 2000
      });
    }
  });

  return (
    <AlertDialog
      open={isOpen}
      onOpenChange={open => {
        // Prevent closing dialog while delete is in progress
        if (!isPending) {
          setIsOpen(open);
        }
      }}
    >
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
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <LoaderButton
            variant="destructive"
            isLoading={isPending}
            onClick={() => {
              if (!isPending) {
                execute({ serviceId });
              }
            }}
          >
            Delete Service
          </LoaderButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
