'use client';

import { Button } from '@/components/ui/button';
import { ListWrapper } from './list-wrapper';
import { Plus, X } from 'lucide-react';
import { useState, useRef, ElementRef } from 'react';
import { useEventListener, useOnClickOutside } from 'usehooks-ts';
import { FormInput } from './form-input';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, useForm } from 'react-hook-form';
import { z } from 'zod';
import { useParams } from 'next/navigation';
import { LoaderButton } from '@/components/loader-button';
import { getCurrentUser } from '@/lib/session';

const formSchema = z.object({
  name: z.string().min(1, 'A List Name is required'),
  projectId: z.string()
});

export const ListForm = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const formRef = useRef<ElementRef<'form'>>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const params = useParams();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      projectId: params.projectId as string
    }
  });

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const disableEditing = () => {
    setIsEditing(false);
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      disableEditing();
    }
  };

  useEventListener('keydown', onKeyDown);
  useOnClickOutside(formRef, disableEditing);

  const onSubmit = form.handleSubmit(async data => {
    try {
      setIsPending(true);
      const values = form.getValues();
      //  console.log('Form values:', values);
      //  console.log('Form data:', data);
      // TODO: Add your API call here
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsPending(false);
      disableEditing();
    }
  });

  if (isEditing) {
    return (
      <ListWrapper>
        <form onSubmit={onSubmit} ref={formRef} className="relative w-full">
          <FormInput
            ref={inputRef}
            id="name"
            name="name"
            defaultValue={form.getValues('name')}
            onChange={e => form.setValue('name', e.target.value)}
            className="text-sm px-2 py-1 h-7 font-medium border-transparent hover:border-input focus:border-input transition"
            placeholder="Enter list title..."
          />
          <input
            type="hidden"
            name="projectId"
            defaultValue={params.projectId}
            onChange={e => form.setValue('projectId', e.target.value)}
          />

          <div className="flex items-center gap-x-1">
            <LoaderButton className="w-full mt-4" isLoading={isPending}>
              Add list
            </LoaderButton>
            <Button onClick={disableEditing} size="sm" variant="ghost">
              <X className="h-5 w-5 mt-4" />
            </Button>
          </div>
        </form>
      </ListWrapper>
    );
  }

  return (
    <ListWrapper>
      <Button
        onClick={enableEditing}
        className="w-full rounded-md bg-white/80 hover:bg-white/50 transition p-3 items-center font-medium text-sm"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add List
      </Button>
    </ListWrapper>
  );
};
