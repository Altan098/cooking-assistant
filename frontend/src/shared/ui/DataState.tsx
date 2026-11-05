import type { ReactNode } from 'react';
import { Alert, Button, Fade, Typography } from '@mui/material';
import { ApiError } from '../api/client';
import type { RequestState } from '../lib/useRequest';
import PageLoader from './PageLoader';

interface Props<T> {
  request: RequestState<T>;
  isEmpty?: (data: T) => boolean;
  emptyText?: string;
  loader?: ReactNode;
  children: (data: T) => ReactNode;
}

function canRetry(error: Error) {
  return !(error instanceof ApiError) || error.status === 0 || error.status >= 500;
}

export default function DataState<T>({ request, isEmpty, emptyText, loader, children }: Props<T>) {
  const { data, error, reload } = request;

  if (error) {
    return (
      <Alert
        severity="error"
        action={
          canRetry(error) ? (
            <Button color="inherit" size="small" onClick={reload}>
              Повторить
            </Button>
          ) : undefined
        }
      >
        {error.message}
      </Alert>
    );
  }

  if (data === null) return loader ?? <PageLoader />;

  if (isEmpty?.(data)) {
    return (
      <Fade in>
        <Typography color="text.secondary" sx={{ my: 6, textAlign: 'center' }}>
          {emptyText}
        </Typography>
      </Fade>
    );
  }

  return <>{children(data)}</>;
}
