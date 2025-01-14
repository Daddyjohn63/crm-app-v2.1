import { create } from 'zustand';

interface CardDialogStore {
  isOpen: boolean;
  boardId: number | null;
  listId: number | null;
  cardId: number | null;
  setIsOpen: (isOpen: boolean) => void;
  setListId: (id: number | null) => void;
  setCardId: (id: number | null) => void;
  setBoardId: (id: number | null) => void;
  reset: () => void;
}

export const useCardDialogStore = create<CardDialogStore>(set => ({
  // initial state
  isOpen: false,
  boardId: null,
  listId: null,
  cardId: null,

  // setters
  setIsOpen: (isOpen: boolean) => set({ isOpen }),
  setBoardId: id => set({ boardId: id }),
  setListId: id => set({ listId: id }),
  setCardId: id => set({ cardId: id }),

  // reset function
  reset: () =>
    set({
      isOpen: false,
      boardId: null,
      listId: null,
      cardId: null
    })
}));
