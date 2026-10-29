import { Box, Typography } from '@mui/material';
import { RecipeForm } from '../features/recipe-form';
import type { RecipeFormValues } from '../features/recipe-form';

export default function NewRecipePage() {
  const handleSubmit = async (values: RecipeFormValues) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log('Отправленные данные:', values);
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