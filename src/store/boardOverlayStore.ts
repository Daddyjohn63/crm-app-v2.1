import { create } from 'zustand';

interface BoardOverlayStore {
  isOpen: boolean;
  boardId: number | null;
  setIsOpen: (isOpen: boolean) => void;
  setBoardId: (id: number | null) => void;
  reset: () => void;
}

export const useBoardOverlayStore = create<BoardOverlayStore>(set => ({
  //initial state
  isOpen: false,
  boardId: null,

  //function that takes a boolean and sets the isOpen state to that value.
  setIsOpen: (isOpen: boolean) => set({ isOpen }),

  //function that takes an id and sets the contactId state to that value.
  setBoardId: id => {
    // console.log('Setting serviceId in store:', id);
    set({ boardId: id });
  },

  //function to reset the store to its initial state
  reset: () => set({ isOpen: false, boardId: null })
}));
