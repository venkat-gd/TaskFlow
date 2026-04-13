export interface User {
  id: string;
  email: string;
  username: string;
  created_at: string;
  updated_at: string;
}

export type TaskStatus = 'todo' | 'in_progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  due_date: string | null;
  position: number;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface PaginationMeta {
  page: number;
  per_page: number;
  total: number;
  pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    details: Record<string, string[]>;
  };
}

export interface ApiLogEntry {
  method: string;
  path: string;
  status: number;
  duration_ms: number;
  timestamp: string;
  cache_hit: boolean | null;
}

export interface CacheEvent {
  operation: 'get' | 'set' | 'invalidate';
  key: string;
  hit: boolean;
}

export interface CeleryEvent {
  task_id: string;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  started_at: string;
  completed_at: string | null;
}

export interface WebSocketEvent {
  type: 'api_log' | 'cache_event' | 'celery_event' | 'task_update';
  data: ApiLogEntry | CacheEvent | CeleryEvent | Task;
}
