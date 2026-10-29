import { useState } from 'react';
import type { ShoppingItem } from './types';

export function useShoppingList(initial: ShoppingItem[] = []) {
  const [items, setItems] = useState<ShoppingItem[]>(initial);

  const add = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setItems((prev) => [...prev, { id: Date.now(), name: trimmed, done: false }]);
  };

  const toggle = (id: number) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, done: !i.done } : i))
    );
  };

  const remove = (id: number) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  return { items, add, toggle, remove };
}