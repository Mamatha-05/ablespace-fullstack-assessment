'use client';

import * as React from 'react';
import { Pencil, Trash2, Calendar, User, Folder, Clock, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { PriorityBadge, StatusBadge } from '@/components/tasks/status-badges';
import type { Task, TaskPriority, TaskStatus } from '@/lib/types';
import { PRIORITIES, PRIORITY_LABELS, STATUSES, STATUS_LABELS } from '@/lib/types';
import { format, parseISO } from 'date-fns';

interface TaskDetailsProps {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  task: Task | null;
  onEdit: () => void;
  onDelete: () => void;
  onStatusChange: (id: string, status: TaskStatus) => Promise<void>;
  onPriorityChange: (id: string, priority: TaskPriority) => Promise<void>;
}

export function TaskDetails({
  open,
  onOpenChange,
  task,
  onEdit,
  onDelete,
  onStatusChange,
  onPriorityChange,
}: TaskDetailsProps) {
  const [busy, setBusy] = React.useState(false);

  if (!task) return null;

  const due = task.due_date ? parseISO(task.due_date) : null;
  const created = parseISO(task.created_at);
  const updated = parseISO(task.updated_at);

  async function changeStatus(s: TaskStatus) {
    if (!task || s === task.status) return;
    setBusy(true);
    try {
      await onStatusChange(task.id, s);
    } finally {
      setBusy(false);
    }
  }

  async function changePriority(p: TaskPriority) {
    if (!task || p === task.priority) return;
    setBusy(true);
    try {
      await onPriorityChange(task.id, p);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl">{task.title}</DialogTitle>
          <DialogDescription className="sr-only">Task details</DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          {task.description ? (
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{task.description}</p>
          ) : (
            <p className="text-sm text-muted-foreground italic">No description provided.</p>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select
                value={task.status}
                onValueChange={(v) => changeStatus(v as TaskStatus)}
                disabled={busy}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {STATUS_LABELS[s]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Priority</Label>
              <Select
                value={task.priority}
                onValueChange={(v) => changePriority(v as TaskPriority)}
                disabled={busy}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRIORITIES.map((p) => (
                    <SelectItem key={p} value={p}>
                      {PRIORITY_LABELS[p]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 rounded-lg border bg-muted/30 p-4 text-sm sm:grid-cols-2">
            <DetailRow icon={<Calendar className="h-4 w-4" />} label="Due Date">
              {due ? format(due, 'MMM d, yyyy') : '—'}
            </DetailRow>
            <DetailRow icon={<User className="h-4 w-4" />} label="Assignee">
              {task.assignee ?? '—'}
            </DetailRow>
            <DetailRow icon={<Folder className="h-4 w-4" />} label="Project">
              {task.project ?? '—'}
            </DetailRow>
            <DetailRow icon={<Clock className="h-4 w-4" />} label="Created">
              {format(created, 'MMM d, yyyy')}
            </DetailRow>
            <DetailRow icon={<Clock className="h-4 w-4" />} label="Updated">
              {format(updated, 'MMM d, yyyy')}
            </DetailRow>
            <div className="flex items-center gap-2">
              <StatusBadge status={task.status} />
              <PriorityBadge priority={task.priority} />
            </div>
          </div>

          {task.labels.length > 0 && (
            <div className="space-y-1.5">
              <Label>Labels</Label>
              <div className="flex flex-wrap gap-1.5">
                {task.labels.map((l) => (
                  <Badge key={l} variant="secondary" className="font-normal">
                    {l}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-between gap-2 pt-2">
            <Button variant="destructive" onClick={onDelete} disabled={busy}>
              {busy ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Trash2 className="mr-1.5 h-4 w-4" />}
              Delete
            </Button>
            <Button variant="outline" onClick={onEdit} disabled={busy}>
              <Pencil className="mr-1.5 h-4 w-4" />
              Edit
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{children}</p>;
}

function DetailRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {icon}
        {label}
      </div>
      <div className="mt-1">{children}</div>
    </div>
  );
}
