import { create } from 'zustand';

interface DocumentDialogStore {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const useDocumentDialogStore = create<DocumentDialogStore>()(set => ({
  isOpen: false,
  setIsOpen: (open: boolean) => set({ isOpen: open })
}));
