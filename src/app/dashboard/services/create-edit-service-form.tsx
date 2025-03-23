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
import { useServiceOverlayStore } from '@/store/serviceOverlayStore';
import { Textarea } from '@/components/ui/textarea';
import {
  createServiceAction,
  editServiceAction,
  getServiceAction
} from './actions';

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
  const { serviceId, setIsOpen } = useServiceOverlayStore();
  const isEditing = !!serviceId;
  const { toast } = useToast();

  const { execute, error, isPending } = useServerAction(
    isEditing ? editServiceAction : createServiceAction,
    {
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
    }
  );

  const { execute: fetchService } = useServerAction(getServiceAction);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: async () => {
      if (isEditing && serviceId) {
        try {
          const [service] = await fetchService({ serviceId });
          if (service) {
            return {
              name: service.name,
              description: service.description,
              included_services: service.included_services || '',
              delivery_process: service.delivery_process || '',
              pricing: service.pricing || ''
            };
          }
        } catch (error) {
          console.error('Error fetching service:', error);
          toast({
            title: 'Error',
            description: 'Failed to fetch service details',
            variant: 'destructive'
          });
        }
      }
      return {
        name: '',
        description: '',
        included_services: '',
        delivery_process: '',
        pricing: ''
      };
    }
  });

  const onSubmit = form.handleSubmit(async values => {
    await execute({
      serviceId: serviceId || 0,
      ...values
    });
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="flex flex-col gap-4 flex-1 px-2">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>
                Service Name<span className="text-red-600"> *</span>
              </FormLabel>
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
              <FormLabel>
                Service Description<span className="text-red-600"> *</span>
              </FormLabel>
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
        <LoaderButton isLoading={isPending}>
          {isEditing ? 'Update Service' : 'Create Service'}
        </LoaderButton>
      </form>
    </Form>
  );
}
