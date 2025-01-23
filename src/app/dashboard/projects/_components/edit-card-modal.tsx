/**
 * EditCardModal Component
 * Renders a pencil icon that opens a dialog for editing an existing card.
 */
import { Pencil } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { useEditCardDialogStore } from '@/store/editCardDialogStore';
import { CardWithProfile } from '@/use-cases/types';
import { useBoardStore } from '@/store/boardStore';
import { EditCardForm } from './edit-card-form';
import { useEffect } from 'react';

interface EditCardModalProps {
  cardId: number;
}

export const EditCardModal = ({ cardId }: EditCardModalProps) => {
  const { isOpen, setIsOpen, openEditCardDialog } = useEditCardDialogStore();
  const currentBoardId = useBoardStore(state => state.currentBoardId);

  const handleEditCard = () => {
    if (!currentBoardId) return;

    openEditCardDialog({
      cardId,
      boardId: currentBoardId,
      listId: 0, // This will be set by the form when it loads the card data
      listName: '' // This will be set by the form when it loads the card data
    });
  };

  return (
    <div>
      <Pencil
        onClick={handleEditCard}
        className="h-4 w-4 text-blue-500 cursor-pointer hover:text-blue-700"
      />

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Card</DialogTitle>
          </DialogHeader>
          <EditCardForm />
        </DialogContent>
      </Dialog>
    </div>
  );
};
