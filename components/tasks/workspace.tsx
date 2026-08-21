'use client';

import * as React from 'react';
import { LayoutGrid, List as ListIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { MobileNavigation } from '@/components/layout/mobile-navigation';
import { FilterBar } from '@/components/filters/filter-bar';
import { TaskBoard } from '@/components/tasks/task-board';
import { TaskList } from '@/components/tasks/task-list';
import { TaskModal } from '@/components/tasks/task-modal';
import { TaskDetails } from '@/components/tasks/task-details';
import { ConfirmDelete } from '@/components/tasks/confirm-delete';
import {
  LoadingState,
  ErrorState,
  EmptyTasks,
  NoResults,
} from '@/components/tasks/states';
import { useTasks } from '@/hooks/use-tasks';
import { useToast } from '@/hooks/use-toast';
import type { Task, TaskInput, TaskPriority, TaskStatus } from '@/lib/types';

export function Workspace() {
  const { tasks, loading, error, refresh, addTask, editTask, removeTask } = useTasks();
  const { toast } = useToast();

  const [view, setView] = React.useState<'board' | 'list'>('board');
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<TaskStatus | 'ALL'>('ALL');
  const [priorityFilter, setPriorityFilter] = React.useState<TaskPriority | 'ALL'>('ALL');
  const [projectFilter, setProjectFilter] = React.useState<string>('ALL');
  const [activeSection, setActiveSection] = React.useState('workspace');
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false);

  const [modalOpen, setModalOpen] = React.useState(false);
  const [modalMode, setModalMode] = React.useState<'create' | 'edit'>('create');
  const [editingTask, setEditingTask] = React.useState<Task | null>(null);
  const [defaultStatus, setDefaultStatus] = React.useState<TaskStatus | undefined>(undefined);

  const [detailsOpen, setDetailsOpen] = React.useState(false);
  const [detailsTask, setDetailsTask] = React.useState<Task | null>(null);

  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [deletingTask, setDeletingTask] = React.useState<Task | null>(null);

  const projects = React.useMemo(() => {
    const set = new Set<string>();
    for (const t of tasks) if (t.project) set.add(t.project);
    return Array.from(set).sort();
  }, [tasks]);

  const hasActiveFilters =
    search !== '' ||
    statusFilter !== 'ALL' ||
    priorityFilter !== 'ALL' ||
    projectFilter !== 'ALL';

  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    return tasks.filter((t) => {
      if (statusFilter !== 'ALL' && t.status !== statusFilter) return false;
      if (priorityFilter !== 'ALL' && t.priority !== priorityFilter) return false;
      if (projectFilter !== 'ALL' && t.project !== projectFilter) return false;
      if (q) {
        const hay = `${t.title} ${t.description ?? ''} ${t.labels.join(' ')}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [tasks, search, statusFilter, priorityFilter, projectFilter]);

  const counts = React.useMemo(() => {
    const c = { total: tasks.length, TODO: 0, IN_PROGRESS: 0, COMPLETED: 0 };
    for (const t of tasks) c[t.status]++;
    return c;
  }, [tasks]);

  function openCreate(status?: TaskStatus) {
    setModalMode('create');
    setEditingTask(null);
    setDefaultStatus(status);
    setModalOpen(true);
  }

  function openEdit(task: Task) {
    setModalMode('edit');
    setEditingTask(task);
    setModalOpen(true);
    setDetailsOpen(false);
  }

  function openDetails(task: Task) {
    setDetailsTask(task);
    setDetailsOpen(true);
  }

  function openDelete(task: Task) {
    setDeletingTask(task);
    setDeleteOpen(true);
    setDetailsOpen(false);
  }

  async function handleSubmit(input: TaskInput) {
    try {
      if (modalMode === 'edit' && editingTask) {
        await editTask(editingTask.id, input);
        toast({ title: 'Task updated', description: 'Changes saved successfully.' });
      } else {
        await addTask(input);
        toast({ title: 'Task created', description: 'New task added to the board.' });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Operation failed.';
      toast({ title: 'Error', description: msg, variant: 'destructive' });
      throw err;
    }
  }

  async function handleStatusChange(id: string, status: TaskStatus) {
    try {
      await editTask(id, { status });
      if (detailsTask?.id === id) setDetailsTask((t) => (t ? { ...t, status } : t));
      toast({ title: 'Status updated', description: `Moved to ${status.replace('_', ' ')}.` });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to update status.';
      toast({ title: 'Error', description: msg, variant: 'destructive' });
      throw err;
    }
  }

  async function handlePriorityChange(id: string, priority: TaskPriority) {
    try {
      await editTask(id, { priority });
      if (detailsTask?.id === id) setDetailsTask((t) => (t ? { ...t, priority } : t));
      toast({ title: 'Priority updated', description: `Set to ${priority}.` });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to update priority.';
      toast({ title: 'Error', description: msg, variant: 'destructive' });
      throw err;
    }
  }

  async function handleDelete() {
    if (!deletingTask) return;
    try {
      await removeTask(deletingTask.id);
      toast({ title: 'Task deleted', description: 'The task has been removed.' });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to delete task.';
      toast({ title: 'Error', description: msg, variant: 'destructive' });
      throw err;
    }
  }

  function clearFilters() {
    setSearch('');
    setStatusFilter('ALL');
    setPriorityFilter('ALL');
    setProjectFilter('ALL');
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar
        tasks={tasks}
        view={view}
        onViewChange={setView}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        onNavigate={setActiveSection}
        activeSection={activeSection}
      />

      <MobileNavigation
        open={mobileNavOpen}
        onOpenChange={setMobileNavOpen}
        tasks={tasks}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        onNewTask={() => openCreate()}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Header
          search={search}
          onSearchChange={setSearch}
          onNewTask={() => openCreate()}
          onOpenMobileNav={() => setMobileNavOpen(true)}
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 scrollbar-thin">
          <div className="mx-auto max-w-7xl space-y-6">
            {/* Page title + summary */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Workspace</h1>
                <p className="text-sm text-muted-foreground">
                  Manage and track your project tasks.
                </p>
              </div>
              <div className="grid grid-cols-4 gap-2 sm:gap-3">
                <SummaryCard label="Total" value={counts.total} />
                <SummaryCard label="To Do" value={counts.TODO} tone="todo" />
                <SummaryCard label="In Progress" value={counts.IN_PROGRESS} tone="progress" />
                <SummaryCard label="Completed" value={counts.COMPLETED} tone="completed" />
              </div>
            </div>

            {/* Controls row */}
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <Tabs value={view} onValueChange={(v) => setView(v as 'board' | 'list')}>
                <TabsList>
                  <TabsTrigger value="board" className="gap-1.5">
                    <LayoutGrid className="h-4 w-4" />
                    Board
                  </TabsTrigger>
                  <TabsTrigger value="list" className="gap-1.5">
                    <ListIcon className="h-4 w-4" />
                    List
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              <FilterBar
                statusFilter={statusFilter}
                priorityFilter={priorityFilter}
                projectFilter={projectFilter}
                projects={projects}
                onStatusChange={setStatusFilter}
                onPriorityChange={setPriorityFilter}
                onProjectChange={setProjectFilter}
                onClear={clearFilters}
                hasActiveFilters={hasActiveFilters}
              />
            </div>

            {/* Content */}
            {loading ? (
              <LoadingState />
            ) : error ? (
              <ErrorState message={error} onRetry={refresh} />
            ) : tasks.length === 0 ? (
              <EmptyTasks onCreate={() => openCreate()} />
            ) : filtered.length === 0 ? (
              <NoResults onClear={clearFilters} />
            ) : view === 'board' ? (
              <TaskBoard
                tasks={filtered}
                onTaskClick={openDetails}
                onTaskEdit={openEdit}
                onTaskDelete={openDelete}
                onStatusChange={handleStatusChange}
                onQuickAdd={(s) => openCreate(s)}
              />
            ) : (
              <TaskList
                tasks={filtered}
                onTaskClick={openDetails}
                onTaskEdit={openEdit}
                onTaskDelete={openDelete}
              />
            )}
          </div>
        </main>
      </div>

      <TaskModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        mode={modalMode}
        task={editingTask}
        defaultStatus={defaultStatus}
        onSubmit={handleSubmit}
      />

      <TaskDetails
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        task={detailsTask}
        onEdit={() => detailsTask && openEdit(detailsTask)}
        onDelete={() => detailsTask && openDelete(detailsTask)}
        onStatusChange={handleStatusChange}
        onPriorityChange={handlePriorityChange}
      />

      <ConfirmDelete
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDelete}
      />
    </div>
  );
}

function SummaryCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone?: 'todo' | 'progress' | 'completed';
}) {
  const toneClass =
    tone === 'todo'
      ? 'border-t-2 border-t-[hsl(var(--status-todo))]'
      : tone === 'progress'
        ? 'border-t-2 border-t-[hsl(var(--status-progress))]'
        : tone === 'completed'
          ? 'border-t-2 border-t-[hsl(var(--status-completed))]'
          : 'border-t-2 border-t-transparent';
  return (
    <div className={cn('min-w-[80px] rounded-lg border bg-card px-3 py-2 text-center', toneClass)}>
      <div className="text-xl font-bold leading-none">{value}</div>
      <div className="mt-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
    </div>
  );
}
