'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Edit, MoreHorizontal } from 'lucide-react';
import { useGuestUserStore } from '@/store/guestUser';

interface Props {
  id: number;
}

export default function GuestColumnActions({ id }: Props) {
  const { setIsOpen, setGuestId } = useGuestUserStore();

  const handleEdit = () => {
    setGuestId(id);
    setIsOpen(true);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="size-8 p-0">
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleEdit}>
          <Edit className="size-4 mr-2" />
          Edit Guest User
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

//column actions are used to add actions to the columns in the table. This one is used to edit the guest user. Once user clicks on horizontal dots, the create-edit-guest-form is presented.
