'use client';

/**
 * CardForm Component
 * Handles the form submission for creating new cards.
 * Gets listId and boardId from the CardDialog context, which is set up by CardModal.
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
import { createCardAction } from '../actions';
import { useCardDialog } from './card-provider';
import { Textarea } from '@/components/ui/textarea';

// Form validation schema
const formSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional()
});

export const CardForm = () => {
  // Get listId and boardId from the CardDialog context
  // These are set by CardModal before the form is displayed
  const { listId, boardId } = useCardDialog();
  const { setIsOpen } = useCardDialog();
  const { toast } = useToast();

  // Set up the server action for creating cards
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

  // Initialize the form with react-hook-form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: ''
    }
  });

  // Handle form submission
  const onSubmit = form.handleSubmit(async values => {
    // Verify that we have both required IDs from the context
    if (!listId || !boardId) {
      toast({
        title: 'Error',
        description: 'Missing required list or board ID.',
        variant: 'destructive'
      });
      return;
    }

    // Execute the server action with form values and IDs
    await execute({
      name: values.name,
      description: values.description,
      listId,
      boardId
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
                <Textarea placeholder="Enter Description" {...field} />
              </FormControl>
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
