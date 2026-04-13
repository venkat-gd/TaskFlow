import { create } from 'zustand';
import type { Task, PaginationMeta } from '@/types';
import * as taskService from '@/services/tasks';

interface TaskFilters {
  status?: string;
  priority?: string;
  search?: string;
  sort_by?: string;
  order?: string;
  page?: number;
  per_page?: number;
}

interface TaskState {
  tasks: Task[];
  pagination: PaginationMeta | null;
  filters: TaskFilters;
  isLoading: boolean;
  error: string | null;
  fetchTasks: (filters?: TaskFilters) => Promise<void>;
  createTask: (task: Partial<Task>) => Promise<Task>;
  updateTask: (id: string, task: Partial<Task>) => Promise<void>;
  patchTask: (id: string, fields: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  setFilters: (filters: TaskFilters) => void;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  pagination: null,
  filters: {},
  isLoading: false,
  error: null,

  fetchTasks: async (filters) => {
    const activeFilters = filters ?? get().filters;
    set({ isLoading: true, error: null, filters: activeFilters });
    try {
      const { tasks, pagination } = await taskService.fetchTasks(activeFilters);
      set({ tasks, pagination, isLoading: false });
    } catch {
      set({ error: 'Failed to fetch tasks', isLoading: false });
    }
  },

  createTask: async (task) => {
    const created = await taskService.createTask(task);
    // Optimistic: prepend to list
    set((state) => ({ tasks: [created, ...state.tasks] }));
    return created;
  },

  updateTask: async (id, task) => {
    const updated = await taskService.updateTask(id, task);
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? updated : t)),
    }));
  },

  patchTask: async (id, fields) => {
    // Optimistic update
    const prev = get().tasks;
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...fields } : t)),
    }));
    try {
      const updated = await taskService.patchTask(id, fields);
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === id ? updated : t)),
      }));
    } catch {
      // Rollback
      set({ tasks: prev, error: 'Failed to update task' });
    }
  },

  deleteTask: async (id) => {
    const prev = get().tasks;
    set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) }));
    try {
      await taskService.deleteTask(id);
    } catch {
      set({ tasks: prev, error: 'Failed to delete task' });
    }
  },

  setFilters: (filters) => set({ filters }),
}));
