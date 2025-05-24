import { AddGuestUser } from '@/db/schema';
import { create } from 'zustand';

interface GuestUserStore {
  isOpen: boolean;
  guestId: number | null;
  setIsOpen: (isOpen: boolean) => void;
  setGuestId: (guestId: number | null) => void;
  reset: () => void;
}

export const useGuestUserStore = create<GuestUserStore>(set => ({
  //initial state
  isOpen: false,
  guestId: null,

  setIsOpen: (isOpen: boolean) => set({ isOpen }),
  setGuestId: (guestId: number | null) => set({ guestId }),
  reset: () => set({ isOpen: false, guestId: null })
}));
