import { create } from 'zustand';

interface ClientServiceOverlayStore {
  isOpen: boolean;
  clientId: number | null;
  setIsOpen: (isOpen: boolean) => void;
  setClientId: (id: number | null) => void;
  reset: () => void;
}

export const useClientServiceOverlayStore = create<ClientServiceOverlayStore>(
  set => ({
    //initial state
    isOpen: false,
    clientId: null,

    //function that takes a boolean and sets the isOpen state to that value.
    setIsOpen: (isOpen: boolean) => set({ isOpen }),

    //function that takes an id and sets the clientId state to that value.
    setClientId: id => {
      // console.log('Setting serviceId in store:', id);
      set({ clientId: id });
    },

    //function to reset the store to its initial state
    reset: () => set({ isOpen: false, clientId: null })
  })
);
