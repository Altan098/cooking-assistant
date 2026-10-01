import { Grid, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import RecipeCard from '../components/RecipeCard';
import { mockRecipes } from '../data/mockRecipes';

export default function RecipesPage() {
  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Рецепты</Typography>
        <Button variant="contained" component={RouterLink} to="/recipes/new">
          Добавить рецепт
        </Button>
      </Box>
      <Grid container spacing={3}>
        {mockRecipes.map((r) => (
          <Grid item key={r.id} xs={12} sm={6} md={4}>
            <RecipeCard recipe={r} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}