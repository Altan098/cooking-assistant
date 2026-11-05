import { useState } from 'react';
import { getErrorMessage } from '../../shared/api/client';
import { useRequest } from '../../shared/lib/useRequest';
import {
  createShoppingItem,
  deleteShoppingItem,
  getShoppingItems,
  updateShoppingItem,
} from './api';
import type { ShoppingItem } from './types';

export function useShoppingList() {
  const request = useRequest(getShoppingItems, []);
  const { setData } = request;
  const [actionError, setActionError] = useState<string | null>(null);

  const run = async (action: () => Promise<void>) => {
    setActionError(null);
    try {
      await action();
      return true;
    } catch (e) {
      setActionError(getErrorMessage(e));
      return false;
    }
  };

  const add = (name: string) =>
    run(async () => {
      const item = await createShoppingItem(name);
      setData((prev) => [...(prev ?? []), item]);
    });

  const toggle = (target: ShoppingItem) =>
    run(async () => {
      const updated = await updateShoppingItem(target.id, !target.done);
      setData((prev) => prev?.map((i) => (i.id === updated.id ? updated : i)) ?? null);
    });

  const remove = (id: number) =>
    run(async () => {
      await deleteShoppingItem(id);
      setData((prev) => prev?.filter((i) => i.id !== id) ?? null);
    });

  return { request, actionError, add, toggle, remove };
}
