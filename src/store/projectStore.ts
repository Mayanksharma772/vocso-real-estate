import { create } from 'zustand';
import { Project, ScrapingProgress } from '@/types';

interface ProjectStore {
  projects: Project[];
  progress: ScrapingProgress;
  isLoading: boolean;
  error: string | null;

  // Actions
  setProjects: (projects: Project[]) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  setProgress: (progress: Partial<ScrapingProgress>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useProjectStore = create<ProjectStore>((set, get) => ({
  projects: [],
  progress: {
    total: 0,
    scraped: 0,
    geocoded: 0,
    status: 'idle'
  },
  isLoading: false,
  error: null,

  setProjects: (projects) => set({ projects }),

  addProject: (project) => set((state) => ({
    projects: [...state.projects, project]
  })),

  updateProject: (id, updates) => set((state) => ({
    projects: state.projects.map(project =>
      project.id === id ? { ...project, ...updates } : project
    )
  })),

  setProgress: (progress) => set((state) => ({
    progress: { ...state.progress, ...progress }
  })),

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),

  reset: () => set({
    projects: [],
    progress: {
      total: 0,
      scraped: 0,
      geocoded: 0,
      status: 'idle'
    },
    isLoading: false,
    error: null
  })
}));