'use client';

import { useBoardStore } from '@/store/boardStore';
import { useLayoutEffect } from 'react';

type BoardIdProviderProps = {
  boardId: number;
  children: React.ReactNode;
};

export const BoardIdProvider = ({
  boardId,
  children
}: BoardIdProviderProps) => {
  const setCurrentBoardId = useBoardStore(state => state.setCurrentBoardId);

  useLayoutEffect(() => {
    setCurrentBoardId(boardId);
  }, [boardId, setCurrentBoardId]);

  return <>{children}</>;
};
