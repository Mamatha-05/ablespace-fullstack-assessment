'use client';

import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import type { TaskPriority, TaskStatus } from '@/lib/types';
import { PRIORITY_LABELS, STATUS_LABELS } from '@/lib/types';

const PRIORITY_STYLES: Record<TaskPriority, string> = {
  LOW: 'bg-[hsl(var(--priority-low))]/10 text-[hsl(var(--priority-low))] border-[hsl(var(--priority-low))]/20',
  MEDIUM:
    'bg-[hsl(var(--priority-medium))]/10 text-[hsl(var(--priority-medium))] border-[hsl(var(--priority-medium))]/20',
  HIGH: 'bg-[hsl(var(--priority-high))]/10 text-[hsl(var(--priority-high))] border-[hsl(var(--priority-high))]/20',
};

const STATUS_STYLES: Record<TaskStatus, string> = {
  TODO: 'bg-[hsl(var(--status-todo))]/10 text-[hsl(var(--status-todo))] border-[hsl(var(--status-todo))]/20',
  IN_PROGRESS:
    'bg-[hsl(var(--status-progress))]/10 text-[hsl(var(--status-progress))] border-[hsl(var(--status-progress))]/20',
  COMPLETED:
    'bg-[hsl(var(--status-completed))]/10 text-[hsl(var(--status-completed))] border-[hsl(var(--status-completed))]/20',
};

export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  return (
    <Badge variant="outline" className={cn('font-medium', PRIORITY_STYLES[priority])}>
      {PRIORITY_LABELS[priority]}
    </Badge>
  );
}

export function StatusBadge({ status }: { status: TaskStatus }) {
  return (
    <Badge variant="outline" className={cn('font-medium', STATUS_STYLES[status])}>
      {STATUS_LABELS[status]}
    </Badge>
  );
}
