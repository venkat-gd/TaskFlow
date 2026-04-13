import { create } from 'zustand';
import type { ApiLogEntry, CacheEvent, CeleryEvent } from '@/types';

const MAX_BUFFER = 50;

interface DevToolsState {
  apiLogs: ApiLogEntry[];
  cacheEvents: CacheEvent[];
  celeryEvents: CeleryEvent[];
  dbQueryCount: number;
  addApiLog: (entry: ApiLogEntry) => void;
  addCacheEvent: (event: CacheEvent) => void;
  addCeleryEvent: (event: CeleryEvent) => void;
  setDbQueryCount: (count: number) => void;
  clear: () => void;
}

export const useDevToolsStore = create<DevToolsState>((set) => ({
  apiLogs: [],
  cacheEvents: [],
  celeryEvents: [],
  dbQueryCount: 0,

  addApiLog: (entry) =>
    set((state) => ({
      apiLogs: [entry, ...state.apiLogs].slice(0, MAX_BUFFER),
    })),

  addCacheEvent: (event) =>
    set((state) => ({
      cacheEvents: [event, ...state.cacheEvents].slice(0, MAX_BUFFER),
    })),

  addCeleryEvent: (event) =>
    set((state) => ({
      celeryEvents: [event, ...state.celeryEvents].slice(0, MAX_BUFFER),
    })),

  setDbQueryCount: (count) => set({ dbQueryCount: count }),

  clear: () =>
    set({ apiLogs: [], cacheEvents: [], celeryEvents: [], dbQueryCount: 0 }),
}));
