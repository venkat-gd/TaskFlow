import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from '@/components/ui/Card';
import type { Task } from '@/types';

interface ChartsProps {
  tasks: Task[];
}

export function Charts({ tasks }: ChartsProps) {
  // Build last 7 days data
  const days: { date: string; completed: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const label = d.toLocaleDateString('en-US', { weekday: 'short' });
    const completed = tasks.filter(
      (t) => t.status === 'done' && t.updated_at.startsWith(dateStr)
    ).length;
    days.push({ date: label, completed });
  }

  return (
    <Card>
      <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
        Completed This Week
      </h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={days}>
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
          <Tooltip />
          <Bar dataKey="completed" fill="#4F46E5" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
