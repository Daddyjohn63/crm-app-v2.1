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
import { CardWithProfile } from '@/use-cases/types';
import { useEffect, useState } from 'react';

interface CardModalProps {
  data: CardWithProfile; // Just use CardWithProfile
  cardId?: number;
}

export const EditCardModal = ({ data, cardId }: CardModalProps) => {
  const { isOpen, setIsOpen, openCardDialog } = useCardDialogStore();
  const currentBoardId = useBoardStore(state => state.currentBoardId);
  const [showDialog, setShowDialog] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleOpen = () => {
    if (!currentBoardId) return;
    openCardDialog({ boardId: currentBoardId });
    setShowDialog(true);
  };

  if (!mounted) return null;

  return (
    <div>
      <Button onClick={handleOpen} variant="ghost">
        <Pencil className="h-4 w-4 text-green-600 cursor-pointer hover:text-blue-700" />
      </Button>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Card</DialogTitle>
          </DialogHeader>
          {showDialog && (
            <CreateEditCardForm
              cardData={data} // Always pass data for editing
              listId={data.listId}
              listName=""
              onClose={() => setShowDialog(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
