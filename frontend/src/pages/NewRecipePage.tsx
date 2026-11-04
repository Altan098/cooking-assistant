import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { createRecipe } from '../entities/recipe/api';
import type { RecipeInput } from '../entities/recipe/types';
import { RecipeForm } from '../features/recipe-form';

export default function NewRecipePage() {
  const navigate = useNavigate();

  const handleSubmit = async (input: RecipeInput) => {
    const recipe = await createRecipe(input);
    navigate(`/recipes/${recipe.id}`);
  };

  return (
    <Box component="div" sx={{ maxWidth: 600 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Новый рецепт
      </Typography>
      <RecipeForm onSubmit={handleSubmit} />
    </Box>
  );
}
