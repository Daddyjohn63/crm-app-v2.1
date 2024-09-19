import { create } from 'zustand';

interface OverlayStore {
  isOpen: boolean;
  contactId: number | null;
  setIsOpen: (isOpen: boolean) => void;
  setContactId: (id: number | null) => void;
}

export const useOverlayStore = create<OverlayStore>(set => ({
  //initial state
  isOpen: false,
  contactId: null,

  //function that takes a boolean and sets the isOpen state to that value.
  setIsOpen: (isOpen: boolean) => set({ isOpen }),

  //function that takes an id and sets the contactId state to that value.
  setContactId: id => set({ contactId: id })
}));
