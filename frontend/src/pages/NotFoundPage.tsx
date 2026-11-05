import { Box, Button, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useDocumentTitle } from '../shared/lib/useDocumentTitle';

export default function NotFoundPage() {
  useDocumentTitle('Страница не найдена');

  return (
    <Box component="div" sx={{ textAlign: 'center', my: { xs: 6, md: 10 } }}>
      <Typography
        variant="h1"
        color="primary"
        sx={{ fontSize: { xs: '5rem', md: '8rem' }, lineHeight: 1 }}
      >
        404
      </Typography>
      <Typography variant="h4" component="h1" sx={{ mt: 2, mb: 1 }}>
        Это блюдо ещё не придумали
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 4 }}>
        Такой страницы нет. Возможно, ссылка устарела.
      </Typography>
      <Button variant="contained" component={RouterLink} to="/">
        На главную
      </Button>
    </Box>
  );
}
