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
import { useServerAction } from 'zsa-react';
import { uploadDocumentAction } from '../[clientId]/documents/actions';
import { useClientIdParam } from '@/util/safeparam';
import { useDocumentDialogStore } from '@/store/documentDialogStore';

const maxFileSizeInBytes = MAX_UPLOAD_DOCUMENT_SIZE_IN_MB * 1024 * 1024;

//zod schema
const uploadDocumentSchema = z.object({
  name: z.string().min(1, { message: 'A document name is required' }),
  description: z.string().optional(),
  file: z.instanceof(File).refine(file => file.size < maxFileSizeInBytes, {
    message: `Document must be less than ${MAX_UPLOAD_DOCUMENT_SIZE_IN_MB}MB`
  })
});

export default function DocumentUploadForm() {
  const { setIsOpen } = useDocumentDialogStore();
  const clientId = useClientIdParam();
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  const form = useForm<z.infer<typeof uploadDocumentSchema>>({
    resolver: zodResolver(uploadDocumentSchema),
    defaultValues: {
      name: '',
      description: ''
    }
  });

  const { execute: uploadDocument, isPending } = useServerAction(
    uploadDocumentAction,
    {
      onError: ({ err }) => {
        toast({
          title: 'Error',
          description: err.message || 'Failed to upload document.',
          variant: 'destructive'
        });
      },
      onSuccess: () => {
        toast({
          title: 'Success',
          description: 'Document uploaded successfully.'
        });
        formRef.current?.reset();
        setIsOpen(false);
      }
    }
  );

  //on submit
  const onSubmit: SubmitHandler<
    z.infer<typeof uploadDocumentSchema>
  > = values => {
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('description', values.description || '');
    formData.append('file', values.file);
    formData.append('clientId', clientId.toString());
    uploadDocument({ fileWrapper: formData });
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

        <LoaderButton type="submit" isLoading={isPending}>
          Upload Document
        </LoaderButton>
      </form>
    </Form>
  );
}
