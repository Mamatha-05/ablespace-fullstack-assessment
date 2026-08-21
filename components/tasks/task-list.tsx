'use client';

import * as React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PriorityBadge, StatusBadge } from '@/components/tasks/status-badges';
import type { Task } from '@/lib/types';
import { format, parseISO, isPast } from 'date-fns';

interface TaskListProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onTaskEdit: (task: Task) => void;
  onTaskDelete: (task: Task) => void;
}

export function TaskList({ tasks, onTaskClick, onTaskEdit, onTaskDelete }: TaskListProps) {
  return (
    <div className="overflow-hidden rounded-xl border">
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
              <th className="px-4 py-3 font-medium">Task</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Priority</th>
              <th className="hidden px-4 py-3 font-medium md:table-cell">Labels</th>
              <th className="hidden px-4 py-3 font-medium sm:table-cell">Due Date</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {tasks.map((task) => {
              const due = task.due_date ? parseISO(task.due_date) : null;
              const overdue = due && isPast(due) && task.status !== 'COMPLETED';
              return (
                <tr
                  key={task.id}
                  className="cursor-pointer transition-colors hover:bg-muted/40"
                  onClick={() => onTaskClick(task)}
                >
                  <td className="px-4 py-3">
                    <div className="font-medium">{task.title}</div>
                    {task.description && (
                      <div className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                        {task.description}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={task.status} />
                  </td>
                  <td className="px-4 py-3">
                    <PriorityBadge priority={task.priority} />
                  </td>
                  <td className="hidden px-4 py-3 md:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {task.labels.length === 0 ? (
                        <span className="text-xs text-muted-foreground">—</span>
                      ) : (
                        task.labels.map((l) => (
                          <Badge key={l} variant="secondary" className="text-[10px] font-normal">
                            {l}
                          </Badge>
                        ))
                      )}
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 sm:table-cell">
                    {due ? (
                      <span className={cn('text-xs', overdue && 'text-destructive font-medium')}>
                        {format(due, 'MMM d, yyyy')}
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-0.5">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        aria-label="Edit task"
                        onClick={(e) => {
                          e.stopPropagation();
                          onTaskEdit(task);
                        }}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        aria-label="Delete task"
                        onClick={(e) => {
                          e.stopPropagation();
                          onTaskDelete(task);
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
