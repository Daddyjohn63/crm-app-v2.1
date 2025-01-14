/**
 * CardModal Component
 * Renders an "Add Card" button and manages the card creation dialog.
 * When clicked, it sets up the necessary context (listId and boardId) for the CardForm.
 */
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
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

interface CardModalProps {
  // List data passed down from ListItem component
  // Contains the list's ID and other properties needed for card creation
  data: ListWithCards;
}

export const CardModal = ({ data }: CardModalProps) => {
  // Get dialog state and controls directly from Zustand store
  const { isOpen, setIsOpen, setListId, setBoardId } = useCardDialogStore();

  // Get the current board ID from the board store
  const currentBoardId = useBoardStore(state => state.currentBoardId);

  const handleAddCard = () => {
    // Ensure we have a valid board ID before proceeding
    if (!currentBoardId) return;

    // Set up the state in the Zustand store:
    // - listId comes from the list data (data.id)
    // - boardId comes from the board store (currentBoardId)
    setListId(data.id);
    setBoardId(currentBoardId);
    // Open the dialog after setting up the state
    setIsOpen(true);
  };

  return (
    <div>
      <Button
        onClick={handleAddCard}
        variant="ghost"
        className="w-full justify-start text-muted-foreground font-normal h-auto p-2 rounded-none"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Card
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Card to {data.name}</DialogTitle>
          </DialogHeader>
          <CardForm />
        </DialogContent>
      </Dialog>
    </div>
  );
};
