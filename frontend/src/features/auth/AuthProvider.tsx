import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import {
  refreshSession,
  setAccessToken,
  setSessionExpiredHandler,
} from '../../shared/api/client';
import type { User } from '../../entities/user/types';
import { changePasswordRequest, loginRequest, logoutRequest, registerRequest } from './api';
import type { AuthResponse, LoginData, PasswordChangeData, RegisterData } from './api';
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

  const endSession = useCallback(() => {
    setAccessToken(null);
    setUser(null);
    setStatus('anonymous');
  }, []);

  useEffect(() => {
    setSessionExpiredHandler(endSession);
    refreshSession<AuthResponse>().then(startSession).catch(endSession);
    return () => setSessionExpiredHandler(null);
  }, [startSession, endSession]);

  const value = useMemo(
    () => ({
      user,
      status,
      login: async (data: LoginData) => startSession(await loginRequest(data)),
      register: async (data: RegisterData) => startSession(await registerRequest(data)),
      changePassword: async (data: PasswordChangeData) =>
        startSession(await changePasswordRequest(data)),
      logout: async () => {
        try {
          await logoutRequest();
        } finally {
          endSession();
        }
      },
      endSession,
    }),
    [user, status, startSession, endSession]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
