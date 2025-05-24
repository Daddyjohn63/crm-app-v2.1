import { create } from 'zustand';

type ViewState = {
  isActive: boolean;
  toggle: () => void;
  // setActive: (value: boolean) => void;
};

export const useBoardContentToggleStore = create<ViewState>(set => ({
  isActive: false,
  toggle: () => set(state => ({ isActive: !state.isActive }))
  // setActive: value => set({ isActive: value })
}));
