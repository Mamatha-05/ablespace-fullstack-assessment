'use client';

import * as React from 'react';
import { Plus, CheckCircle2, Circle, Clock, LayoutGrid } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import type { Task, TaskStatus } from '@/lib/types';
import { STATUS_LABELS, STATUSES } from '@/lib/types';

interface MobileNavigationProps {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  tasks: Task[];
  statusFilter: TaskStatus | 'ALL';
  onStatusFilterChange: (s: TaskStatus | 'ALL') => void;
  onNewTask: () => void;
}

const STATUS_ICONS: Record<TaskStatus, React.ReactNode> = {
  TODO: <Circle className="h-4 w-4 text-[hsl(var(--status-todo))]" />,
  IN_PROGRESS: <Clock className="h-4 w-4 text-[hsl(var(--status-progress))]" />,
  COMPLETED: (
    <CheckCircle2 className="h-4 w-4 text-[hsl(var(--status-completed))]" />
  ),
};

export function MobileNavigation({
  open,
  onOpenChange,
  tasks,
  statusFilter,
  onStatusFilterChange,
  onNewTask,
}: MobileNavigationProps) {
  const counts = React.useMemo(() => {
    const c: Record<TaskStatus, number> = { TODO: 0, IN_PROGRESS: 0, COMPLETED: 0 };
    for (const t of tasks) c[t.status]++;
    return c;
  }, [tasks]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-72 p-0">
        <SheetHeader className="h-16 border-b px-4 text-left">
          <SheetTitle className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary font-bold text-primary-foreground">
              A
            </div>
            AbleSpace
          </SheetTitle>
        </SheetHeader>
        <div className="p-4">
          <Button
            className="w-full justify-start"
            onClick={() => {
              onOpenChange(false);
              onNewTask();
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            New Task
          </Button>
        </div>
        <nav className="px-4">
          <p className="px-2 pb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Status
          </p>
          <ul className="space-y-1">
            <li>
              <button
                onClick={() => {
                  onStatusFilterChange('ALL');
                  onOpenChange(false);
                }}
                className={cn(
                  'flex w-full items-center justify-between rounded-md px-3 py-2 text-sm transition-colors',
                  statusFilter === 'ALL'
                    ? 'bg-primary/10 text-primary'
                    : 'text-foreground/70 hover:bg-accent hover:text-foreground',
                )}
              >
                <span className="flex items-center gap-2">
                  <LayoutGrid className="h-4 w-4" />
                  All Tasks
                </span>
                <span className="text-xs text-muted-foreground">{tasks.length}</span>
              </button>
            </li>
            {STATUSES.map((s) => (
              <li key={s}>
                <button
                  onClick={() => {
                    onStatusFilterChange(s);
                    onOpenChange(false);
                  }}
                  className={cn(
                    'flex w-full items-center justify-between rounded-md px-3 py-2 text-sm transition-colors',
                    statusFilter === s
                      ? 'bg-primary/10 text-primary'
                      : 'text-foreground/70 hover:bg-accent hover:text-foreground',
                  )}
                >
                  <span className="flex items-center gap-2">
                    {STATUS_ICONS[s]}
                    {STATUS_LABELS[s]}
                  </span>
                  <span className="text-xs text-muted-foreground">{counts[s]}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
