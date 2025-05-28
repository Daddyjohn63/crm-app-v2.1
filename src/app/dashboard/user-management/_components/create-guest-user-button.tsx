'use client';
//this is the button that is used to create a new contact.
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { btnIconStyles, btnStyles } from '@/styles/icons';
import { useGuestUserStore } from '@/store/guestUser';

export default function CreateGuestUserButton() {
  const { setIsOpen, setGuestId } = useGuestUserStore();

  const handleCreateGuestUser = () => {
    setGuestId(null);
    setIsOpen(true);
  };

  return (
    <Button onClick={handleCreateGuestUser} className={btnStyles}>
      <PlusCircle className={btnIconStyles} />
      Create Guest User
    </Button>
  );
}
