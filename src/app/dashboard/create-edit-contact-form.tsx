'use client';

import { ClientId } from '@/db/schema';
import { LoaderButton } from '@/components/loader-button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useContext } from 'react';
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
import { ToggleContext } from '@/components/interactive-overlay';

const FormSchema = z.object({
  first_name: z.string().min(1, {
    message: 'You must enter a first name.'
  }),
  last_name: z.string().min(1, {
    message: 'You must enter a last name.'
  }),
  job_title: z.string().min(1, {
    message: 'You must enter a position.'
  }),
  email: z.string().email().min(4, {
    message: 'You must enter an email address'
  }),
  phone: z.string().min(1, {
    message: 'You must enter a phone number.'
  }),
  address: z.string().min(1, {
    message: 'You must enter an address.'
  }),
  city: z.string().min(1, {
    message: 'You must enter a city.'
  }),
  county: z.string().min(1, {
    message: 'You must enter a county.'
  }),
  postcode: z.string().min(1, {
    message: 'You must enter a postcode.'
  }),
  country: z.string().min(1, {
    message: 'You must enter a country.'
  })
});

export default function CreateEditContactForm({
  clientId
}: {
  clientId: ClientId;
}) {
  const { setIsOpen, preventCloseRef } = useContext(ToggleContext);
  const { toast } = useToast();
  return <div>CreateEditContactForm</div>;
}
