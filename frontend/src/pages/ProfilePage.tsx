import { Box, Typography, Avatar, Paper, Stack } from '@mui/material';
import RecipeList from '../entities/recipe/ui/RecipeList';
import { ChangePasswordForm, DeleteAccountButton, useAuth } from '../features/auth';
import { useDocumentTitle } from '../shared/lib/useDocumentTitle';
import PageHeader from '../shared/ui/PageHeader';

export default function ProfilePage() {
  useDocumentTitle('Профиль');
  const { user } = useAuth();

  if (!user) return null;

  return (
    <Box component="div">
      <PageHeader title="Профиль" />
      <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 }, mb: 5 }}>
        <Stack
          component="div"
          direction="row"
          spacing={2}
          sx={{ alignItems: 'center' }}
        >
          <Avatar
            sx={{
              width: 72,
              height: 72,
              bgcolor: 'primary.main',
              fontSize: '1.75rem',
              fontWeight: 700,
            }}
          >
            {user.username.charAt(0).toUpperCase()}
          </Avatar>
          <Box component="div" sx={{ minWidth: 0 }}>
            <Typography variant="h5" component="p" noWrap>
              {user.username}
            </Typography>
            <Typography color="text.secondary" noWrap>
              {user.email}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {`С нами с ${new Date(user.created_at).toLocaleDateString('ru-RU')}`}
            </Typography>
          </Box>
        </Stack>
      </Paper>

      <Typography variant="h4" component="h2" sx={{ mb: 3 }}>
        Мои рецепты
      </Typography>
      <Box component="div" sx={{ mb: 6 }}>
        <RecipeList filters={{ authorId: user.id }} emptyText="У вас пока нет своих рецептов." />
      </Box>

      <Typography variant="h4" component="h2" sx={{ mb: 3 }}>
        Безопасность
      </Typography>
      <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 }, maxWidth: 520 }}>
        <ChangePasswordForm />
        <Box component="div" sx={{ mt: 3 }}>
          <DeleteAccountButton />
        </Box>
      </Paper>
    </Box>
  );
}
