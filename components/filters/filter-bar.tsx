'use client';

import * as React from 'react';
import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { TaskPriority, TaskStatus } from '@/lib/types';
import { PRIORITIES, PRIORITY_LABELS, STATUSES, STATUS_LABELS } from '@/lib/types';

interface FilterBarProps {
  statusFilter: TaskStatus | 'ALL';
  priorityFilter: TaskPriority | 'ALL';
  projectFilter: string;
  projects: string[];
  onStatusChange: (s: TaskStatus | 'ALL') => void;
  onPriorityChange: (p: TaskPriority | 'ALL') => void;
  onProjectChange: (p: string) => void;
  onClear: () => void;
  hasActiveFilters: boolean;
}

export function FilterBar({
  statusFilter,
  priorityFilter,
  projectFilter,
  projects,
  onStatusChange,
  onPriorityChange,
  onProjectChange,
  onClear,
  hasActiveFilters,
}: FilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
        <Filter className="h-4 w-4" />
        Filters
      </div>

      <Select value={statusFilter} onValueChange={(v) => onStatusChange(v as TaskStatus | 'ALL')}>
        <SelectTrigger className="h-9 w-[150px]" aria-label="Filter by status">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All Statuses</SelectItem>
          {STATUSES.map((s) => (
            <SelectItem key={s} value={s}>
              {STATUS_LABELS[s]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={priorityFilter}
        onValueChange={(v) => onPriorityChange(v as TaskPriority | 'ALL')}
      >
        <SelectTrigger className="h-9 w-[150px]" aria-label="Filter by priority">
          <SelectValue placeholder="Priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All Priorities</SelectItem>
          {PRIORITIES.map((p) => (
            <SelectItem key={p} value={p}>
              {PRIORITY_LABELS[p]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={projectFilter || 'ALL'} onValueChange={onProjectChange}>
        <SelectTrigger className="h-9 w-[170px]" aria-label="Filter by project">
          <SelectValue placeholder="Project" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All Projects</SelectItem>
          {projects.map((p) => (
            <SelectItem key={p} value={p}>
              {p}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={onClear} className="h-9">
          <X className="mr-1.5 h-3.5 w-3.5" />
          Clear
        </Button>
      )}
    </div>
  );
}
