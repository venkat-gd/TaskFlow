import { useState } from 'react';
import { useUiStore } from '@/store/uiStore';
import { ApiLogger } from './ApiLogger';
import { CacheMonitor } from './CacheMonitor';
import { TaskQueueViewer } from './TaskQueueViewer';
import { DbQueryLog } from './DbQueryLog';
import { cn } from '@/utils/classNames';

const tabs = [
  { id: 'api', label: 'API Log' },
  { id: 'cache', label: 'Cache' },
  { id: 'queue', label: 'Queue' },
  { id: 'db', label: 'DB' },
] as const;

type TabId = (typeof tabs)[number]['id'];

export function BehindTheScenes() {
  const { devToolsOpen, toggleDevTools } = useUiStore();
  const [activeTab, setActiveTab] = useState<TabId>('api');

  if (!devToolsOpen) return null;

  return (
    <div className="fixed right-0 top-14 bottom-0 w-80 bg-slate-900 text-slate-100 border-l border-slate-700 z-40 flex flex-col animate-slide-in-right">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-slate-700">
        <h3 className="text-sm font-semibold text-slate-300">Behind the Scenes</h3>
        <button onClick={toggleDevTools} className="text-slate-500 hover:text-slate-300">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-700">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex-1 px-2 py-2 text-xs font-medium transition-colors',
              activeTab === tab.id
                ? 'text-primary-400 border-b-2 border-primary-400'
                : 'text-slate-500 hover:text-slate-300'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto py-2">
        {activeTab === 'api' && <ApiLogger />}
        {activeTab === 'cache' && <CacheMonitor />}
        {activeTab === 'queue' && <TaskQueueViewer />}
        {activeTab === 'db' && <DbQueryLog />}
      </div>
    </div>
  );
}
