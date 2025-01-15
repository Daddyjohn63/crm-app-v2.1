import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface BoardOverlayStore {
  isOpen: boolean;
  boardId: number | null;
  setIsOpen: (isOpen: boolean) => void;
  setBoardId: (id: number | null) => void;
  openBoardOverlay: (boardId: number) => void;
  reset: () => void;
}

export const useBoardOverlayStore = create<BoardOverlayStore>()(
  devtools(
    set => ({
      // initial state
      isOpen: false,
      boardId: null,

      // setters with state parameter
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

      // Convenience method for opening overlay
      openBoardOverlay: boardId =>
        set(
          state => ({
            ...state,
            isOpen: true,
            boardId
          }),
          false,
          'openBoardOverlay'
        ),

      // reset function
      reset: () =>
        set(
          state => ({
            ...state,
            isOpen: false,
            boardId: null
          }),
          false,
          'reset'
        )
    }),
    {
      name: 'Board Overlay Store'
    }
  )
);
