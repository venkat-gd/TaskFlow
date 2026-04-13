import { Badge } from '@/components/ui/Badge';
import type { Task } from '@/types';
import { formatDate } from '@/utils/validators';

interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export function TaskList({ tasks, onEdit, onDelete }: TaskListProps) {
  if (tasks.length === 0) {
    return <p className="text-center text-slate-400 py-8">No tasks found</p>;
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 divide-y divide-slate-200 dark:divide-slate-700">
      {tasks.map((task) => (
        <div key={task.id} className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-750">
          <div className="flex items-center gap-3 min-w-0">
            <Badge variant={task.status === 'done' ? 'done' : task.status === 'in_progress' ? 'in-progress' : 'todo'}>
              {task.status.replace('_', ' ')}
            </Badge>
            <span className="truncate font-medium text-sm">{task.title}</span>
            <Badge variant={task.priority}>{task.priority}</Badge>
          </div>
          <div className="flex items-center gap-3 ml-4 shrink-0">
            {task.due_date && <span className="text-xs text-slate-400">{formatDate(task.due_date)}</span>}
            <button onClick={() => onEdit(task)} className="text-slate-400 hover:text-primary-500">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button onClick={() => onDelete(task.id)} className="text-slate-400 hover:text-red-500">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
