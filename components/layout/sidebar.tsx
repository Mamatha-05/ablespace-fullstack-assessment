'use client';

import * as React from 'react';
import {
  LayoutGrid,
  List,
  CheckCircle2,
  Circle,
  Clock,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { Task, TaskStatus } from '@/lib/types';
import { STATUS_LABELS, STATUSES } from '@/lib/types';

interface SidebarProps {
  tasks: Task[];
  view: 'board' | 'list';
  onViewChange: (v: 'board' | 'list') => void;
  statusFilter: TaskStatus | 'ALL';
  onStatusFilterChange: (s: TaskStatus | 'ALL') => void;
  onNavigate: (section: string) => void;
  activeSection: string;
}

const STATUS_ICONS: Record<TaskStatus, React.ReactNode> = {
  TODO: <Circle className="h-4 w-4 text-[hsl(var(--status-todo))]" />,
  IN_PROGRESS: <Clock className="h-4 w-4 text-[hsl(var(--status-progress))]" />,
  COMPLETED: (
    <CheckCircle2 className="h-4 w-4 text-[hsl(var(--status-completed))]" />
  ),
};

const NAV = [
  { id: 'workspace', label: 'Workspace' },
  { id: 'board', label: 'Board' },
  { id: 'list', label: 'All Tasks' },
];

export function Sidebar({
  tasks,
  view,
  onViewChange,
  statusFilter,
  onStatusFilterChange,
  onNavigate,
  activeSection,
}: SidebarProps) {
  const counts = React.useMemo(() => {
    const c: Record<TaskStatus, number> = { TODO: 0, IN_PROGRESS: 0, COMPLETED: 0 };
    for (const t of tasks) c[t.status]++;
    return c;
  }, [tasks]);

  return (
    <aside className="hidden h-full w-64 shrink-0 flex-col border-r bg-card lg:flex">
      <div className="flex h-16 items-center gap-2 border-b px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary font-bold text-primary-foreground">
          A
        </div>
        <span className="text-lg font-semibold">AbleSpace</span>
      </div>

      <nav className="px-3">
        <p className="px-3 pb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Navigation
        </p>
        <ul className="space-y-1">
          {NAV.map((item) => {
            const isActive =
              activeSection === item.id ||
              (item.id === 'board' && view === 'board' && activeSection === 'workspace') ||
              (item.id === 'list' && view === 'list' && activeSection === 'workspace');
            return (
              <li key={item.id}>
                <button
                  onClick={() => {
                    if (item.id === 'board') onViewChange('board');
                    if (item.id === 'list') onViewChange('list');
                    onNavigate(item.id);
                  }}
                  className={cn(
                    'flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-foreground/70 hover:bg-accent hover:text-foreground',
                  )}
                >
                  {item.id === 'board' && <LayoutGrid className="h-4 w-4" />}
                  {item.id === 'list' && <List className="h-4 w-4" />}
                  {item.id === 'workspace' && <LayoutGrid className="h-4 w-4" />}
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="mt-2 px-3">
        <p className="px-3 pb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Status
        </p>
        <ul className="space-y-1">
          <li>
            <button
              onClick={() => {
                onStatusFilterChange('ALL');
                onNavigate('workspace');
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
                  onStatusFilterChange('ALL');
                  onNavigate('workspace');
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
      </div>

      <div className="mt-auto p-4">
        <div className="rounded-lg border bg-muted/40 p-3 text-xs text-muted-foreground">
          <p className="font-medium text-foreground">AbleSpace Assessment</p>
          <p className="mt-1">Task Management System — guest demo.</p>
        </div>
      </div>
    </aside>
  );
}
