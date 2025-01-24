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

export const CardModal = ({ data, cardId }: CardModalProps) => {
  // console.log('CardModal - data:', data);
  // console.log('CardModal - cardId:', cardId);
  const { isOpen, setIsOpen, openCardDialog } = useCardDialogStore();
  const currentBoardId = useBoardStore(state => state.currentBoardId);
  const [showDialog, setShowDialog] = useState(false);
  const [mounted, setMounted] = useState(false); // Add mounted state

  // Handle hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleOpen = () => {
    if (!currentBoardId) return;
    openCardDialog({ boardId: currentBoardId });
    setShowDialog(true);
  };

  if (!mounted) return null; // Don't render anything until client-side

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

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{cardId ? 'Edit Card' : 'Add Card'}</DialogTitle>
          </DialogHeader>
          {showDialog && (
            <CreateEditCardForm
              cardData={cardId ? data : undefined}
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
