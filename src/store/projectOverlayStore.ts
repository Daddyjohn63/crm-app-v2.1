import { create } from 'zustand';

interface ProjectOverlayStore {
  isOpen: boolean;
  projectId: number | null;
  setIsOpen: (isOpen: boolean) => void;
  setProjectId: (id: number | null) => void;
  reset: () => void;
}

export const useProjectOverlayStore = create<ProjectOverlayStore>(set => ({
  //initial state
  isOpen: false,
  projectId: null,

  //function that takes a boolean and sets the isOpen state to that value.
  setIsOpen: (isOpen: boolean) => set({ isOpen }),

  //function that takes an id and sets the contactId state to that value.
  setProjectId: id => {
    // console.log('Setting serviceId in store:', id);
    set({ projectId: id });
  },

  //function to reset the store to its initial state
  reset: () => set({ isOpen: false, projectId: null })
}));
