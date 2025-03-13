'use client';
import { useState, useRef, ElementRef, useEffect } from 'react';
import { List } from '@/db/schema';
import { useEventListener, useOnClickOutside } from 'usehooks-ts';
import { LoaderButton } from '@/components/loader-button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useServerAction } from 'zsa-react';
import { useBoardStore } from '@/store/boardStore';
import { updateListAction, copyListAction, deleteListAction } from '../actions';
import { ListOptions } from './list-options';
import { useCardDialogStore } from '@/store/cardDialogStore';
import { ListWithCards } from '@/use-cases/types';

const formSchema = z.object({
  name: z.string().min(1, 'A List Name is required'),
  boardId: z.number()
});

interface ListHeaderProps {
  //onAddCard: () => void;
  data: ListWithCards;
  canUseListForm: boolean;
}

export const ListHeader = ({
  // onAddCard,
  data,
  canUseListForm
}: ListHeaderProps) => {
  //console.log('data from list header', data);
  const { toast } = useToast();
  const currentBoardId = useBoardStore(state => state.currentBoardId);
  // Get the card dialog controls from Zustand store
  const { setIsOpen, setBoardId } = useCardDialogStore();

  //console.log('currentBoardId', currentBoardId);
  const [title, setTitle] = useState(data.name);
  const [isEditing, setIsEditing] = useState(false);

  const formRef = useRef<ElementRef<'form'>>(null);
  const inputRef = useRef<ElementRef<'input'>>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: data.name,
      boardId: currentBoardId || 0
    }
  });

  const onSubmit = form.handleSubmit(async values => {
    if (!currentBoardId) {
      toast({
        title: 'Error',
        description: 'No project selected. Please select a project first.',
        variant: 'destructive'
      });
      return;
    }

    try {
      await executeUpdate({
        listId: data.id,
        name: values.name,
        boardId: currentBoardId
      });
      setTitle(values.name);
    } catch (error) {
      console.error('Error updating list:', error);
      toast({
        title: 'Error',
        description: 'Failed to update list. Please try again.',
        variant: 'destructive'
      });
    }
  });

  useEffect(() => {
    if (currentBoardId) {
      form.setValue('boardId', currentBoardId);
    }
  }, [currentBoardId, form]);

  const enableEditing = () => {
    if (!canUseListForm) {
      toast({
        title: 'Permission Denied',
        description: "You don't have permission to edit this list.",
        variant: 'destructive'
      });
      return;
    }

    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    }, 0);
  };

  const disableEditing = () => {
    setIsEditing(false);
    form.reset();
  };

  const onBlur = () => {
    formRef.current?.requestSubmit();
    form.reset();
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      formRef.current?.requestSubmit();
      form.reset();
    }
  };

  useEventListener('keydown', onKeyDown);

  const { execute: executeUpdate, isPending: isUpdatePending } =
    useServerAction(updateListAction, {
      onSuccess() {
        toast({
          title: 'List updated',
          description: 'The list has been updated successfully.',
          duration: 3000
        });
        setIsEditing(false);
      },
      onError() {
        toast({
          title: 'Something went wrong',
          variant: 'destructive',
          description: 'Something went wrong updating the list.',
          duration: 3000
        });
      }
    });

  const { execute: executeCopy, isPending: isCopyPending } = useServerAction(
    copyListAction,
    {
      onSuccess() {
        toast({
          title: 'List copied',
          description: 'The list has been copied successfully.',
          duration: 3000
        });
      },
      onError() {
        toast({
          title: 'Something went wrong',
          variant: 'destructive',
          description: 'Something went wrong copying the list.',
          duration: 3000
        });
      }
    }
  );

  const { execute: executeDelete, isPending: isDeletePending } =
    useServerAction(deleteListAction, {
      onSuccess() {
        toast({
          title: 'List deleted',
          description: 'The list has been deleted successfully.',
          duration: 3000
        });
      },
      onError() {
        toast({
          title: 'Something went wrong',
          variant: 'destructive',
          description: 'Something went wrong deleting the list.',
          duration: 3000
        });
      }
    });

  const onCopyList = async () => {
    if (!currentBoardId) {
      toast({
        title: 'Error',
        description: 'No project selected. Please select a project first.',
        variant: 'destructive'
      });
      return;
    }

    try {
      await executeCopy({
        listId: data.id,
        boardId: currentBoardId
      });
    } catch (error) {
      console.error('Error copying list:', error);
    }
  };

  const onDeleteList = async () => {
    if (!currentBoardId) {
      toast({
        title: 'Error',
        description: 'No project selected. Please select a project first.',
        variant: 'destructive'
      });
      return;
    }

    try {
      await executeDelete({
        listId: data.id,
        boardId: currentBoardId
      });
    } catch (error) {
      console.error('Error deleting list:', error);
    }
  };

  const onAddCard = () => {
    if (!currentBoardId) {
      toast({
        title: 'Error',
        description: 'No project selected. Please select a project first.',
        variant: 'destructive'
      });
      return;
    }

    // Set the IDs in the card dialog store and the card dialog is opened. making sure we have the ids before opening the dialog.
    //setListId(data.id);
    setBoardId(currentBoardId);
    setIsOpen(true);
  };

  return (
    <div className="px-3 py-8 text-sm font-semibold flex justify-between items-center h-9 w-full">
      {isEditing ? (
        <Form {...form}>
          <form ref={formRef} onSubmit={onSubmit} className="w-full ">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <FormControl>
                    <Input
                      className="text-sm text-black h-9 border-transparent font-medium hover:border-input focus:border-input transition w-full rounded-md bg-[#f1f2f4] focus-visible:outline-none focus-visible:ring-offset-0 focus-visible:ring-0"
                      placeholder="Add a List Name"
                      {...field}
                      onBlur={onBlur}
                      onFocus={() => setIsEditing(true)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      ) : (
        <div
          onClick={enableEditing}
          className={`w-full text-black text-sm font-medium ${
            canUseListForm ? 'cursor-pointer' : 'cursor-not-allowed'
          } flex items-center h-full`}
        >
          {title}
        </div>
      )}
      {canUseListForm && (
        <ListOptions
          onAddCard={onAddCard}
          onCopyList={onCopyList}
          onDeleteList={onDeleteList}
          data={data}
          isCopyPending={isCopyPending}
        />
      )}
    </div>
  );
};
