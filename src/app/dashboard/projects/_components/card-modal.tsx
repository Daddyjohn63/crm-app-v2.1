/**
 * CardModal Component
 * Renders an "Add Card" button and manages the card creation dialog.
 * When clicked, it sets up the necessary context (listId and boardId) for the CardForm.
 */
import { Button } from '@/components/ui/button';
import { Plus, Pencil } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { useCardDialogStore } from '@/store/cardDialogStore';
import { CardForm } from './card-form';
import { ListWithCards } from '@/use-cases/types';
import { useBoardStore } from '@/store/boardStore';
import { CreateEditCardForm } from './create-edit-card-form';

interface CardModalProps {
  // List data passed down from ListItem component
  // Contains the list's ID and other properties needed for card creation
  data: ListWithCards;
  cardId?: number;
}

export const CardModal = ({ data, cardId }: CardModalProps) => {
  console.log('data in card modal', data);
  console.log('cardId in card modal', cardId);
  const { isOpen, setIsOpen, openCardDialog } = useCardDialogStore();
  const currentBoardId = useBoardStore(state => state.currentBoardId);

  const handleOpen = () => {
    if (!currentBoardId) return;

    openCardDialog({
      listId: data.id,
      boardId: currentBoardId,
      cardId: cardId || 0,
      listName: data.name
    });
  };

  return (
    <div>
      {cardId ? (
        <Button onClick={handleOpen} variant="ghost">
          <Pencil className="h-4 w-4 text-green-600 cursor-pointer hover:text-blue-700" />
        </Button>
      ) : (
        <Button
          onClick={handleOpen}
          variant="ghost"
          className="w-full justify-start text-muted-foreground font-normal h-auto p-2 rounded-none"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Card
        </Button>
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {cardId ? 'Edit Card' : `Add Card to ${data.name}`}
            </DialogTitle>
          </DialogHeader>
          <CreateEditCardForm cardId={cardId} />
        </DialogContent>
      </Dialog>
    </div>
  );
};
