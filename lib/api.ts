import type { Task, TaskInput, GuestSession } from '@/lib/types';

// NEXT_PUBLIC_API_URL is used in deployed environments.
// During local development, default to the NestJS server so the app works
// immediately after `npm install` without requiring a manual .env.local file.
const NEST_API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === 'development' ? 'http://localhost:3001' : undefined);
const GUEST_SESSION_KEY = 'ablespace_guest_session';

function requireApiUrl(): string {
  if (!NEST_API_URL) {
    throw new Error('NEXT_PUBLIC_API_URL is not configured. Start the NestJS backend and configure the frontend environment.');
  }
  return NEST_API_URL.replace(/\/$/, '');
}

async function nestFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${requireApiUrl()}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options?.headers ?? {}) },
    ...options,
  });
  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      message = Array.isArray(body.message) ? body.message.join(', ') : body.message || body.error || message;
    } catch {
      // Keep the default message when the response is not JSON.
    }
    throw new Error(message);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export async function guestLogin(): Promise<GuestSession> {
  return nestFetch<GuestSession>('/auth/guest', { method: 'POST' });
}

export function saveGuestSession(session: GuestSession) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(GUEST_SESSION_KEY, JSON.stringify(session));
}

export function loadGuestSession(): GuestSession | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(GUEST_SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as GuestSession;
  } catch {
    return null;
  }
}

export function clearGuestSession() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(GUEST_SESSION_KEY);
}

export async function getTasks(): Promise<Task[]> {
  return nestFetch<Task[]>('/tasks');
}

export async function getTask(id: string): Promise<Task> {
  return nestFetch<Task>(`/tasks/${id}`);
}

export async function createTask(input: TaskInput): Promise<Task> {
  return nestFetch<Task>('/tasks', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function updateTask(id: string, input: Partial<TaskInput>): Promise<Task> {
  return nestFetch<Task>(`/tasks/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}

export async function deleteTask(id: string): Promise<void> {
  await nestFetch<void>(`/tasks/${id}`, { method: 'DELETE' });
}
