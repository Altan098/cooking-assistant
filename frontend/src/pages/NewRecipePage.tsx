import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { createRecipe, uploadRecipeImage } from '../entities/recipe/api';
import type { RecipeInput } from '../entities/recipe/types';
import { RecipeForm } from '../features/recipe-form';
import { getErrorMessage } from '../shared/api/client';
import { useDocumentTitle } from '../shared/lib/useDocumentTitle';
import PageHeader from '../shared/ui/PageHeader';

export default function NewRecipePage() {
  useDocumentTitle('Новый рецепт');
  const navigate = useNavigate();

  const handleSubmit = async (input: RecipeInput, imageFile: File | null) => {
    const recipe = await createRecipe(input);
    if (imageFile) {
      try {
        await uploadRecipeImage(recipe.id, imageFile);
      } catch (e) {
        // Рецепт уже сохранён: повторная отправка формы создала бы дубль.
        const notice = `Рецепт сохранён, но фото не загрузилось. ${getErrorMessage(e)}`;
        navigate(`/recipes/${recipe.id}/edit`, { replace: true, state: { notice } });
        return;
      }
    }
    navigate(`/recipes/${recipe.id}`);
  };

  return (
    <Box component="div" sx={{ maxWidth: 720, mx: 'auto' }}>
      <PageHeader title="Новый рецепт" subtitle="Поделитесь блюдом, которое у вас получается лучше всего." />
      <RecipeForm onSubmit={handleSubmit} />
    </Box>
  );
}
