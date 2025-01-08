'use client';

// import { ClientId } from '@/db/schema/index';
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
import {
  createContactAction,
  editContactAction,
  getContactAction
} from './actions';
import { PersonStanding, Terminal } from 'lucide-react';
import { btnIconStyles } from '@/styles/icons';
import { useOverlayStore } from '@/store/overlayStore';
import { useClientIdParam } from '@/util/safeparam';
// import { User } from '@/db/schema/index';
// import { assertAuthenticated } from '@/lib/session';
// import { useEffect } from 'react';

//form schema
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
  }),
  clientId: z.number()
});

export default function CreateEditContactForm() {
  const { contactId } = useOverlayStore();
  //console.log(contactId); WE HAVE THE ID!!!

  //get variables we will need
  const isEditing = !!contactId;
  const clientId = useClientIdParam();

  //ref to zustand state initialise toast.
  const { setIsOpen } = useOverlayStore();
  const { toast } = useToast();

  //useServerAction via zsa to handle the form submission
  const { execute, error, isPending } = useServerAction(
    isEditing ? editContactAction : createContactAction,
    {
      onSuccess() {
        toast({
          title: isEditing ? 'Contact Updated' : 'Contact created',
          description: isEditing
            ? 'The contact has been updated successfully'
            : 'The contact has been created successfully.',
          duration: 3000
        });
        setIsOpen(false);
      },
      onError({ err }) {
        toast({
          title: 'Something went wrong',
          variant: 'destructive',
          description: isEditing
            ? 'Something went wrong updating the contact'
            : 'Something went wrong creating the contact.',
          duration: 3000
        });
      }
    }
  );

  //rename execute to fetchContact so as to distinguish between getting contact details and creating/editing a contact.
  const { execute: fetchContact } = useServerAction(getContactAction);

  //useForm to handle the form state and validation
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: async () => {
      if (isEditing && contactId) {
        try {
          const [contact] = await fetchContact({ contactId });
          if (contact) {
            return {
              clientId,
              first_name: contact.first_name,
              last_name: contact.last_name,
              job_title: contact.job_title,
              email: contact.email,
              phone: contact.phone,
              address: contact.address,
              city: contact.city,
              county: contact.county,
              postcode: contact.postcode,
              country: contact.country
            };
          }
        } catch (error) {
          console.error('Error fetching contact:', error);
          toast({
            title: 'Error',
            description: 'Failed to fetch contact details',
            variant: 'destructive'
          });
        }
      }
      return {
        clientId,
        first_name: '',
        last_name: '',
        job_title: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        county: '',
        postcode: '',
        country: ''
      };
    }
  });

  //onSubmit function to handle the form submission.
  const onSubmit: SubmitHandler<z.infer<typeof FormSchema>> = values => {
    //execute the useServerAction
    execute({
      //if we are editing, we need to pass the contactId, otherwise it will be 0
      contactId: contactId ?? 0,
      clientId,
      first_name: values.first_name,
      last_name: values.last_name,
      job_title: values.job_title,
      email: values.email,
      phone: values.phone,
      address: values.address,
      city: values.city,
      county: values.county,
      postcode: values.postcode,
      country: values.country
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4 flex-1 px-2"
      >
        <FormField
          control={form.control}
          name="last_name"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input placeholder="Last Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="first_name"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input placeholder="First Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="job_title"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Job Title</FormLabel>
              <FormControl>
                <Input placeholder="Job Title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input placeholder="Phone" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Street name</FormLabel>
              <FormControl>
                <Input placeholder="Street name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input placeholder="City" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="county"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>County</FormLabel>
              <FormControl>
                <Input placeholder="County" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="postcode"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Postcode</FormLabel>
              <FormControl>
                <Input placeholder="Postcode" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Country</FormLabel>
              <FormControl>
                <Input placeholder="Country" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {error && (
          <Alert variant="destructive">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Error creating contact</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        )}

        <LoaderButton isLoading={isPending}>
          <PersonStanding className={btnIconStyles} />{' '}
          {contactId ? 'Update Contact' : 'Create Contact'}
        </LoaderButton>
      </form>
    </Form>
  );
}
