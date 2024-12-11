'use client';

import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { InteractiveOverlay } from '@/components/interactive-overlay';
import { useState } from 'react';

import { btnIconStyles, btnStyles } from '@/styles/icons';
import { CreateEditClientForm } from './create-edit-client-form';
import { User } from '@/db1/schema';

export function CreateEditClientButton({
  params,
  user
}: {
  params?: { clientId?: string };
  user: User;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const isEditing = params && params.clientId;
  //console.log('USER HASBAORD PAGE', user);

  return (
    <>
      <InteractiveOverlay
        title={isEditing ? 'Edit Client' : 'Create a Client'}
        description={
          isEditing
            ? 'Edit the details of the client'
            : 'Create a new client to start managing them. Do not worry, you can always change the details later'
        }
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        form={<CreateEditClientForm id={params?.clientId ?? ''} user={user} />}
      />

      <Button
        onClick={() => {
          setIsOpen(true);
        }}
        className={btnStyles}
      >
        <PlusCircle className={btnIconStyles} />
        {isEditing ? 'Edit Client' : 'Create Client'}
      </Button>
    </>
  );
}
