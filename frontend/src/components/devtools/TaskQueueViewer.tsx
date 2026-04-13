import { useDevToolsStore } from '@/store/devToolsStore';
import { cn } from '@/utils/classNames';

const statusColors: Record<string, string> = {
  pending: 'text-amber-400',
  running: 'text-blue-400',
  completed: 'text-emerald-400',
  failed: 'text-rose-400',
};

export function TaskQueueViewer() {
  const { celeryEvents } = useDevToolsStore();

  return (
    <div className="text-xs font-mono">
      {celeryEvents.length === 0 && (
        <p className="text-slate-500 text-center py-4">No queue events yet</p>
      )}
      <div className="space-y-1">
        {celeryEvents.map((event, i) => (
          <div key={i} className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-slate-800">
            <span className={cn('w-2 h-2 rounded-full', {
              'bg-amber-400': event.status === 'pending',
              'bg-blue-400 animate-pulse': event.status === 'running',
              'bg-emerald-400': event.status === 'completed',
              'bg-rose-400': event.status === 'failed',
            })} />
            <span className="text-slate-300 truncate flex-1">{event.name}</span>
            <span className={statusColors[event.status]}>{event.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
