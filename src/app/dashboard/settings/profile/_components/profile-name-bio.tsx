'use client';

import { ConfigurationPanel } from '@/components/configuration-panel';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { PencilIcon, CheckIcon, X } from 'lucide-react';
import { Suspense, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useServerAction } from 'zsa-react';
import { useToast } from '@/components/ui/use-toast';
import { useOnClickOutside } from 'usehooks-ts';
import { updateProfileBioAction, updateProfileNameAction } from '../actions';

const nameSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' })
});

const bioSchema = z.object({
  bio: z.string().default('')
});

export const ProfileNameBio = ({ initialName = '', initialBio = '' }) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const nameFormRef = useRef<HTMLFormElement>(null);
  const bioFormRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  const nameForm = useForm({
    resolver: zodResolver(nameSchema),
    defaultValues: { name: initialName }
  });

  const bioForm = useForm({
    resolver: zodResolver(bioSchema),
    defaultValues: { bio: initialBio }
  });

  const { execute: executeNameAction, isPending: isNamePending } =
    useServerAction(updateProfileNameAction, {
      onSuccess() {
        toast({
          title: 'Name updated',
          description: 'Your display name has been updated successfully.',
          duration: 3000
        });
        setIsEditingName(false);
      },
      onError() {
        toast({
          title: 'Error',
          description: 'Failed to update display name',
          variant: 'destructive'
        });
      }
    });

  const { execute: executeBioAction, isPending: isBioPending } =
    useServerAction(updateProfileBioAction, {
      onSuccess() {
        toast({
          title: 'Bio updated',
          description: 'Your bio has been updated successfully.',
          duration: 3000
        });
        setIsEditingBio(false);
      },
      onError() {
        toast({
          title: 'Error',
          description: 'Failed to update bio',
          variant: 'destructive'
        });
      }
    });

  useOnClickOutside(nameFormRef as React.RefObject<HTMLElement>, () => {
    setIsEditingName(false);
    nameForm.reset();
  });

  useOnClickOutside(bioFormRef as React.RefObject<HTMLElement>, () => {
    setIsEditingBio(false);
    bioForm.reset();
  });

  const onSubmitName = nameForm.handleSubmit(async data => {
    if (data.name !== initialName) {
      await executeNameAction({ profileName: data.name });
    }
  });

  const onSubmitBio = bioForm.handleSubmit(async data => {
    if (data.bio !== initialBio) {
      await executeBioAction({ bio: data.bio });
    }
  });

  return (
    <ConfigurationPanel title="Profile Information">
      <Suspense fallback={<Skeleton className="w-full h-[200px] rounded" />}>
        <div className="space-y-6">
          <div>
            {isEditingName ? (
              <form
                ref={nameFormRef}
                onSubmit={onSubmitName}
                className="space-y-2"
              >
                <div className="flex gap-2 ">
                  <Input
                    {...nameForm.register('name')}
                    placeholder="Your name"
                    className="w-full "
                  />
                  <Button type="submit" disabled={isNamePending} size="icon">
                    <CheckIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setIsEditingName(false);
                      nameForm.reset();
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            ) : (
              <div className="flex items-center justify-between">
                <h3 className="font-medium">
                  {initialName || 'Add your name'}
                </h3>
                <Button
                  onClick={() => setIsEditingName(true)}
                  variant="ghost"
                  size="icon"
                >
                  <PencilIcon className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          <div>
            {isEditingBio ? (
              <form
                ref={bioFormRef}
                onSubmit={onSubmitBio}
                className="space-y-2"
              >
                <Textarea
                  {...bioForm.register('bio')}
                  placeholder="Write a short bio about yourself..."
                  className="w-[600px]"
                  rows={4}
                />
                <div className="flex gap-2">
                  <Button
                    className="mt-4"
                    type="submit"
                    disabled={isBioPending}
                    size="sm"
                  >
                    <CheckIcon className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  <Button
                    className="mt-4"
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setIsEditingBio(false);
                      bioForm.reset();
                    }}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <div className="flex items-start justify-between">
                <p className="text-sm text-muted-foreground">
                  {initialBio || 'Add a bio to tell people more about yourself'}
                </p>
                <Button
                  onClick={() => setIsEditingBio(true)}
                  variant="ghost"
                  size="icon"
                >
                  <PencilIcon className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </Suspense>
    </ConfigurationPanel>
  );
};
