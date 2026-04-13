import { useEffect } from 'react';
import { connectWebSocket, disconnectWebSocket } from '@/services/websocket';
import { useDevToolsStore } from '@/store/devToolsStore';
import { useTaskStore } from '@/store/taskStore';

export function useWebSocket() {
  const addApiLog = useDevToolsStore((s) => s.addApiLog);
  const addCacheEvent = useDevToolsStore((s) => s.addCacheEvent);
  const addCeleryEvent = useDevToolsStore((s) => s.addCeleryEvent);
  const fetchTasks = useTaskStore((s) => s.fetchTasks);

  useEffect(() => {
    connectWebSocket({
      onApiLog: addApiLog,
      onCacheEvent: addCacheEvent,
      onCeleryEvent: addCeleryEvent,
      onTaskUpdate: () => fetchTasks(),
    });

    return () => disconnectWebSocket();
  }, [addApiLog, addCacheEvent, addCeleryEvent, fetchTasks]);
}
