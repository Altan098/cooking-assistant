import { createContext } from 'react';
import type { User } from '../../entities/user/types';
import type { LoginData, PasswordChangeData, RegisterData } from './api';

export type AuthStatus = 'loading' | 'authenticated' | 'anonymous';

export interface AuthContextValue {
  user: User | null;
  status: AuthStatus;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  changePassword: (data: PasswordChangeData) => Promise<void>;
  endSession: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
