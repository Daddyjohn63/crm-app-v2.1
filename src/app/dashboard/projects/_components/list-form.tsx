'use client';

import { Button } from '@/components/ui/button';
import { ListWrapper } from './list-wrapper';
import { Plus } from 'lucide-react';
import { useState, useRef, ElementRef } from 'react';
import { useEventListener, useOnClickOutside } from 'usehooks-ts';
import { FormInput } from './form-input';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, useForm } from 'react-hook-form';
import { z } from 'zod';
import { Input } from '@/components/ui/input';

const formSchema = z.object({
  name: z.string().min(1, 'Title is required')
});

export const ListForm = () => {
  const [isEditing, setIsEditing] = useState(false);
  const formRef = useRef<ElementRef<'form'>>(null);
  const inputRef = useRef<ElementRef<'input'>>(null);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: ''
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

  if (isEditing) {
    return (
      <ListWrapper>
        <Form {...form}>
          <form ref={formRef} className="relative w-full">
            <FormInput
              ref={inputRef}
              //errors={fieldErrors}
              id="name"
              className="text-sm px-2 py-1 h-7 font-medium border-transparent hover:border-input focus:border-input transition"
              placeholder="Enter list title..."
            />
          </form>
        </Form>
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
