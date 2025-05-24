'use client';

//column actions are used to add actions to the columns in the table. This one is used to edit the contact. Once user clicks on horizontal dots, the edit contact form is presented.
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Edit, MoreHorizontal } from 'lucide-react';
import { useGuestUserStore } from '@/store/guestUser';

type Props = {
  id: number;
};
//receive the id from columns.tsx actions.
export default function ColumnActions({ id }: Props) {
  //started using Zustand here.
  const { setIsOpen, setGuestId } = useGuestUserStore();

  const handleEdit = () => {
    // console.log('Edit button clicked for id:', id);
    setGuestId(id);
    setIsOpen(true);
    // console.log('Zustand store updated:', useOverlayStore.getState());
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="size-8 p-0">
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            // disabled={false}
            // onClick={() => console.log('edit button ', id)}
            onClick={handleEdit}
          >
            <Edit className="size-4 mr-2" />
            Edit Guest User
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
