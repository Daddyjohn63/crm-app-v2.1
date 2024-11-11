'use client';
//this form is used to create a new client or edit an existing one
import { zodResolver } from '@hookform/resolvers/zod';
import { useServerAction } from 'zsa-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useContext, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ToggleContext } from '@/components/interactive-overlay';
import {
  createClientAction,
  editClientAction,
  getClientAction
} from './actions';
import { Textarea } from '@/components/ui/textarea';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { PopoverClose } from '@radix-ui/react-popover';
import { CalendarIcon, CheckIcon, X } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { LoaderButton } from '@/components/loader-button';
import { btnIconStyles } from '@/styles/icons';
import { User } from '@/db/schema';

const FormSchema = z.object({
  business_name: z.string().min(1, {
    message: 'Business name must be at least 6 characters.'
  }),
  primary_address: z.string().min(1, {
    message: 'You must enter a business address.'
  }),
  primary_email: z.string().email().min(4, {
    message: 'You must enter an email address'
  }),
  primary_phone: z.string().min(1, {
    message: 'You must enter a phone number.'
  }),
  business_description: z.string().min(1, {
    message: 'You must enter a business description.'
  }),
  date_onboarded: z.date({
    message: 'You must enter a date'
  }),
  additional_info: z.string().min(1, {
    message: 'You must enter some additional information.'
  })
  // additional_info: z.string().optional()
});

export function CreateEditClientForm({ id, user }: { id: string; user: User }) {
  const isEditing = !!id;

  const { setIsOpen, preventCloseRef } = useContext(ToggleContext);
  const { toast } = useToast();

  const { execute: executeAction, isPending } = useServerAction(
    isEditing ? editClientAction : createClientAction,
    {
      onStart() {
        preventCloseRef.current = true;
      },
      onFinish() {
        preventCloseRef.current = false;
      },
      onError({ err }) {
        console.log('Error occurred:', err);
        toast({
          title: 'Something went wrong',
          description: err.message,
          variant: 'destructive',
          duration: 3000
        });
      },
      onSuccess() {
        //console.log('Success!');
        toast({
          title: 'Client Created',
          description: isEditing
            ? 'Client information has been updated'
            : 'You can now start managing your client',
          duration: 3000
        });
        setIsOpen(false);
        // if (isEditing) {
        //   router.refresh();
        // }
      }
    }
  );

  const { execute: fetchClient } = useServerAction(getClientAction);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: isEditing
      ? async () => {
          const result = await fetchClient({ client_id: id });
          const existingClient = Array.isArray(result) ? result[0] : result;
          if (!existingClient) {
            throw new Error('Client not found');
          }
          return {
            business_name: existingClient.business_name ?? '',
            primary_address: existingClient.primary_address ?? '',
            primary_email: existingClient.primary_email ?? '',
            primary_phone: existingClient.primary_phone ?? '',
            business_description: existingClient.business_description ?? '',
            date_onboarded: existingClient.date_onboarded
              ? new Date(existingClient.date_onboarded)
              : new Date(),
            additional_info: existingClient.additional_info ?? ''
          };
        }
      : {
          business_name: '',
          primary_address: '',
          primary_email: '',
          primary_phone: '',
          business_description: '',
          date_onboarded: new Date(),
          additional_info: ''
        }
  });

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const handleOnSelect = (date: Date | undefined) => {
    if (date) {
      form.setValue('date_onboarded', date);
      setIsPopoverOpen(false);
    }
  };

  const onSubmit = form.handleSubmit(
    async (data: z.infer<typeof FormSchema>) => {
      //new type check added
      if (isEditing) {
        await executeAction({ ...data, client_id: id });
      } else {
        await executeAction(data);
      }
    }
  );

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="flex flex-col gap-4 flex-1 px-2">
        <FormField
          control={form.control}
          name="business_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business name</FormLabel>
              <FormControl>
                <Input placeholder="Business name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="primary_address"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business address</FormLabel>
              <FormControl>
                <Textarea rows={4} {...field} placeholder="Business address" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="primary_email"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Client's email address"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name="primary_phone"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone number</FormLabel>
              <FormControl>
                <Input placeholder="Client's phone number" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name="business_description"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business description</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Description of the client's business"
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date_onboarded"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date that the client was on-boarded</FormLabel>
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
                    <PopoverClose>
                      <X
                        size={24}
                        className="text-primary/60 hover:text-destructive"
                      />
                    </PopoverClose>
                  </div>
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={handleOnSelect}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="additional_info"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional Information</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Enter any additional information"
                />
              </FormControl>
            </FormItem>
          )}
        />
        <LoaderButton isLoading={isPending}>
          <CheckIcon className={btnIconStyles} />{' '}
          {isEditing ? 'Edit Client' : 'Create Client'}
        </LoaderButton>
      </form>
    </Form>
  );
}
