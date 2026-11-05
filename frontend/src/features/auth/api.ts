import { api } from '../../shared/api/client';
import type { User } from '../../entities/user/types';

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData extends LoginData {
  username: string;
}

export interface PasswordChangeData {
  current_password: string;
  new_password: string;
}

export const loginRequest = (body: LoginData) =>
  api<AuthResponse>('/auth/login', { method: 'POST', body });

export const registerRequest = (body: RegisterData) =>
  api<AuthResponse>('/auth/register', { method: 'POST', body });

export const logoutRequest = () => api<void>('/auth/logout', { method: 'POST' });

export const changePasswordRequest = (body: PasswordChangeData) =>
  api<AuthResponse>('/auth/change-password', { method: 'POST', body });

export const deleteAccountRequest = (password: string) =>
  api<void>('/users/me', { method: 'DELETE', body: { password } });
