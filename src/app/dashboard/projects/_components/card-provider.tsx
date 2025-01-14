'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useCardDialogStore } from '@/store/cardDialogStore';

type CardDialogContextType = {
  isOpen: boolean;
  boardId: number | null;
  listId: number | null;
  cardId: number | null;
  setIsOpen: (isOpen: boolean) => void;
  setListId: (id: number | null) => void;
  setCardId: (id: number | null) => void;
  setBoardId: (id: number | null) => void;
  reset: () => void;
};

const CardDialogContext = createContext<CardDialogContextType | undefined>(
  undefined
);

export function CardProvider({ children }: { children: ReactNode }) {
  const store = useCardDialogStore();

  return (
    <CardDialogContext.Provider value={store}>
      {children}
    </CardDialogContext.Provider>
  );
}

export function useCardDialog() {
  const context = useContext(CardDialogContext);
  if (context === undefined) {
    throw new Error('useCardDialog must be used within a CardDialogProvider');
  }
  return context;
}
