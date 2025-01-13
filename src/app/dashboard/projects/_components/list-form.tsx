'use client';
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
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useBoardStore } from '@/store/boardStore';
import { createListAction } from '../actions';

const formSchema = z.object({
  name: z.string().min(1, 'A List Name is required'),
  boardId: z.number()
});

export const ListForm = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const currentBoardId = useBoardStore(state => state.currentBoardId);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      boardId: currentBoardId || 0
    }
  });

  useEffect(() => {
    if (currentBoardId) {
      form.setValue('boardId', currentBoardId);
    }
  }, [currentBoardId, form]);

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
        ...values,
        boardId: currentBoardId
      });
      form.reset({
        name: '',
        boardId: currentBoardId
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error creating list:', error);
      toast({
        title: 'Error',
        description: 'Failed to create list. Please try again.',
        variant: 'destructive'
      });
    }
  });

  useOnClickOutside(formRef, () => {
    setIsEditing(false);
    form.reset();
  });

  useEventListener('keydown', e => {
    if (e.key === 'Escape') {
      setIsEditing(false);
      form.reset();
    }
  });

  const { execute, isPending } = useServerAction(createListAction, {
    onSuccess() {
      toast({
        title: 'List created',
        description: 'The list has been created successfully.',
        duration: 3000
      });
    },
    onError() {
      toast({
        title: 'Something went wrong',
        variant: 'destructive',
        description: 'Something went wrong creating the list.',
        duration: 3000
      });
    }
  });

  if (!currentBoardId) {
    return null;
  }

  return (
    <li className="shrink-0 h-full w-[272px] select-none">
      <div className="w-full rounded-md bg-[#f1f2f4] shadow-md pb-2">
        <Form {...form}>
          <form ref={formRef} onSubmit={onSubmit} className="pt-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="px-2 space-y-0">
                  <FormLabel></FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Plus className="h-8 w-8 absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                      <Input
                        className="text-sm text-black h-7 border-transparent font-medium hover:border-input focus:border-input transition w-full rounded-md bg-[#f1f2f4] pl-12 focus-visible:outline-none focus-visible:ring-offset-0 focus-visible:ring-0"
                        placeholder="Add a List Name"
                        {...field}
                        onFocus={() => setIsEditing(true)}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {isEditing && (
              <div className="flex items-center gap-x-1 px-2 mt-1">
                <LoaderButton className="w-full" isLoading={isPending}>
                  Add list
                </LoaderButton>
                <Button
                  onClick={() => {
                    setIsEditing(false);
                    form.reset();
                  }}
                  size="sm"
                  // variant="ghost"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            )}
          </form>
        </Form>
      </div>
    </li>
  );
};
