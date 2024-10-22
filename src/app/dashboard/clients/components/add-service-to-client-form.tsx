'use client';

import { LoaderButton } from '@/components/loader-button';
import { useToast } from '@/components/ui/use-toast';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useServerAction } from 'zsa-react';
import { useClientServiceOverlayStore } from '@/store/clientServiceOverlayStore';
import { Switch } from '@/components/ui/switch';
import { getServicesAction } from '../../services/actions';
import { useEffect } from 'react';
import {
  getServiceIdsByClientIdAction,
  updateClientServicesAction
} from '../../actions';

const FormSchema = z.object({
  services: z.record(z.string(), z.boolean()).default({})
});

export function AddServiceToClientForm() {
  const { toast } = useToast();
  const { clientId, setIsOpen } = useClientServiceOverlayStore();

  const { execute: fetchServices, data: services } =
    useServerAction(getServicesAction);
  const { execute: fetchClientServices, data: clientServices } =
    useServerAction(getServiceIdsByClientIdAction);
  const { execute: updateClientServices, isPending } = useServerAction(
    updateClientServicesAction,
    {
      onSuccess() {
        toast({
          title: 'Services updated',
          description: 'The client services have been updated successfully.',
          duration: 3000
        });
        setIsOpen(false);
      },
      onError() {
        toast({
          title: 'Error',
          description: 'Failed to update client services',
          variant: 'destructive',
          duration: 3000
        });
      }
    }
  );

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      services: {}
    }
  });

  useEffect(() => {
    if (clientId) {
      fetchServices();
      fetchClientServices({ clientId });
    }
  }, [clientId, fetchServices, fetchClientServices]);

  useEffect(() => {
    if (services && clientServices) {
      const defaultServices = services.reduce((acc, service) => {
        acc[service.id.toString()] = clientServices.includes(service.id);
        return acc;
      }, {} as Record<string, boolean>);
      form.reset({ services: defaultServices });
    }
  }, [services, clientServices, form]);

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const selectedServiceIds = Object.entries(data.services)
      .filter(([_, isSelected]) => isSelected)
      .map(([serviceId]) => parseInt(serviceId, 10));

    if (clientId !== null) {
      updateClientServices({ clientId, serviceIds: selectedServiceIds });
    } else {
      // Handle the case where clientId is null, e.g., show an error message
      toast({
        title: 'Error',
        description: 'Client ID is missing speak to your admin',
        variant: 'destructive',
        duration: 3000
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <div>
          <h3 className="mb-4 text-lg font-medium">Services</h3>
          <div className="space-y-4">
            {services &&
              services.map(service => (
                <FormField
                  key={service.id}
                  control={form.control}
                  name={`services.${service.id}`}
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          {service.name}
                        </FormLabel>
                        <FormDescription></FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              ))}
          </div>
        </div>
        <LoaderButton type="submit" isLoading={isPending}>
          Update Services
        </LoaderButton>
      </form>
    </Form>
  );
}
