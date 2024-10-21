import { create } from 'zustand';

interface ServiceOverlayStore {
  isOpen: boolean;
  serviceId: number | null;
  setIsOpen: (isOpen: boolean) => void;
  setServiceId: (id: number | null) => void;
  reset: () => void;
}

export const useServiceOverlayStore = create<ServiceOverlayStore>(set => ({
  //initial state
  isOpen: false,
  serviceId: null,

  //function that takes a boolean and sets the isOpen state to that value.
  setIsOpen: (isOpen: boolean) => set({ isOpen }),

  //function that takes an id and sets the contactId state to that value.
  setServiceId: id => {
    console.log('Setting serviceId in store:', id);
    set({ serviceId: id });
  },

  //function to reset the store to its initial state
  reset: () => set({ isOpen: false, serviceId: null })
}));
