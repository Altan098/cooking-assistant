import { useCallback, useEffect, useRef, useState } from 'react';
import type { DependencyList, Dispatch, SetStateAction } from 'react';
import { ApiError, getErrorMessage } from '../api/client';

export interface RequestState<T> {
  data: T | null;
  error: Error | null;
  loading: boolean;
  reload: () => void;
  setData: Dispatch<SetStateAction<T | null>>;
}

export function useRequest<T>(load: () => Promise<T>, deps: DependencyList): RequestState<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);
  const lastRequest = useRef(0);

  const reload = useCallback(() => {
    // Ответ на устаревший запрос (например, прошлый поиск) игнорируется.
    const requestId = ++lastRequest.current;
    setData(null);
    setError(null);
    setLoading(true);

    load()
      .then((result) => {
        if (requestId === lastRequest.current) setData(result);
      })
      .catch((e: unknown) => {
        // Ответы API — штатная ситуация, в консоль попадают только ошибки в коде.
        if (!(e instanceof ApiError)) console.error(e);
        if (requestId === lastRequest.current) {
          setError(e instanceof ApiError ? e : new Error(getErrorMessage(e)));
        }
      })
      .finally(() => {
        if (requestId === lastRequest.current) setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(reload, [reload]);

  return { data, error, loading, reload, setData };
}
