'use client';

import * as React from 'react';
import { Loader2, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/auth/auth-provider';

const FEATURES = [
  'Kanban board with drag-and-drop',
  'Full task CRUD with persistence',
  'Search, filters, and list view',
  'Light & dark theme',
];

export function GuestLogin() {
  const { signInAsGuest, loading } = useAuth();
  const [error, setError] = React.useState<string | null>(null);

  async function handleGuest() {
    setError(null);
    try {
      await signInAsGuest();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to start guest session.');
    }
  }

  return (
    <div className="min-h-screen w-full bg-background">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Left brand panel */}
        <div className="relative hidden flex-col justify-between overflow-hidden bg-primary p-12 text-primary-foreground lg:flex">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-foreground/15 font-bold">
              A
            </div>
            AbleSpace
          </div>
          <div className="space-y-6">
            <h1 className="text-4xl font-bold leading-tight tracking-tight">
              Task Management
              <br />
              built for teams.
            </h1>
            <p className="max-w-md text-primary-foreground/80">
              Plan, track, and ship work across your project. A focused workspace
              for the AbleSpace Full Stack Developer assessment.
            </p>
            <ul className="space-y-3">
              {FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm">
                  <CheckCircle2 className="h-5 w-5 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <p className="text-xs text-primary-foreground/60">
            Full Stack Developer (Fresher) — Technical Assessment
          </p>
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary-foreground/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-32 -left-16 h-72 w-72 rounded-full bg-primary-foreground/10 blur-2xl" />
        </div>

        {/* Right login panel */}
        <div className="flex items-center justify-center p-6 sm:p-12">
          <div className="w-full max-w-sm space-y-8">
            <div className="space-y-2 text-center lg:hidden">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-lg font-bold text-primary-foreground">
                A
              </div>
              <h1 className="text-xl font-semibold">AbleSpace</h1>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight">Welcome</h2>
              <p className="text-sm text-muted-foreground">
                Continue as a guest to explore the task workspace. No account or
                password required.
              </p>
            </div>

            <Button
              size="lg"
              className="w-full"
              onClick={handleGuest}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Starting session…
                </>
              ) : (
                <>
                  Continue as Guest
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>

            {error && (
              <p
                role="alert"
                className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive"
              >
                {error}
              </p>
            )}

            <p className="text-center text-xs text-muted-foreground">
              By continuing, you start a temporary guest session.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
