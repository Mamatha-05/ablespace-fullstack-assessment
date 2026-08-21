'use client';

import * as React from 'react';
import { AuthProvider, useAuth } from '@/components/auth/auth-provider';
import { GuestLogin } from '@/components/auth/guest-login';
import { Workspace } from '@/components/tasks/workspace';
import { LoadingState } from '@/components/tasks/states';

function Gate() {
  const { session, loading } = useAuth();

  if (loading) {
    return <LoadingState label="Starting session…" />;
  }

  if (!session) {
    return <GuestLogin />;
  }

  return <Workspace />;
}

export default function Home() {
  return (
    <AuthProvider>
      <Gate />
    </AuthProvider>
  );
}
