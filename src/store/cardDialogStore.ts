import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface CardDialogStore {
  isOpen: boolean;
  boardId: number | null;
  listId: number | null;
  cardId: number | null;
  listName: string | null;
  setIsOpen: (isOpen: boolean) => void;
  setListId: (id: number | null) => void;
  setCardId: (id: number | null) => void;
  setBoardId: (id: number | null) => void;
  setListName: (name: string | null) => void;
  openCardDialog: (params: {
    cardId: number;
    listId: number;
    boardId: number;
    listName: string;
  }) => void;
  reset: () => void;
}

export const useCardDialogStore = create<CardDialogStore>()(
  devtools(
    set => ({
      // initial state
      isOpen: false,
      boardId: null,
      listId: null,
      cardId: null,
      listName: null,

      // setters with state parameter where useful
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

      // New convenience method for opening dialog with all params
      openCardDialog: ({ cardId, listId, boardId, listName }) =>
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
          'openCardDialog'
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
      name: 'Card Dialog Store'
    }
  )
);
