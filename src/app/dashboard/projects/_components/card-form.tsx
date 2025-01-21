'use client';

/**
 * CardForm Component
 * Handles the form submission for creating new cards.
 * Gets listId and boardId from the Zustand store, which is set up by CardModal.
 */
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
import { createCardAction, getBoardUsersAction } from '../actions';
import { useCardDialogStore } from '@/store/cardDialogStore';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useEffect, useState } from 'react';

type BoardUser = {
  id: number;
  email: string | null;
  emailVerified: Date | null;
  role: 'admin' | 'guest' | 'member';
  displayName: string | null;
};

// Form validation schema
const formSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  assignedTo: z.number().optional()
});

export const CardForm = () => {
  const { listId, boardId, setIsOpen } = useCardDialogStore();
  const [boardUsers, setBoardUsers] = useState<BoardUser[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchBoardUsers = async () => {
      if (boardId) {
        try {
          const users = await getBoardUsersAction(boardId);
          setBoardUsers(users as unknown as BoardUser[]);
        } catch (error) {
          toast({
            title: 'Error',
            description: 'Failed to fetch board users',
            variant: 'destructive'
          });
        }
      }
    };
    fetchBoardUsers();
  }, [boardId, toast]);

  const { execute, isPending } = useServerAction(createCardAction, {
    onSuccess() {
      toast({
        title: 'Card created',
        description: 'The card has been created successfully.',
        duration: 3000
      });
      setIsOpen(false);
    },
    onError(error) {
      toast({
        title: 'Something went wrong',
        variant: 'destructive',
        description: 'Something went wrong creating the card.',
        duration: 3000
      });
    }
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: ''
    }
  });

  const onSubmit = form.handleSubmit(async values => {
    if (!listId || !boardId) {
      toast({
        title: 'Error',
        description: 'Missing required list or board ID.',
        variant: 'destructive'
      });
      return;
    }

    await execute({
      name: values.name,
      description: values.description,
      listId,
      boardId,
      assignedTo: values.assignedTo
    });
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Card Name *</FormLabel>
              <FormControl>
                <Input placeholder="Enter Card Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter description"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="assignedTo"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Assignee</FormLabel>
              <Select
                onValueChange={value => field.onChange(parseInt(value))}
                value={field.value?.toString()}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select assignee" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {boardUsers.map(user => (
                    <SelectItem key={user.id} value={user.id.toString()}>
                      {user.displayName || user.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <LoaderButton type="submit" isLoading={isPending}>
          Create Card
        </LoaderButton>
      </form>
    </Form>
  );
};
