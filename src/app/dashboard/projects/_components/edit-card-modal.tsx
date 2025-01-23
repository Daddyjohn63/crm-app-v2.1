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
import { useCardDialogStore } from '@/store/cardDialogStore';
import { CardWithProfile } from '@/use-cases/types';
import { useBoardStore } from '@/store/boardStore';
import { EditCardForm } from './edit-card-form';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { CardForm } from './card-form';

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
      listId: 0,
      listName: ''
    });
  };

  return (
    <div>
      <Button onClick={handleEditCard} variant="ghost">
        <Pencil className="h-4 w-4 text-green-600 cursor-pointer hover:text-blue-700" />
      </Button>

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
