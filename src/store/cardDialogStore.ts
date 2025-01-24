import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface CardDialogStore {
  isOpen: boolean;
  boardId: number | undefined;
  setIsOpen: (isOpen: boolean) => void;
  setBoardId: (id: number | null) => void;
  openCardDialog: (params: { boardId: number }) => void;
  reset: () => void;
}

export const useCardDialogStore = create<CardDialogStore>()(
  devtools(
    set => ({
      // initial state
      isOpen: false,
      boardId: undefined,

      // setters
      setIsOpen: isOpen => set({ isOpen }, false, 'setIsOpen'),
      setBoardId: id => set({ boardId: id ?? undefined }, false, 'setBoardId'),

      // convenience method for opening dialog
      openCardDialog: ({ boardId }) =>
        set(
          {
            isOpen: true,
            boardId
          },
          false,
          'openCardDialog'
        ),

      // reset function
      reset: () =>
        set(
          {
            isOpen: false,
            boardId: undefined
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
