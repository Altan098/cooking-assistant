import { Box, Typography, Avatar, Grid, Paper, Stack } from '@mui/material';
import { getRecipes } from '../entities/recipe/api';
import RecipeCard from '../entities/recipe/ui/RecipeCard';
import { useAuth } from '../features/auth';
import { useRequest } from '../shared/lib/useRequest';
import DataState from '../shared/ui/DataState';

export default function ProfilePage() {
  const { user } = useAuth();
  const userId = user?.id;
  const request = useRequest(() => getRecipes({ authorId: userId }), [userId]);

  if (!user) return null;

  return (
    <Box component="div">
      <Typography variant="h4" sx={{ mb: 3 }}>
        Профиль
      </Typography>
      <Paper sx={{ p: 3, maxWidth: 500, mb: 4 }}>
        <Stack
          component="div"
          direction="row"
          spacing={2}
          sx={{ alignItems: 'center' }}
        >
          <Avatar sx={{ width: 64, height: 64 }}>
            {user.username.charAt(0).toUpperCase()}
          </Avatar>
          <Box component="div">
            <Typography variant="h6">{user.username}</Typography>
            <Typography color="text.secondary">{user.email}</Typography>
            <Typography variant="caption" color="text.secondary">
              {`С нами с ${new Date(user.created_at).toLocaleDateString('ru-RU')}`}
            </Typography>
          </Box>
        </Stack>
      </Paper>

      <Typography variant="h5" sx={{ mb: 2 }}>
        Мои рецепты
      </Typography>
      <DataState
        request={request}
        isEmpty={(recipes) => recipes.length === 0}
        emptyText="У вас пока нет своих рецептов."
      >
        {(recipes) => (
          <Grid container spacing={3}>
            {recipes.map((r) => (
              <Grid key={r.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <RecipeCard recipe={r} />
              </Grid>
            ))}
          </Grid>
        )}
      </DataState>
    </Box>
  );
}
