'use client';

import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { InteractiveOverlay } from '@/components/interactive-overlay';
import { useState } from 'react';

import { btnIconStyles, btnStyles } from '@/styles/icons';
import { CreateClientForm } from './create-client-form';
//import { CreateClientForm } from './create-client-form';

export function CreateClientButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <InteractiveOverlay
        title={'Create a Client'}
        description={
          'Create a new client to start managing them. Do not worry, you can always change the details later'
        }
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        form={<CreateClientForm />}
      />

      <Button
        onClick={() => {
          setIsOpen(true);
        }}
        className={btnStyles}
      >
        <PlusCircle className={btnIconStyles} />
        Create Group
      </Button>
    </>
  );
}
