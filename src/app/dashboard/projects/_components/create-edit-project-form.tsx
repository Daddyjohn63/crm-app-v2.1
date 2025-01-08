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
import { useProjectOverlayStore } from '@/store/projectOverlayStore';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
// import {
//   createProjectAction,
//   editProjectAction,
//   getProjectAction,
//   getClientsAction
// } from './actions';
import { useEffect, useState } from 'react';
import {
  createProjectAction,
  getClientsAction,
  getProjectsAction,
  getProjectAction
} from '../actions';

const formSchema = z.object({
  name: z.string().min(1, {
    message: 'You must enter a project name.'
  }),
  description: z.string().min(1, {
    message: 'You must enter a project description.'
  }),
  clientId: z.string().min(1, {
    message: 'You must select a client.'
  })
});

export default function CreateEditProjectForm() {
  const { setIsOpen } = useProjectOverlayStore();
  const { toast } = useToast();
  const [clients, setClients] = useState<
    Array<{ id: number; business_name: string }>
  >([]);

  const { execute: fetchClients } = useServerAction(getClientsAction, {
    onSuccess({
      data
    }: {
      data: Array<{ id: number; business_name: string }>;
    }) {
      setClients(data);
    },
    onError() {
      toast({
        title: 'Error',
        description: 'Failed to fetch clients',
        variant: 'destructive'
      });
    }
  });

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const { execute, isPending } = useServerAction(createProjectAction, {
    onSuccess() {
      toast({
        title: 'Project created',
        description: 'The project has been created successfully.',
        duration: 3000
      });
      setIsOpen(false);
    },
    onError() {
      toast({
        title: 'Something went wrong',
        variant: 'destructive',
        description: 'Something went wrong creating the project.',
        duration: 3000
      });
    }
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      clientId: ''
    }
  });

  const onSubmit = form.handleSubmit(async values => {
    await execute({
      ...values,
      clientId: parseInt(values.clientId)
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
              <FormLabel>Project Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter Project Name" {...field} />
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
              <FormLabel>Project Description</FormLabel>
              <FormControl>
                <Textarea
                  rows={6}
                  placeholder="Enter Project Description"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="clientId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Client</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a client" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {clients.map(client => (
                    <SelectItem key={client.id} value={client.id.toString()}>
                      {client.business_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <LoaderButton isLoading={isPending}>Create Project</LoaderButton>
      </form>
    </Form>
  );
}
