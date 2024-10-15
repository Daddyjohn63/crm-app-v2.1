'use client';

// import { ClientId } from '@/db/schema';
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
import { SubmitHandler, useForm } from 'react-hook-form';
import { useServerAction } from 'zsa-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

import { PersonStanding, Terminal } from 'lucide-react';
import { btnIconStyles } from '@/styles/icons';
import { useOverlayStore } from '@/store/overlayStore';
import { NewServices } from '@/db/schema';
import { useServiceOverlayStore } from '@/store/serviceOverlayStore';
import { Textarea } from '@/components/ui/textarea';
import { createServiceAction } from './actions';

const formSchema = z.object({
  name: z.string().min(1, {
    message: 'You must enter a service name.'
  }),
  description: z.string().min(1, {
    message: 'You must enter a service description.'
  }),
  included_services: z.string().optional(),
  delivery_process: z.string().optional(),
  pricing: z.string().optional()
});

export default function CreateEditServiceForm() {
  //const isPending = false;
  const isEditing = false; //add this fully when we have the edit functionality
  //TODO: CAPTURE SERVICE ID FROM OVERLAY STORE OR PARAMS??
  const { setIsOpen } = useServiceOverlayStore();
  const { toast } = useToast();

  //useServerAction via zsa to handle the form submission.

  const { execute, error, isPending } = useServerAction(createServiceAction, {
    onSuccess() {
      toast({
        title: isEditing ? 'Service Updated' : 'Service created',
        description: isEditing
          ? 'The service has been updated successfully'
          : 'The service has been created successfully.',
        duration: 3000
      });
      setIsOpen(false);
    },
    onError({ err }) {
      toast({
        title: 'Something went wrong',
        variant: 'destructive',
        description: isEditing
          ? 'Something went wrong updating the service'
          : 'Something went wrong creating the service.',
        duration: 3000
      });
    }
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      included_services: '',
      delivery_process: '',
      pricing: ''
    }
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(values => {
          const serviceData = {
            serviceId: 0, // Default value for new service
            ...values
          };
          execute(serviceData).then(() => {});
        })}
        className="flex flex-col gap-4 flex-1 px-2"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Service Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter Service Name" {...field} />
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
              <FormLabel>Service Description</FormLabel>
              <FormControl>
                <Textarea
                  rows={6}
                  placeholder="Enter Service Description"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="included_services"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Included Services</FormLabel>
              <FormControl>
                <Textarea
                  rows={6}
                  placeholder="Enter Included Services"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="delivery_process"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Delivery Process</FormLabel>
              <FormControl>
                <Textarea
                  rows={6}
                  placeholder="Enter Delivery Process"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="pricing"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Pricing</FormLabel>
              <FormControl>
                <Textarea
                  rows={6}
                  placeholder="Enter Pricing Information"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <LoaderButton isLoading={isPending}>Create Service</LoaderButton>
      </form>
    </Form>
  );
}
