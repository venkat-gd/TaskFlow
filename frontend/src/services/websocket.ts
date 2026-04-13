import { io, Socket } from 'socket.io-client';
import type { ApiLogEntry, CacheEvent, CeleryEvent, Task } from '@/types';

let socket: Socket | null = null;

interface WebSocketCallbacks {
  onApiLog?: (entry: ApiLogEntry) => void;
  onCacheEvent?: (event: CacheEvent) => void;
  onCeleryEvent?: (event: CeleryEvent) => void;
  onTaskUpdate?: (task: Task) => void;
}

export function connectWebSocket(callbacks: WebSocketCallbacks): Socket {
  if (socket?.connected) return socket;

  socket = io('/', {
    withCredentials: true,
    transports: ['websocket', 'polling'],
  });

  socket.on('api_log', (data: ApiLogEntry) => callbacks.onApiLog?.(data));
  socket.on('cache_event', (data: CacheEvent) => callbacks.onCacheEvent?.(data));
  socket.on('celery_event', (data: CeleryEvent) => callbacks.onCeleryEvent?.(data));
  socket.on('task_update', (data: Task) => callbacks.onTaskUpdate?.(data));

  return socket;
}

export function disconnectWebSocket(): void {
  socket?.disconnect();
  socket = null;
}
