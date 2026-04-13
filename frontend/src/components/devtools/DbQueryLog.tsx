import { useDevToolsStore } from '@/store/devToolsStore';

export function DbQueryLog() {
  const { dbQueryCount, apiLogs } = useDevToolsStore();

  return (
    <div className="text-xs font-mono px-2">
      <div className="text-center mb-4">
        <p className="text-primary-400 text-2xl font-bold">{dbQueryCount}</p>
        <p className="text-slate-500">Total DB Queries</p>
      </div>
      <div className="space-y-1">
        <p className="text-slate-500 mb-2">Queries per request (estimated from API logs):</p>
        {apiLogs.slice(0, 15).map((log, i) => (
          <div key={i} className="flex items-center justify-between py-1">
            <span className="text-slate-400 truncate">{log.method} {log.path}</span>
            <span className="text-slate-300 ml-2">~{Math.ceil(log.duration_ms / 10)}q</span>
          </div>
        ))}
      </div>
    </div>
  );
}
