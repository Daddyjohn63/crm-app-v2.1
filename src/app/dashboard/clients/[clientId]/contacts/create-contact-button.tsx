'use client';

import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { InteractiveOverlay } from '@/components/interactive-overlay';
import { useState } from 'react';

import { btnIconStyles, btnStyles } from '@/styles/icons';
import { User } from '@/db/schema';
import CreateEditContactForm from './create-edit-contact-form';
import { useParams } from 'next/navigation';
//type SimplifiedUser = Pick<User, 'id'>;
export default function CreateContactButton() {
  const { clientId } = useParams<{ clientId: string }>();

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <InteractiveOverlay
        title="Create a Contact"
        description="Create a new contact for the client"
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        form={<CreateEditContactForm clientId={parseInt(clientId, 10)} />}
      />

      <Button
        onClick={() => {
          setIsOpen(true);
        }}
        className={btnStyles}
      >
        <PlusCircle className={btnIconStyles} />
        Create Contact
      </Button>
    </>
  );
}
