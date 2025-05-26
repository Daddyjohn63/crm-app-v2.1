import { AddGuestUser } from '@/db/schema/projects';
import { create } from 'zustand';

interface GuestUserStore {
  isOpen: boolean;
  guestId: number | null;
  guestUsers: AddGuestUser[];
  setGuestUsers: (users: AddGuestUser[]) => void;
  selectedGuestUserIds: number[];
  setSelectedGuestUserIds: (ids: number[]) => void;
  setIsOpen: (isOpen: boolean) => void;
  setGuestId: (guestId: number | null) => void;
  reset: () => void;
}

export const useGuestUserStore = create<GuestUserStore>(set => ({
  //initial state
  isOpen: false,
  guestId: null,
  guestUsers: [],
  selectedGuestUserIds: [],

  setGuestUsers: (users: AddGuestUser[]) => set({ guestUsers: users }),
  setSelectedGuestUserIds: (ids: number[]) =>
    set({ selectedGuestUserIds: ids }),
  setIsOpen: (isOpen: boolean) => set({ isOpen }),
  setGuestId: (guestId: number | null) => set({ guestId }),
  reset: () =>
    set({
      isOpen: false,
      guestId: null,
      guestUsers: [],
      selectedGuestUserIds: []
    })
}));
