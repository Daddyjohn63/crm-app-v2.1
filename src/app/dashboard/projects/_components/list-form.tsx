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
import { X } from 'lucide-react';
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
  });

  useEventListener('keydown', e => {
    if (e.key === 'Escape') {
      setIsEditing(false);
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
    <Form {...form}>
      <form ref={formRef} onSubmit={onSubmit} className="p-2">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel></FormLabel>
              <FormControl>
                <Input
                  className="text-sm h-9 border-2 border-white/20 font-medium hover:border-2 hover:border-input focus:border-2 focus:border-input transition w-[272px]"
                  placeholder="Add a List Name"
                  {...field}
                  onFocus={() => setIsEditing(true)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center">
          <LoaderButton className="w-full mt-4" isLoading={isPending}>
            Add list
          </LoaderButton>
          <Button onClick={() => setIsEditing(false)} size="sm" variant="ghost">
            <X className="h-5 w-5 mt-4" />
          </Button>
        </div>
      </form>
    </Form>
  );
};
