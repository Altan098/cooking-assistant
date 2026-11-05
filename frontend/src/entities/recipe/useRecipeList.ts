import { useState } from 'react';
import { getErrorMessage } from '../../shared/api/client';
import { useRequest } from '../../shared/lib/useRequest';
import { getRecipes } from './api';
import type { RecipeFilters } from './api';

export function useRecipeList({ ingredient, authorId }: RecipeFilters) {
  const request = useRequest(() => getRecipes({ ingredient, authorId }), [ingredient, authorId]);
  const { data, setData } = request;
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [loadMoreError, setLoadMoreError] = useState<string | null>(null);

  const loadMore = async () => {
    if (!data) return;
    setIsLoadingMore(true);
    setLoadMoreError(null);
    try {
      const next = await getRecipes({ ingredient, authorId, skip: data.items.length });
      setData((prev) => {
        if (!prev) return next;
        // Если пока листали, кто-то добавил рецепт, страницы сдвигаются: убираем повторы.
        const known = new Set(prev.items.map((r) => r.id));
        return { items: [...prev.items, ...next.items.filter((r) => !known.has(r.id))], total: next.total };
      });
    } catch (e) {
      setLoadMoreError(getErrorMessage(e));
    } finally {
      setIsLoadingMore(false);
    }
  };

  return { request, loadMore, isLoadingMore, loadMoreError };
}
