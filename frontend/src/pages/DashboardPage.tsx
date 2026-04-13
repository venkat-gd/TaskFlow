import { useState } from 'react';
import { useTasks } from '@/hooks/useTasks';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { Charts } from '@/components/dashboard/Charts';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export function DashboardPage() {
  const { tasks, createTask, isLoading } = useTasks();
  const [quickTitle, setQuickTitle] = useState('');

  const handleQuickAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;
    await createTask({ title: quickTitle.trim() });
    setQuickTitle('');
  };

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <StatsCards tasks={tasks} />

      {/* Quick add */}
      <form onSubmit={handleQuickAdd} className="flex gap-2">
        <Input
          placeholder="Quick add a task..."
          value={quickTitle}
          onChange={(e) => setQuickTitle(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" isLoading={isLoading}>Add</Button>
      </form>

      <div className="grid md:grid-cols-2 gap-6">
        <Charts tasks={tasks} />
        <ActivityFeed tasks={tasks} />
      </div>
    </div>
  );
}
