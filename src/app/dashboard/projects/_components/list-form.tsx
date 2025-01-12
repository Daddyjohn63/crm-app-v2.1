'use client';
import { useEventListener, useOnClickOutside } from 'usehooks-ts';
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
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useState, useRef } from 'react';
import { useProjectStore } from '@/store/projectStore';

const formSchema = z.object({
  name: z.string().min(1, 'A List Name is required'),
  projectId: z.number()
});

export const ListForm = () => {
  const [isEditing, setIsEditing] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const currentProjectId = useProjectStore(state => state.currentProjectId);
  //console.log('project id', currentProjectId);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      projectId: currentProjectId!
    }
  });

  const onSubmit = form.handleSubmit((values: z.infer<typeof formSchema>) => {
    console.log(values);
    form.reset({
      name: '',
      projectId: currentProjectId!
    });
    setIsEditing(false);
  });

  useOnClickOutside(formRef, () => {
    setIsEditing(false);
  });

  useEventListener('keydown', e => {
    if (e.key === 'Escape') {
      setIsEditing(false);
    }
  });

  return (
    <Form {...form}>
      <form ref={formRef} onSubmit={onSubmit}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel></FormLabel>
              <FormControl>
                <Input
                  className="text-sm px-4 py-2 h-9 border-2 border-white/20 font-medium hover:border-input focus:border-input transition"
                  placeholder="Add a List Name"
                  {...field}
                  onFocus={() => setIsEditing(true)}
                />
              </FormControl>
            </FormItem>
          )}
        />
        {isEditing && (
          <div className="flex items-center gap-x-1">
            <LoaderButton className="w-full mt-4" isLoading={false}>
              Add list
            </LoaderButton>
            <Button
              onClick={() => setIsEditing(false)}
              size="sm"
              variant="ghost"
            >
              <X className="h-5 w-5 mt-4" />
            </Button>
          </div>
        )}
      </form>
    </Form>
  );
};
