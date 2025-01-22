import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface EditCardDialogStore {
  isOpen: boolean;
  boardId: number | null;
  listId: number | null;
  cardId: number | null;
  listName: string | null;
  setIsOpen: (isOpen: boolean) => void;
  openEditCardDialog: (params: {
    cardId: number;
    listId: number;
    boardId: number;
    listName: string;
  }) => void;
  reset: () => void;
}

export const useEditCardDialogStore = create<EditCardDialogStore>()(
  devtools(
    set => ({
      // initial state
      isOpen: false,
      boardId: null,
      listId: null,
      cardId: null,
      listName: null,

      // setters
      setIsOpen: isOpen =>
        set(
          state => ({
            ...state,
            isOpen
          }),
          false,
          'setIsOpen'
        ),

      // Convenience method for opening dialog
      openEditCardDialog: ({ cardId, listId, boardId, listName }) =>
        set(
          state => ({
            ...state,
            isOpen: true,
            cardId,
            listId,
            boardId,
            listName
          }),
          false,
          'openEditCardDialog'
        ),

      // reset function
      reset: () =>
        set(
          state => ({
            ...state,
            isOpen: false,
            boardId: null,
            listId: null,
            cardId: null,
            listName: null
          }),
          false,
          'reset'
        )
    }),
    {
      name: 'Edit Card Dialog Store'
    }
  )
);
