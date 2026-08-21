'use client';

import * as React from 'react';
import { getTasks, createTask, updateTask, deleteTask } from '@/lib/api';
import type { Task, TaskInput } from '@/lib/types';

export function useTasks() {
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const refresh = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tasks.');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    refresh();
  }, [refresh]);

  const addTask = React.useCallback(async (input: TaskInput) => {
    const created = await createTask(input);
    setTasks((prev) => [...prev, created]);
    return created;
  }, []);

  const editTask = React.useCallback(async (id: string, input: Partial<TaskInput>) => {
    const updated = await updateTask(id, input);
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    return updated;
  }, []);

  const removeTask = React.useCallback(async (id: string) => {
    await deleteTask(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { tasks, loading, error, refresh, addTask, editTask, removeTask };
}
