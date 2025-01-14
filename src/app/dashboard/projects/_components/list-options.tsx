import { List } from '@/db/schema';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Plus, X, Copy, Trash2 } from 'lucide-react';
import { PopoverClose } from '@radix-ui/react-popover';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { useState } from 'react';

interface ListOptionsProps {
  onAddCard: () => void;
  onCopyList: () => void;
  onDeleteList: () => void;
  data: List;
}

export const ListOptions = ({
  onAddCard,
  onCopyList,
  onDeleteList,
  data
}: ListOptionsProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className="h-auto w-auto p-2 hover:bg-transparent"
          >
            <MoreHorizontal className="h-4 w-4 text-slate-800" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="px-0 pt-3 pb-3 bg-[#f1f2f4]"
          side="bottom"
          align="start"
        >
          <div className="text-sm font-medium text-center text-neutral-600 pb-4">
            List Actions
          </div>
          <PopoverClose asChild>
            <Button
              variant="ghost"
              className="h-auto w-auto p- absolute top-2 right-2 text-neutral-600 hover:bg-transparent"
            >
              <X className="h-4 w-4 " />
            </Button>
          </PopoverClose>
          <Button
            onClick={onAddCard}
            className="rounded-none text-black w-full h-auto p-2 px-5 justify-start font-normal text-sm"
            variant="ghost"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Card...
          </Button>
          <Button
            onClick={onCopyList}
            className="rounded-none text-black w-full h-auto p-2 px-5 justify-start font-normal text-sm"
            variant="ghost"
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy List...
          </Button>
          <Button
            onClick={() => setShowDeleteDialog(true)}
            className="rounded-none text-red-600 w-full h-auto p-2 px-5 justify-start font-normal text-sm hover:text-red-600 hover:bg-red-100"
            variant="ghost"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete List...
          </Button>
        </PopoverContent>
      </Popover>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete List</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this list? This action cannot be
              undone and all cards in this list will be deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={() => {
                onDeleteList();
                setShowDeleteDialog(false);
              }}
            >
              Delete List
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
