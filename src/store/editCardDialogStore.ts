import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface EditCardDialogStore {
  isOpen: boolean;
  boardId: number | null;
  listId: number | null;
  cardId: number | null;
  listName: string | null;
  setIsOpen: (isOpen: boolean) => void;
  setBoardId: (id: number | null) => void;
  setListId: (id: number | null) => void;
  setCardId: (id: number | null) => void;
  setListName: (name: string | null) => void;
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

      // Individual setters
      setIsOpen: isOpen =>
        set(
          state => ({
            ...state,
            isOpen
          }),
          false,
          'setIsOpen'
        ),

      setBoardId: id =>
        set(
          state => ({
            ...state,
            boardId: id
          }),
          false,
          'setBoardId'
        ),

      setListId: id =>
        set(
          state => ({
            ...state,
            listId: id
          }),
          false,
          'setListId'
        ),

      setCardId: id =>
        set(
          state => ({
            ...state,
            cardId: id
          }),
          false,
          'setCardId'
        ),

      setListName: name =>
        set(
          state => ({
            ...state,
            listName: name
          }),
          false,
          'setListName'
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
