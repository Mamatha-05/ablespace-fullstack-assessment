'use client';

import * as React from 'react';
import type { GuestSession } from '@/lib/types';
import {
  guestLogin,
  loadGuestSession,
  saveGuestSession,
  clearGuestSession,
} from '@/lib/api';

interface AuthContextValue {
  session: GuestSession | null;
  loading: boolean;
  signInAsGuest: () => Promise<void>;
  signOut: () => void;
}

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = React.useState<GuestSession | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setSession(loadGuestSession());
    setLoading(false);
  }, []);

  const signInAsGuest = React.useCallback(async () => {
    setLoading(true);
    try {
      const s = await guestLogin();
      saveGuestSession(s);
      setSession(s);
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = React.useCallback(() => {
    clearGuestSession();
    setSession(null);
  }, []);

  const value = React.useMemo(
    () => ({ session, loading, signInAsGuest, signOut }),
    [session, loading, signInAsGuest, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
