import { create } from 'zustand';

interface OverlayStore {
  isOpen: boolean;
  contactId: number | null;
  setIsOpen: (isOpen: boolean) => void;
  setContactId: (id: number | null) => void;
}

export const useOverlayStore = create<OverlayStore>(set => ({
  isOpen: false,
  contactId: null,
  setIsOpen: (isOpen: boolean) => set({ isOpen }),
  setContactId: id => set({ contactId: id })
}));
