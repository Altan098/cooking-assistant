import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { createRecipe } from '../entities/recipe/api';
import type { RecipeInput } from '../entities/recipe/types';
import { RecipeForm } from '../features/recipe-form';
import { useDocumentTitle } from '../shared/lib/useDocumentTitle';
import PageHeader from '../shared/ui/PageHeader';

export default function NewRecipePage() {
  useDocumentTitle('Новый рецепт');
  const navigate = useNavigate();

  const handleSubmit = async (input: RecipeInput) => {
    const recipe = await createRecipe(input);
    navigate(`/recipes/${recipe.id}`);
  };

  return (
    <Box component="div" sx={{ maxWidth: 720, mx: 'auto' }}>
      <PageHeader title="Новый рецепт" subtitle="Поделитесь блюдом, которое у вас получается лучше всего." />
      <RecipeForm onSubmit={handleSubmit} />
    </Box>
  );
}
