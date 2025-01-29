'use client';
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
import { useToast } from '@/components/ui/use-toast';
import { Trash, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { deleteBoardAction } from '../actions';
import { useServerAction } from 'zsa-react';
import { Button } from '@/components/ui/button';

export default function DeleteBoardButton({ boardId }: { boardId: number }) {
  //console.log('DeleteCardButton - cardId:', cardId);
  // console.log('DeleteCardButton - boardId:', boardId);
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const { execute, isPending } = useServerAction(deleteBoardAction, {
    onSuccess() {
      toast({
        title: 'Success',
        description: 'You deleted this board.'
      });
    },
    onError() {
      toast({
        title: 'Uh oh',
        variant: 'destructive',
        description: 'Something went wrong deleting your board.'
      });
    }
  });

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        {/* <Trash className="w-4 h-4 text-red-500 cursor-pointer hover:text-red-700" /> */}
        <Button variant="destructive" className="flex items-center rounded-xl">
          <span>
            <Trash2 className="size-6 pr-2" />
          </span>
          Delete Board
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this board?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <LoaderButton
            isLoading={isPending}
            onClick={() => {
              execute({ boardId });
            }}
          >
            Delete Project
          </LoaderButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
