import { useDevToolsStore } from '@/store/devToolsStore';
import { cn } from '@/utils/classNames';

function latencyColor(ms: number): string {
  if (ms < 100) return 'text-emerald-400';
  if (ms < 300) return 'text-amber-400';
  return 'text-rose-400';
}

function statusColor(status: number): string {
  if (status < 300) return 'text-emerald-400';
  if (status < 400) return 'text-amber-400';
  return 'text-rose-400';
}

export function ApiLogger() {
  const { apiLogs } = useDevToolsStore();

  return (
    <div className="space-y-1 text-xs font-mono">
      {apiLogs.length === 0 && (
        <p className="text-slate-500 text-center py-4">No API calls yet</p>
      )}
      {apiLogs.map((log, i) => (
        <div key={i} className="flex items-center gap-2 px-2 py-1 rounded hover:bg-slate-800">
          <span className="text-primary-400 font-bold w-10 shrink-0">{log.method}</span>
          <span className="text-slate-300 truncate flex-1">{log.path}</span>
          <span className={cn('w-8 text-right', statusColor(log.status))}>{log.status}</span>
          <span className={cn('w-14 text-right', latencyColor(log.duration_ms))}>
            {log.duration_ms.toFixed(0)}ms
          </span>
          {log.cache_hit !== null && (
            <span className={log.cache_hit ? 'text-emerald-400' : 'text-slate-500'}>
              {log.cache_hit ? 'HIT' : 'MISS'}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
