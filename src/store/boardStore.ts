import { create } from 'zustand';

type BoardStore = {
  currentBoardId: number | null;
  setCurrentBoardId: (id: number) => void;
};

export const useBoardStore = create<BoardStore>(set => ({
  currentBoardId: null,
  setCurrentBoardId: id => set({ currentBoardId: id })
}));
