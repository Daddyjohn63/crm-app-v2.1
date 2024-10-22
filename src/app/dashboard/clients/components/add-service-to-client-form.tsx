'use client';

//import { ClientId } from '@/db/schema';
import { LoaderButton } from '@/components/loader-button';
import { Input } from '@/components/ui/input';
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
import { SubmitHandler, useForm } from 'react-hook-form';
import { useServerAction } from 'zsa-react';
import { useClientServiceOverlayStore } from '@/store/clientServiceOverlayStore';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { getServiceIdsByClientId } from '@/data-access/clients';
import { getServiceIdsByClientIdAction } from '../../actions';
import { getServicesAction } from '../../services/actions';
import { useEffect } from 'react';

const FormSchema = z.object({
  services: z.record(z.string(), z.boolean()).default({})
});

export function AddServiceToClientForm() {
  const { toast } = useToast();
  const { clientId, setIsOpen } = useClientServiceOverlayStore();

  const { execute: fetchServices, data: services } = useServerAction(
    getServicesAction,
    {
      onSuccess(data) {
        console.log('Fetched services:', data);
      }
    }
  );

  useEffect(() => {
    if (clientId) {
      fetchServices();
    }
  }, [clientId, fetchServices]);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      services: {}
    }
  });

  useEffect(() => {
    if (services) {
      const defaultServices = services.reduce((acc, service) => {
        acc[service.id.toString()] = false;
        return acc;
      }, {} as Record<string, boolean>);
      form.reset({ services: defaultServices });
    }
  }, [services, form]);

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: 'You submitted the following values:',
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      )
    });
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
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
