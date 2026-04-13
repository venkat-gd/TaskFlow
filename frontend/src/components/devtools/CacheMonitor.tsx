import { useDevToolsStore } from '@/store/devToolsStore';

export function CacheMonitor() {
  const { cacheEvents } = useDevToolsStore();

  const hits = cacheEvents.filter((e) => e.hit).length;
  const misses = cacheEvents.filter((e) => !e.hit && e.operation === 'get').length;
  const total = hits + misses;
  const hitRate = total > 0 ? Math.round((hits / total) * 100) : 0;

  return (
    <div className="text-xs font-mono">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mb-4 px-2">
        <div className="text-center">
          <p className="text-emerald-400 text-lg font-bold">{hits}</p>
          <p className="text-slate-500">Hits</p>
        </div>
        <div className="text-center">
          <p className="text-rose-400 text-lg font-bold">{misses}</p>
          <p className="text-slate-500">Misses</p>
        </div>
        <div className="text-center">
          <p className="text-primary-400 text-lg font-bold">{hitRate}%</p>
          <p className="text-slate-500">Hit Rate</p>
        </div>
      </div>

      {/* Hit rate bar */}
      <div className="mx-2 mb-4 h-2 bg-slate-700 rounded-full overflow-hidden">
        <div className="h-full bg-emerald-500 transition-all" style={{ width: `${hitRate}%` }} />
      </div>

      {/* Recent events */}
      <div className="space-y-1">
        {cacheEvents.slice(0, 20).map((event, i) => (
          <div key={i} className="flex items-center gap-2 px-2 py-1 rounded hover:bg-slate-800">
            <span className={event.hit ? 'text-emerald-400' : event.operation === 'invalidate' ? 'text-amber-400' : 'text-rose-400'}>
              {event.operation.toUpperCase()}
            </span>
            <span className="text-slate-400 truncate">{event.key}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
