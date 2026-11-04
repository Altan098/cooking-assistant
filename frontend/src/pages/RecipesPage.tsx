import { Grid, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import RecipeCard from '../entities/recipe/ui/RecipeCard';
import { getRecipes } from '../entities/recipe/api';
import { useRequest } from '../shared/lib/useRequest';
import DataState from '../shared/ui/DataState';

export default function RecipesPage() {
  const request = useRequest(() => getRecipes(), []);

  return (
    <Box component="div">
      <Box
        component="div"
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant="h4">Рецепты</Typography>
        <Button variant="contained" component={RouterLink} to="/recipes/new">
          Добавить рецепт
        </Button>
      </Box>
      <DataState
        request={request}
        isEmpty={(recipes) => recipes.length === 0}
        emptyText="Рецептов пока нет. Добавьте первый!"
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
