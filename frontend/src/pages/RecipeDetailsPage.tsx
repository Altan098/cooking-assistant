import { useParams, Link as RouterLink } from 'react-router-dom';
import { Typography, Box, List, ListItem, ListItemText, Button, Divider } from '@mui/material';
import { mockRecipes } from '../data/mockRecipes';

export default function RecipeDetailsPage() {
  const { id } = useParams();
  const recipe = mockRecipes.find((r) => r.id === Number(id));

  if (!recipe) {
    return (
      <Box>
        <Typography variant="h5">Рецепт не найден</Typography>
        <Button component={RouterLink} to="/recipes" sx={{ mt: 2 }}>
          К каталогу
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Button component={RouterLink} to="/recipes" sx={{ mb: 2 }}>
        Назад
      </Button>
      <Typography variant="h4" gutterBottom>
        {recipe.title}
      </Typography>
      <Typography color="text.secondary" mb={2}>
        {recipe.description}
      </Typography>
      <Typography variant="body2" mb={3}>
        {recipe.cookingTime} мин · {recipe.servings} порц.
      </Typography>

      <Typography variant="h6">Ингредиенты</Typography>
      <List dense>
        {recipe.ingredients.map((i) => (
          <ListItem key={i.id}>
            <ListItemText primary={`${i.name} — ${i.amount}`} />
          </ListItem>
        ))}
      </List>

      <Divider sx={{ my: 2 }} />

      <Typography variant="h6">Приготовление</Typography>
      <List>
        {recipe.steps.map((s, idx) => (
          <ListItem key={idx}>
            <ListItemText primary={`${idx + 1}. ${s}`} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}