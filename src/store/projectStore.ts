import { create } from 'zustand';

type ProjectStore = {
  currentProjectId: number | null;
  setCurrentProjectId: (id: number) => void;
};

export const useProjectStore = create<ProjectStore>(set => ({
  currentProjectId: null,
  setCurrentProjectId: id => set({ currentProjectId: id })
}));
