'use client';

import { LoaderButton } from '@/components/loader-button';
import { CalendarIcon, Trash, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useServerAction } from 'zsa-react';
import { schema } from './validation';
import { createClientAction } from './actions';
import { Textarea } from '@/components/ui/textarea';
import { CheckIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { PopoverClose } from '@radix-ui/react-popover';
import { useState } from 'react';
import { btnIconStyles } from '@/styles/icons';
import { ToggleContext } from '@/components/interactive-overlay';

export function CreateClientForm() {
  // const { setIsOpen, preventCloseRef } = useContext(ToggleContext);
  const { toast } = useToast();
  // const handleSubmit = (values:any)=>{
  //  // onsubmit(values)
  //   console.log(values)
  // }

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      business_name: '',
      primary_address: ''
    }
  });

  const submit = (values: any) => {
    console.log('Submitted Values:', values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submit)}>
        <FormField
          name="business_name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Name</FormLabel>
              <FormControl>
                <Input
                  // disabled={disabled}
                  placeholder="Enter client's business name"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name="primary_address"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Client's Business address</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  value={field.value ?? ''}
                  //disabled={disabled}
                  placeholder="Business address"
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button className="w-full">Create Client</Button>
      </form>
    </Form>
  );
}
