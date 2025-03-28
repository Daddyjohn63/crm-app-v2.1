'use client';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Edit, MoreHorizontal } from 'lucide-react';
import { useOverlayStore } from '@/store/overlayStore';

type Props = {
  id: number;
};
//receive the id from columns.tsx actions.
export default function ColumnActions({ id }: Props) {
  //started using Zustand here.
  const { setIsOpen, setContactId } = useOverlayStore();

  const handleEdit = () => {
    // console.log('Edit button clicked for id:', id);
    setContactId(id);
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
            Edit Contact
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
