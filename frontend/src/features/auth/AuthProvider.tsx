import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import {
  refreshSession,
  setAccessToken,
  setSessionExpiredHandler,
} from '../../shared/api/client';
import type { User } from '../../entities/user/types';
import { loginRequest, logoutRequest, registerRequest } from './api';
import type { AuthResponse, LoginData, RegisterData } from './api';
import { AuthContext } from './context';
import type { AuthStatus } from './context';

interface Props {
  children: ReactNode;
}

export default function AuthProvider({ children }: Props) {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatus>('loading');

  const startSession = useCallback((session: AuthResponse) => {
    setAccessToken(session.access_token);
    setUser(session.user);
    setStatus('authenticated');
  }, []);

  const clearSession = useCallback(() => {
    setAccessToken(null);
    setUser(null);
    setStatus('anonymous');
  }, []);

  useEffect(() => {
    setSessionExpiredHandler(clearSession);
    refreshSession<AuthResponse>().then(startSession).catch(clearSession);
    return () => setSessionExpiredHandler(null);
  }, [startSession, clearSession]);

  const value = useMemo(
    () => ({
      user,
      status,
      login: async (data: LoginData) => startSession(await loginRequest(data)),
      register: async (data: RegisterData) => startSession(await registerRequest(data)),
      logout: async () => {
        try {
          await logoutRequest();
        } finally {
          clearSession();
        }
      },
    }),
    [user, status, startSession, clearSession]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
