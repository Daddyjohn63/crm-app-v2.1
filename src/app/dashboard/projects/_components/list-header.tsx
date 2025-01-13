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
import { updateListAction } from '../actions';

const formSchema = z.object({
  name: z.string().min(1, 'A List Name is required'),
  boardId: z.number()
});

interface ListHeaderProps {
  data: List;
  canUseListForm: boolean;
}

export const ListHeader = ({ data, canUseListForm }: ListHeaderProps) => {
  console.log('data from list header', data);
  const { toast } = useToast();
  const currentBoardId = useBoardStore(state => state.currentBoardId);
  console.log('currentBoardId', currentBoardId);
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
      await execute({
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

  const { execute, isPending } = useServerAction(updateListAction, {
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

  return (
    <div className="px-2 text-sm font-semibold flex justify-between items-center h-9">
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
    </div>
  );
};
