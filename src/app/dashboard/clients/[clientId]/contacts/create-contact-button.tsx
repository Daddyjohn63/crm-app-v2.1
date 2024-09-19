'use client';

import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { ZustandInteractiveOverlay } from './zustand-interactive-overlay';
import { btnIconStyles, btnStyles } from '@/styles/icons';
import CreateEditContactForm from './create-edit-contact-form';
import { useOverlayStore } from '@/store/overlayStore';

export default function CreateContactButton() {
  const { setIsOpen, setContactId } = useOverlayStore();

  const handleCreateContact = () => {
    setContactId(null);
    setIsOpen(true);
  };

  return (
    <>
      <ZustandInteractiveOverlay
        title="Create a Contact"
        description="Create a new contact for the client"
        form={<CreateEditContactForm />}
      />

      <Button onClick={handleCreateContact} className={btnStyles}>
        <PlusCircle className={btnIconStyles} />
        Create Contact
      </Button>
    </>
  );
}
