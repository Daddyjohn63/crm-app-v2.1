'use client';

import { useBoardStore } from '@/store/boardStore';
import { useLayoutEffect } from 'react';

interface BoardStoreInitializerProps {
  boardId: number;
}

export function BoardStoreInitializer({ boardId }: BoardStoreInitializerProps) {
  const setCurrentBoardId = useBoardStore(state => state.setCurrentBoardId);

  useLayoutEffect(() => {
    setCurrentBoardId(boardId);
  }, [boardId, setCurrentBoardId]);

  return null;
}
