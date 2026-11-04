import { useNavigate, useParams, Link as RouterLink } from 'react-router-dom';
import { Typography, Box, List, ListItem, ListItemText, Button, Divider, Stack } from '@mui/material';
import { getRecipe } from '../entities/recipe/api';
import { useAuth } from '../features/auth';
import { DeleteRecipeButton } from '../features/recipe-delete';
import { useRequest } from '../shared/lib/useRequest';
import DataState from '../shared/ui/DataState';

export default function RecipeDetailsPage() {
  const { id } = useParams();
  const recipeId = Number(id);
  const { user } = useAuth();
  const navigate = useNavigate();
  const request = useRequest(() => getRecipe(recipeId), [recipeId]);

  return (
    <Box component="div">
      <Button component={RouterLink} to="/recipes" sx={{ mb: 2 }}>
        Назад
      </Button>

      <DataState request={request}>
        {(recipe) => (
          <>
            <Typography variant="h4" gutterBottom>
              {recipe.title}
            </Typography>

            {user?.id === recipe.authorId && (
              <Stack component="div" direction="row" spacing={1} sx={{ mb: 2 }}>
                <Button
                  variant="outlined"
                  component={RouterLink}
                  to={`/recipes/${recipe.id}/edit`}
                >
                  Изменить
                </Button>
                <DeleteRecipeButton recipe={recipe} onDeleted={() => navigate('/recipes')} />
              </Stack>
            )}

            {recipe.image && (
              <Box
                component="img"
                src={recipe.image}
                alt={recipe.title}
                sx={{
                  width: '100%',
                  maxHeight: 500,
                  objectFit: 'contain',
                  borderRadius: 2,
                  mb: 3,
                  bgcolor: '#f0f0f0',
                }}
              />
            )}

            <Typography component="p" color="text.secondary" sx={{ mb: 2 }}>
              {recipe.description}
            </Typography>

            <Typography component="p" variant="body2" sx={{ mb: 3 }}>
              {`${recipe.cookingTime} мин · ${recipe.servings} порц.`}
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
          </>
        )}
      </DataState>
    </Box>
  );
}
