import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import type { Task } from '@/types';
import { formatDate } from '@/utils/validators';

interface ActivityFeedProps {
  tasks: Task[];
}

export function ActivityFeed({ tasks }: ActivityFeedProps) {
  const recent = [...tasks]
    .sort((a, b) => b.updated_at.localeCompare(a.updated_at))
    .slice(0, 10);

  return (
    <Card>
      <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Recent Activity</h3>
      <div className="space-y-3">
        {recent.length === 0 && (
          <p className="text-sm text-slate-400">No recent activity</p>
        )}
        {recent.map((task) => (
          <div key={task.id} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 min-w-0">
              <Badge variant={task.status === 'done' ? 'done' : task.status === 'in_progress' ? 'in-progress' : 'todo'}>
                {task.status.replace('_', ' ')}
              </Badge>
              <span className="truncate text-slate-700 dark:text-slate-300">{task.title}</span>
            </div>
            <span className="text-xs text-slate-400 ml-2 shrink-0">{formatDate(task.updated_at)}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
