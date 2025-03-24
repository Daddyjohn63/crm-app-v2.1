'use client';

import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { btnIconStyles, btnStyles } from '@/styles/icons';
import { useOverlayStore } from '@/store/overlayStore';

export default function CreateContactButton() {
  const { setIsOpen, setContactId } = useOverlayStore();

  const handleCreateContact = () => {
    setContactId(null);
    setIsOpen(true);
  };

  return (
    <Button onClick={handleCreateContact} className={btnStyles}>
      <PlusCircle className={btnIconStyles} />
      Create Contact
    </Button>
  );
}
