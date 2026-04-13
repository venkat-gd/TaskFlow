import { Card } from '@/components/ui/Card';
import type { Task } from '@/types';

interface StatsCardsProps {
  tasks: Task[];
}

export function StatsCards({ tasks }: StatsCardsProps) {
  const today = new Date().toISOString().split('T')[0];
  const total = tasks.length;
  const completedToday = tasks.filter(
    (t) => t.status === 'done' && t.updated_at.startsWith(today)
  ).length;
  const overdue = tasks.filter(
    (t) => t.due_date && t.due_date < new Date().toISOString() && t.status !== 'done'
  ).length;
  const completionRate = total > 0 ? Math.round((tasks.filter((t) => t.status === 'done').length / total) * 100) : 0;

  const stats = [
    { label: 'Total Tasks', value: total, color: 'text-primary-600' },
    { label: 'Completed Today', value: completedToday, color: 'text-emerald-600' },
    { label: 'Overdue', value: overdue, color: 'text-rose-600' },
    { label: 'Completion Rate', value: `${completionRate}%`, color: 'text-amber-600' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="text-center">
          <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{stat.label}</p>
        </Card>
      ))}
    </div>
  );
}
