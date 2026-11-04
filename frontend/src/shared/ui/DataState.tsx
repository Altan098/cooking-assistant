import type { ReactNode } from 'react';
import { Alert, Box, Button, CircularProgress, Fade, Typography } from '@mui/material';
import { ApiError } from '../api/client';
import type { RequestState } from '../lib/useRequest';

interface Props<T> {
  request: RequestState<T>;
  isEmpty?: (data: T) => boolean;
  emptyText?: string;
  children: (data: T) => ReactNode;
}

function canRetry(error: Error) {
  return !(error instanceof ApiError) || error.status === 0 || error.status >= 500;
}

export default function DataState<T>({ request, isEmpty, emptyText, children }: Props<T>) {
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

  if (data === null) {
    return (
      <Box component="div" sx={{ display: 'flex', justifyContent: 'center', my: 6 }}>
        <CircularProgress aria-label="Загрузка" />
      </Box>
    );
  }

  if (isEmpty?.(data)) {
    return (
      <Fade in>
        <Typography color="text.secondary" sx={{ mt: 4, textAlign: 'center' }}>
          {emptyText}
        </Typography>
      </Fade>
    );
  }

  return <>{children(data)}</>;
}
