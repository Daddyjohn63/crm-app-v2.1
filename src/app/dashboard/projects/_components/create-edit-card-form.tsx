'use client';

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
import {
  createCardAction,
  getBoardUsersAction,
  getCardAction,
  updateCardAction
} from '../actions';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { PopoverClose } from '@radix-ui/react-popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useCardDialogStore } from '@/store/cardDialogStore';
import { Card } from '@/db/schema';
import { CardWithProfile } from '@/use-cases/types';
// { CardWithProfile } from '@/types';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  assignedTo: z.coerce.number(),
  dueDate: z.date().optional(),
  status: z.enum(['todo', 'in_progress', 'done', 'blocked']).default('todo'),
  listId: z.number(),
  boardId: z.number()
});

type BoardUser = {
  id: number;
  email: string | null;
  emailVerified: Date | null;
  role: 'admin' | 'guest' | 'member';
  displayName: string | null;
};

interface CreateEditCardFormProps {
  cardData?: CardWithProfile;
  listId: number;
  listName: string;
  onClose: () => void;
}

export function CreateEditCardForm({
  cardData,
  listId,
  listName,
  onClose
}: CreateEditCardFormProps) {
  const isEditing = !!cardData;
  // console.log('CreateEditCardForm - cardData:', cardData);
  // console.log('CreateEditCardForm - isEditing:', isEditing);
  const { boardId } = useCardDialogStore();

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [boardUsers, setBoardUsers] = useState<BoardUser[]>([]);
  const { toast } = useToast();

  const { execute: executeAction, isPending } = useServerAction(
    isEditing ? updateCardAction : createCardAction,
    {
      onSuccess() {
        toast({
          title: isEditing ? 'Card Updated' : 'Card Created',
          description: isEditing
            ? 'The card has been updated successfully.'
            : 'The card has been created successfully.',
          duration: 3000
        });
        onClose();
      },
      onError(error) {
        toast({
          title: 'Something went wrong',
          variant: 'destructive',
          description: `Error ${isEditing ? 'updating' : 'creating'} the card.`,
          duration: 3000
        });
      }
    }
  );

  const { execute: fetchCard } = useServerAction(getCardAction);

  useEffect(() => {
    const fetchBoardUsers = async () => {
      if (boardId) {
        try {
          const [users] = await getBoardUsersAction(boardId);
          if (users && Array.isArray(users)) {
            setBoardUsers(users);
          }
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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: cardData?.name || '',
      description: cardData?.description || '',
      assignedTo: cardData?.assignedTo || undefined,
      dueDate: cardData?.dueDate ? new Date(cardData.dueDate) : undefined,
      status: cardData?.status || 'todo',
      boardId: boardId || undefined,
      listId
    }
  });

  const handleOnSelect = (date: Date | undefined) => {
    if (date) {
      form.setValue('dueDate', date);
      setIsPopoverOpen(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (isEditing && cardData) {
      await executeAction({
        ...values,
        cardId: cardData.id
      });
    } else {
      await executeAction(values);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
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
        <FormField
          control={form.control}
          name="dueDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Due Date</FormLabel>
              <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'pl-3 text-left font-normal',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      {field.value ? (
                        format(field.value, 'PPP')
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <div className="flex m-1 justify-end ">
                    <div className="flex-1"></div>
                    <PopoverClose>
                      <X
                        size={24}
                        className="text-primary/60 hover:text-destructive"
                      />
                    </PopoverClose>
                  </div>
                  <Calendar
                    mode="single"
                    defaultMonth={field.value}
                    selected={field.value}
                    onSelect={handleOnSelect}
                    initialFocus
                    fixedWeeks
                    weekStartsOn={1}
                    fromDate={new Date(new Date().getFullYear() - 30, 0, 1)}
                    toDate={new Date(new Date().getFullYear() + 10, 11, 31)}
                    captionLayout="dropdown-buttons"
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="todo">Not Started</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="done">Completed</SelectItem>
                  <SelectItem value="blocked">Blocked</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <LoaderButton type="submit" isLoading={isPending}>
          Submit
        </LoaderButton>
      </form>
    </Form>
  );
}
