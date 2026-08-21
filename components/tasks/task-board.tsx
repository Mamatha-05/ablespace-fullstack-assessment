'use client';

import * as React from 'react';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { TaskCard } from '@/components/tasks/task-card';
import type { Task, TaskStatus } from '@/lib/types';
import { STATUS_LABELS, STATUSES } from '@/lib/types';

interface TaskBoardProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onTaskEdit: (task: Task) => void;
  onTaskDelete: (task: Task) => void;
  onStatusChange: (id: string, status: TaskStatus) => void;
  onQuickAdd: (status: TaskStatus) => void;
}

const COLUMN_ACCENT: Record<TaskStatus, string> = {
  TODO: 'border-t-[hsl(var(--status-todo))]',
  IN_PROGRESS: 'border-t-[hsl(var(--status-progress))]',
  COMPLETED: 'border-t-[hsl(var(--status-completed))]',
};

export function TaskBoard({
  tasks,
  onTaskClick,
  onTaskEdit,
  onTaskDelete,
  onStatusChange,
  onQuickAdd,
}: TaskBoardProps) {
  const [dragId, setDragId] = React.useState<string | null>(null);
  const [dragOver, setDragOver] = React.useState<TaskStatus | null>(null);

  const byStatus = React.useMemo(() => {
    const map: Record<TaskStatus, Task[]> = {
      TODO: [],
      IN_PROGRESS: [],
      COMPLETED: [],
    };
    for (const t of tasks) map[t.status].push(t);
    return map;
  }, [tasks]);

  function handleDrop(status: TaskStatus) {
    if (dragId) {
      const task = tasks.find((t) => t.id === dragId);
      if (task && task.status !== status) {
        onStatusChange(dragId, status);
      }
    }
    setDragId(null);
    setDragOver(null);
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {STATUSES.map((status) => (
        <div
          key={status}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(status);
          }}
          onDragLeave={() => setDragOver((s) => (s === status ? null : s))}
          onDrop={() => handleDrop(status)}
          className={cn(
            'flex flex-col rounded-xl border border-t-4 bg-muted/30 transition-colors',
            COLUMN_ACCENT[status],
            dragOver === status && 'border-primary bg-primary/5',
          )}
        >
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold">{STATUS_LABELS[status]}</h2>
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                {byStatus[status].length}
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              aria-label={`Add task to ${STATUS_LABELS[status]}`}
              onClick={() => onQuickAdd(status)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex-1 space-y-2 overflow-y-auto p-2 pt-0 scrollbar-thin min-h-[120px]">
            {byStatus[status].length === 0 ? (
              <div className="flex h-24 items-center justify-center rounded-lg border border-dashed text-xs text-muted-foreground">
                No tasks
              </div>
            ) : (
              byStatus[status].map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  draggable
                  onDragStart={() => setDragId(task.id)}
                  onDragEnd={() => {
                    setDragId(null);
                    setDragOver(null);
                  }}
                  onClick={() => onTaskClick(task)}
                  onEdit={() => onTaskEdit(task)}
                  onDelete={() => onTaskDelete(task)}
                />
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
