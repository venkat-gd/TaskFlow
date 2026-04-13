import { useState } from 'react';
import { useTasks } from '@/hooks/useTasks';
import { KanbanBoard } from '@/components/tasks/KanbanBoard';
import { TaskList } from '@/components/tasks/TaskList';
import { TaskFilters } from '@/components/tasks/TaskFilters';
import { TaskForm } from '@/components/tasks/TaskForm';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import type { Task, TaskStatus } from '@/types';

export function TasksPage() {
  const { tasks, createTask, patchTask, updateTask, deleteTask } = useTasks();
  const [view, setView] = useState<'kanban' | 'list'>('kanban');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleStatusChange = async (taskId: string, status: TaskStatus) => {
    await patchTask(taskId, { status });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this task?')) await deleteTask(id);
  };

  const handleCreate = async (data: Partial<Task>) => {
    await createTask(data);
    setShowCreateModal(false);
  };

  const handleUpdate = async (data: Partial<Task>) => {
    if (editingTask) {
      await updateTask(editingTask.id, { ...editingTask, ...data } as Partial<Task>);
      setEditingTask(null);
    }
  };

  // Client-side filtering (server-side also supported via fetchTasks)
  const filtered = tasks.filter((t) => {
    if (statusFilter && t.status !== statusFilter) return false;
    if (priorityFilter && t.priority !== priorityFilter) return false;
    if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="p-6 space-y-4 max-w-6xl mx-auto">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-bold">Tasks</h1>
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-200 dark:bg-slate-700 rounded-lg p-0.5">
            <button
              onClick={() => setView('kanban')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${view === 'kanban' ? 'bg-white dark:bg-slate-600 shadow-sm' : ''}`}
            >
              Board
            </button>
            <button
              onClick={() => setView('list')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${view === 'list' ? 'bg-white dark:bg-slate-600 shadow-sm' : ''}`}
            >
              List
            </button>
          </div>
          <Button onClick={() => setShowCreateModal(true)}>New Task</Button>
        </div>
      </div>

      <TaskFilters
        search={search}
        status={statusFilter}
        priority={priorityFilter}
        onSearchChange={setSearch}
        onStatusChange={setStatusFilter}
        onPriorityChange={setPriorityFilter}
      />

      {view === 'kanban' ? (
        <KanbanBoard tasks={filtered} onStatusChange={handleStatusChange} onEdit={setEditingTask} onDelete={handleDelete} />
      ) : (
        <TaskList tasks={filtered} onEdit={setEditingTask} onDelete={handleDelete} />
      )}

      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="New Task">
        <TaskForm onSubmit={handleCreate} onCancel={() => setShowCreateModal(false)} />
      </Modal>

      <Modal isOpen={!!editingTask} onClose={() => setEditingTask(null)} title="Edit Task">
        {editingTask && (
          <TaskForm initialData={editingTask} onSubmit={handleUpdate} onCancel={() => setEditingTask(null)} />
        )}
      </Modal>
    </div>
  );
}
