import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type BoardStore = {
  currentBoardId: number | null;
  setCurrentBoardId: (id: number) => void;
};

export const useBoardStore = create<BoardStore>()(
  devtools(
    set => ({
      currentBoardId: null,
      setCurrentBoardId: id =>
        set({ currentBoardId: id }, false, 'setCurrentBoardId')
    }),
    {
      name: 'Board Store'
    }
  )
);
