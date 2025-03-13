'use client';
//this store is very important as it sets the current board id for the board overlay store.
//this is used to open the board overlay when a board is clicked on the dashboard.
//it is availabel globally to all components in the dashboard.so we always have access to the current board id.
import { useBoardStore } from '@/store/boardStore';
import { useEffect } from 'react';

interface BoardStoreInitializerProps {
  boardId: number;
}

export function BoardStoreInitializer({ boardId }: BoardStoreInitializerProps) {
  const setCurrentBoardId = useBoardStore(state => state.setCurrentBoardId);

  useEffect(() => {
    setCurrentBoardId(boardId);
  }, [boardId, setCurrentBoardId]);

  return null;
}
