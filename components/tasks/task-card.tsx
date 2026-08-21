'use client';

import * as React from 'react';
import { Calendar, GripVertical, Trash2, Pencil, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PriorityBadge, StatusBadge } from '@/components/tasks/status-badges';
import type { Task } from '@/lib/types';
import { format, parseISO, isPast } from 'date-fns';

interface TaskCardProps {
  task: Task;
  onClick: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
  onDragEnd?: (e: React.DragEvent) => void;
  compact?: boolean;
}

export function TaskCard({
  task,
  onClick,
  onEdit,
  onDelete,
  draggable = false,
  onDragStart,
  onDragEnd,
  compact = false,
}: TaskCardProps) {
  const due = task.due_date ? parseISO(task.due_date) : null;
  const overdue = due && isPast(due) && task.status !== 'COMPLETED';

  const stop = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <div
      role="button"
      tabIndex={0}
      draggable={draggable}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      className={cn(
        'group relative cursor-pointer rounded-lg border bg-card p-4 shadow-sm transition-all hover:shadow-md hover:border-primary/40 focus:outline-none focus:ring-2 focus:ring-ring',
        draggable && 'active:cursor-grabbing',
      )}
    >
      {draggable && (
        <div className="absolute left-1.5 top-1/2 hidden -translate-y-1/2 text-muted-foreground/40 group-hover:block">
          <GripVertical className="h-4 w-4" />
        </div>
      )}

      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-semibold leading-snug">{task.title}</h3>
        <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
          {onEdit && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              aria-label="Edit task"
              onClick={(e) => {
                stop(e);
                onEdit();
              }}
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
          )}
          {onDelete && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-destructive hover:text-destructive"
              aria-label="Delete task"
              onClick={(e) => {
                stop(e);
                onDelete();
              }}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </div>

      {!compact && task.description && (
        <p className="mt-1.5 line-clamp-2 text-xs text-muted-foreground">
          {task.description}
        </p>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <StatusBadge status={task.status} />
        <PriorityBadge priority={task.priority} />
      </div>

      {task.labels.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {task.labels.map((l) => (
            <Badge key={l} variant="secondary" className="text-[10px] font-normal">
              {l}
            </Badge>
          ))}
        </div>
      )}

      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
        {due ? (
          <span
            className={cn(
              'flex items-center gap-1',
              overdue && 'text-destructive font-medium',
            )}
          >
            <Calendar className="h-3.5 w-3.5" />
            {format(due, 'MMM d, yyyy')}
          </span>
        ) : (
          <span />
        )}
        {task.assignee && (
          <span className="flex items-center gap-1">
            <User className="h-3.5 w-3.5" />
            {task.assignee}
          </span>
        )}
      </div>
    </div>
  );
}
