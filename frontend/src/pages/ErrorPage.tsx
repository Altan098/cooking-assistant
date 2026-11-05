import { useEffect } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useRouteError } from 'react-router-dom';

export default function ErrorPage() {
  const error = useRouteError();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Box component="main" sx={{ textAlign: 'center', mt: 10, px: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Что-то пошло не так
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Попробуйте обновить страницу. Если приложение обновилось, это решит проблему.
      </Typography>
      <Button variant="contained" onClick={() => window.location.assign('/')}>
        Обновить
      </Button>
    </Box>
  );
}
