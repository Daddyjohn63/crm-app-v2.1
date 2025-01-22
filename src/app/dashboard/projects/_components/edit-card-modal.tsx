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

interface EditCardModalProps {
  listData: CardWithProfile;
  cardId: number;
  boardId: number;
}

export const EditCardModal = ({
  listData,
  boardId,
  cardId
}: EditCardModalProps) => {
  const { isOpen, setIsOpen, openEditCardDialog } = useEditCardDialogStore();
  const currentBoardId = useBoardStore(state => state.currentBoardId);

  const handleEditCard = () => {
    if (!currentBoardId) return;

    openEditCardDialog({
      listId: listData.id,
      boardId: currentBoardId,
      cardId: cardId,
      listName: listData.name
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
          <EditCardForm listData={listData} boardId={boardId} cardId={cardId} />
        </DialogContent>
      </Dialog>
    </div>
  );
};
