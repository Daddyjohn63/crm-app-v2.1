import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface CardDialogStore {
  isOpen: boolean;
  boardId: number | null;
  cardId: number | null;
  setIsOpen: (isOpen: boolean) => void;
  setBoardId: (id: number | null) => void;
  setCardId: (id: number | null) => void;
  openCardDialog: (params: { boardId: number; cardId: number }) => void;
  reset: () => void;
}

export const useCardDialogStore = create<CardDialogStore>()(
  devtools(
    set => ({
      // initial state
      isOpen: false,
      boardId: null,
      cardId: null,

      // setters
      setIsOpen: isOpen => set({ isOpen }, false, 'setIsOpen'),
      setBoardId: id => set({ boardId: id }, false, 'setBoardId'),
      setCardId: id => set({ cardId: id }, false, 'setCardId'),

      // convenience method for opening dialog
      openCardDialog: ({ boardId, cardId }) =>
        set(
          {
            isOpen: true,
            boardId,
            cardId
          },
          false,
          'openCardDialog'
        ),

      // reset function
      reset: () =>
        set(
          {
            isOpen: false,
            boardId: null,
            cardId: null
          },
          false,
          'reset'
        )
    }),
    {
      name: 'Card Dialog Store'
    }
  )
);
