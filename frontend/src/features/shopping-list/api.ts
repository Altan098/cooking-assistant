import { api } from '../../shared/api/client';
import type { ShoppingItem } from './types';

export const getShoppingItems = () => api<ShoppingItem[]>('/shopping-list/');

export const createShoppingItem = (name: string) =>
  api<ShoppingItem>('/shopping-list/', { method: 'POST', body: { name } });

export const updateShoppingItem = (id: number, done: boolean) =>
  api<ShoppingItem>(`/shopping-list/${id}`, { method: 'PATCH', body: { done } });

export const deleteShoppingItem = (id: number) =>
  api<void>(`/shopping-list/${id}`, { method: 'DELETE' });
