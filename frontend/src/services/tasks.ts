import api from './api';
import type { Task, PaginationMeta } from '@/types';

interface TaskListResponse {
  tasks: Task[];
  pagination: PaginationMeta;
}

interface TaskFilters {
  status?: string;
  priority?: string;
  search?: string;
  sort_by?: string;
  order?: string;
  page?: number;
  per_page?: number;
}

export async function fetchTasks(filters: TaskFilters = {}): Promise<TaskListResponse> {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      params.set(key, String(value));
    }
  });
  const { data } = await api.get<TaskListResponse>(`/tasks?${params.toString()}`);
  return data;
}

export async function fetchTask(id: string): Promise<Task> {
  const { data } = await api.get<{ task: Task }>(`/tasks/${id}`);
  return data.task;
}

export async function createTask(task: Partial<Task>): Promise<Task> {
  const { data } = await api.post<{ task: Task }>('/tasks', task);
  return data.task;
}

export async function updateTask(id: string, task: Partial<Task>): Promise<Task> {
  const { data } = await api.put<{ task: Task }>(`/tasks/${id}`, task);
  return data.task;
}

export async function patchTask(id: string, fields: Partial<Task>): Promise<Task> {
  const { data } = await api.patch<{ task: Task }>(`/tasks/${id}`, fields);
  return data.task;
}

export async function deleteTask(id: string): Promise<void> {
  await api.delete(`/tasks/${id}`);
}
