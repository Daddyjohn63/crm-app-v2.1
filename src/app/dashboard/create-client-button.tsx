'use client';

import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { InteractiveOverlay } from '@/components/interactive-overlay';
import { useState } from 'react';

import { btnIconStyles, btnStyles } from '@/styles/icons';
import { CreateClientForm } from './create-client-form';
//import { CreateClientForm } from './create-client-form';

export function CreateClientButton({
  params
}: {
  params?: { clientId?: string };
}) {
  //console.log('PARAMS FROM CREATE-CLIENT-BUTTON', params);
  const [isOpen, setIsOpen] = useState(false);
  const isEditing = params && params.clientId;

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
        form={<CreateClientForm id={params?.clientId ?? ''} />}
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
