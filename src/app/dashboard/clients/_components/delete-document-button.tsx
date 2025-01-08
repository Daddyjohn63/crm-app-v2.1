'use client';
import { LoaderButton } from '@/components/loader-button';
import { Button } from '@/components/ui/button';
import { DoorOpen, Trash2Icon } from 'lucide-react';
import { useServerAction } from 'zsa-react';
//import { deleteDocumentAction } from './actions';
import { useToast } from '@/components/ui/use-toast';
import { deleteDocumentAction } from '../[clientId]/documents/actions';
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
import { useState } from 'react';
import { btnIconStyles, btnStyles } from '@/styles/icons';
import { cn } from '@/lib/utils';

interface DeleteDocumentButtonProps {
  clientId: number;
  documentId: string;
}

export function DeleteDocumentButton({
  clientId,
  documentId
}: DeleteDocumentButtonProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const { execute, isPending } = useServerAction(deleteDocumentAction, {
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Document deleted successfully'
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to delete document',
        variant: 'destructive'
      });
    }
  });

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant={'destructive'} className={cn(btnStyles, 'w-fit')}>
          <Trash2Icon className={btnIconStyles} /> Delete document
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Document</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this document?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <LoaderButton
            isLoading={isPending}
            onClick={() => {
              execute({ clientId, documentId });
            }}
          >
            Delete Document
          </LoaderButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

    // <Button
    //   variant="ghost"
    //   size="icon"
    //   onClick={() => execute({ clientId, documentId })}
    //   disabled={isPending}
    // >
    //   <Trash2Icon className="h-4 w-4 text-red-500" />
    // </Button>
  );
}
