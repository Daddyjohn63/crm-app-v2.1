'use client';
//summary: this form allows the user to add or remove services from a client.
//the form is a switch that is either true or false.
//How the data is fetched and updated is below:
//1. fetch all services for the user and return an array of service ids and the service properties.
//2. fetch all services currently assigned to the client and return an array of service ids.
//3. set the default values for the form based on the services and the client services.
//4. update the client services.
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

//form schema for the services, will be either true or false.
const FormSchema = z.object({
  services: z.record(z.string(), z.boolean()).default({})
});

export function AddServiceToClientForm() {
  const { toast } = useToast();
  const { clientId, setIsOpen } = useClientServiceOverlayStore();
  //get all services for the user and return an array of service ids and the service properties.
  const { execute: fetchServices, data: services } =
    useServerAction(getServicesAction);
  //get all services currently assigned to the client and return an array of service ids.
  const { execute: fetchClientServices, data: clientServices } =
    useServerAction(getServiceIdsByClientIdAction);
  //update the client services
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

  //fetch the all services for this user and the ids of the services currently
  // assigned to the client when the client id changes.
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
      //set the default values for the form.A service will be either true or false.
      form.reset({ services: defaultServices });
    }
  }, [services, clientServices, form]);

  // Move the check here, after all hooks
  if (!services || services.length === 0) {
    return <div>You have no services to allocate</div>;
  }

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
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border border-white/50 p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          {service.name}
                        </FormLabel>
                        <FormDescription></FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          className="data-[state=unchecked]:bg-gray-500 "
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
