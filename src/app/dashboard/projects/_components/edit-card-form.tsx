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
  getBoardUsersAction,
  getCardAction,
  updateCardAction
} from '../actions';
import { useCardDialogStore } from '@/store/cardDialogStore';
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
import { CardWithProfile } from '@/use-cases/types';
import { useEffect, useState } from 'react';
import { Profile, usersRelations } from '@/db/schema';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useEditCardDialogStore } from '@/store/editCardDialogStore';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  assignedTo: z.string().optional(),
  dueDate: z.date(),
  status: z.enum(['todo', 'in_progress', 'done', 'blocked']).optional()
});

interface EditCardFormProps {}

type BoardUser = {
  id: number;
  email: string | null;
  emailVerified: Date | null;
  role: 'admin' | 'guest' | 'member';
  displayName: string | null;
  // due_date: Date | null;
};

export const EditCardForm = ({}: EditCardFormProps) => {
  const { cardId, boardId, setIsOpen } = useEditCardDialogStore();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [cardData, setCardData] = useState<CardWithProfile | null>(null);
  const [boardUsers, setBoardUsers] = useState<BoardUser[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchData() {
      if (cardId) {
        try {
          const [result] = await getCardAction({ cardId });
          if (result) {
            const assignedUser = result.assignedTo
              ? { displayName: null }
              : null;
            setCardData({
              ...result,
              assignedUserProfile: assignedUser
            } as CardWithProfile);
          }
        } catch (error) {
          toast({
            title: 'Error',
            description: 'Failed to fetch card data',
            variant: 'destructive'
          });
        }
      }
    }
    fetchData();
  }, [cardId, toast]);

  useEffect(() => {
    async function fetchUsers() {
      if (boardId) {
        try {
          const [result] = await getBoardUsersAction(boardId);
          if (result && Array.isArray(result)) {
            setBoardUsers(
              result.map(user => ({
                id: user.id,
                email: user.email,
                emailVerified: user.emailVerified,
                role: user.role,
                displayName: user.displayName
              }))
            );

            // Update cardData's assignedUserProfile if we have an assigned user
            if (cardData?.assignedTo) {
              const assignedUser = result.find(
                user => user.id === cardData.assignedTo
              );
              if (assignedUser) {
                setCardData(prev =>
                  prev
                    ? {
                        ...prev,
                        assignedUserProfile: {
                          displayName: assignedUser.displayName
                        }
                      }
                    : null
                );
              }
            }
          }
        } catch (error) {
          toast({
            title: 'Error',
            description: 'Failed to fetch board users',
            variant: 'destructive'
          });
        }
      }
    }
    fetchUsers();
  }, [boardId, toast, cardData?.assignedTo]);

  const { execute: updateCard, isPending } = useServerAction(updateCardAction, {
    onSuccess() {
      toast({
        title: 'Card updated',
        description: 'The card has been updated successfully.',
        duration: 3000
      });
      setIsOpen(false);
    },
    onError(error) {
      toast({
        title: 'Something went wrong',
        variant: 'destructive',
        description: 'Something went wrong updating the card.',
        duration: 3000
      });
    }
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: {
      name: cardData?.name || '',
      description: cardData?.description || '',
      assignedTo: cardData?.assignedTo?.toString(),
      dueDate: cardData?.dueDate ? new Date(cardData.dueDate) : new Date(),
      status: cardData?.status || 'todo'
    }
  });

  const handleOnSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      form.setValue('dueDate', date);
      setIsPopoverOpen(false);
    }
  };

  const onSubmit = form.handleSubmit(async values => {
    if (!cardId || !cardData) return;
    await updateCard({
      cardId,
      name: values.name,
      description: values.description,
      assignedTo: values.assignedTo,
      dueDate: values.dueDate,
      status: values.status,
      listId: cardData.listId
    });
    setIsOpen(false);
  });

  if (!cardData) {
    return <div>Loading...</div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        {/* <FormField
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
        /> */}
        {/* <FormField
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
        /> */}
        {/* <FormField
          control={form.control}
          name="assignedTo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assigned To</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a user" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {boardUsers.map(user => (
                    <SelectItem key={user.id} value={user.id.toString()}>
                      {user.displayName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        /> */}
        <FormField
          control={form.control}
          name="dueDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Due Date</FormLabel>
              <Popover
                open={isPopoverOpen}
                onOpenChange={open => {
                  setIsPopoverOpen(open);
                  if (!open) {
                    setSelectedDate(undefined);
                  }
                }}
              >
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      type="button"
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
                  <div className="flex m-1 justify-end">
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
                    selected={selectedDate || field.value}
                    defaultMonth={selectedDate || field.value || new Date()}
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
        {/* <FormField
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
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                  <SelectItem value="blocked">Blocked</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        /> */}

        <LoaderButton type="submit" isLoading={isPending}>
          Update Card
        </LoaderButton>
      </form>
    </Form>
  );
};
