'use client';

import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { z } from 'zod';
import { useRef, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { LoaderButton } from '@/components/loader-button';
import { useToast } from '@/components/ui/use-toast';
import { Textarea } from '@/components/ui/textarea';

import { MAX_UPLOAD_DOCUMENT_SIZE_IN_MB } from '@/app-config';

const maxFileSizeInBytes = MAX_UPLOAD_DOCUMENT_SIZE_IN_MB;

//zod schema
const uploadDocumentSchema = z.object({
  name: z.string().min(1, { message: 'A document name is required' }),
  description: z.string().optional(),
  file: z.instanceof(File).refine(file => file.size < maxFileSizeInBytes, {
    message: `Document must be less than ${MAX_UPLOAD_DOCUMENT_SIZE_IN_MB}MB`
  })
});

export default function DocumentUploadForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  const form = useForm<z.infer<typeof uploadDocumentSchema>>({
    resolver: zodResolver(uploadDocumentSchema),
    defaultValues: {
      name: '',
      description: ''
    }
  });

  //on submit
  const onSubmit: SubmitHandler<
    z.infer<typeof uploadDocumentSchema>
  > = async values => {
    setIsLoading(true);
    try {
      console.log(values);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        ref={formRef}
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 flex flex-col gap-2"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Document Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter document name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Enter document description"
                  rows={3}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="file"
          render={({ field: { value, onChange, ...fieldProps } }) => (
            <FormItem>
              <FormLabel>Document (PDF only, max 5MB)</FormLabel>
              <FormControl>
                <Input
                  {...fieldProps}
                  type="file"
                  accept="application/pdf"
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer h-[60px] flex items-center justify-center"
                  onChange={event => {
                    const file = event.target.files && event.target.files[0];
                    onChange(file);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <LoaderButton type="submit" isLoading={isLoading}>
          Upload Document
        </LoaderButton>
      </form>
    </Form>
  );
}
