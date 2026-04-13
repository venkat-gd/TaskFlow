import { useEffect } from 'react';
import { useTaskStore } from '@/store/taskStore';

export function useTasks() {
  const store = useTaskStore();

  useEffect(() => {
    store.fetchTasks();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return store;
}
