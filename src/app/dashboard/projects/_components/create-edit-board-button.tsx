'use client';

import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { btnIconStyles, btnStyles } from '@/styles/icons';
import { useBoardOverlayStore } from '@/store/boardOverlayStore';
import { ZustandInteractiveOverlay } from './zustand-intereactive-overlay';
import CreateEditBoardForm from './create-edit-board-form';

interface CreateEditBoardButtonProps {
  boardId: string | null | undefined;
}

export default function CreateEditBoardButton({
  boardId
}: CreateEditBoardButtonProps) {
  const { setIsOpen, setBoardId } = useBoardOverlayStore();

  const handleCreateOrEditBoard = () => {
    if (boardId) {
      setBoardId(parseInt(boardId));
    } else {
      setBoardId(null);
    }
    setIsOpen(true);
  };

  return (
    <>
      <ZustandInteractiveOverlay
        title={boardId ? 'Edit Board' : 'Create a Board'}
        description={boardId ? 'Edit an existing Board' : 'Create a new Board'}
        form={<CreateEditBoardForm />}
      />

      <Button onClick={handleCreateOrEditBoard} className={btnStyles}>
        <PlusCircle className={btnIconStyles} />
        {boardId ? 'Edit Board' : 'Create Board'}
      </Button>
    </>
  );
}
