'use client';

import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { btnIconStyles, btnStyles } from '@/styles/icons';
import { useBoardOverlayStore } from '@/store/boardOverlayStore';
import { ZustandInteractiveOverlay } from './zustand-intereactive-overlay';
import CreateEditBoardForm from './create-edit-board-form';

interface CreateEditBoardButtonProps {
  boardId: string | null | undefined;
  boardName: string | null | undefined;
  boardDescription: string | null | undefined;
  clientId: number | null | undefined;
}

export default function CreateEditBoardButton({
  boardId,
  boardName,
  boardDescription,
  clientId
}: CreateEditBoardButtonProps) {
  const { openBoardOverlay } = useBoardOverlayStore();

  const handleCreateOrEditBoard = () => {
    openBoardOverlay(boardId ? parseInt(boardId) : 0);
  };

  return (
    <>
      <ZustandInteractiveOverlay
        title={boardId ? 'Edit Project' : 'Create a Project'}
        description={
          boardId ? 'Edit an existing Project' : 'Create a new Project'
        }
        form={
          <CreateEditBoardForm
            boardId={boardId ?? undefined}
            boardName={boardName ?? undefined}
            boardDescription={boardDescription ?? undefined}
            clientId={clientId ? clientId.toString() : undefined}
          />
        }
      />

      <Button onClick={handleCreateOrEditBoard} className={btnStyles}>
        <PlusCircle className={btnIconStyles} />
        {boardId ? 'Edit Project' : 'Create Project'}
      </Button>
    </>
  );
}
