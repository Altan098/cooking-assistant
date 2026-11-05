import { Alert, Box } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { getRecipe, updateRecipe } from '../entities/recipe/api';
import type { RecipeInput } from '../entities/recipe/types';
import { useAuth } from '../features/auth';
import { RecipeForm, recipeToFormValues } from '../features/recipe-form';
import { useDocumentTitle } from '../shared/lib/useDocumentTitle';
import { useRequest } from '../shared/lib/useRequest';
import DataState from '../shared/ui/DataState';
import PageHeader from '../shared/ui/PageHeader';

export default function EditRecipePage() {
  useDocumentTitle('Редактирование рецепта');
  const { id } = useParams();
  const recipeId = Number(id);
  const { user } = useAuth();
  const navigate = useNavigate();
  const request = useRequest(() => getRecipe(recipeId), [recipeId]);

  const handleSubmit = async (input: RecipeInput) => {
    await updateRecipe(recipeId, input);
    navigate(`/recipes/${recipeId}`);
  };

  return (
    <Box component="div" sx={{ maxWidth: 720, mx: 'auto' }}>
      <PageHeader title="Редактирование рецепта" />
      <DataState request={request}>
        {(recipe) =>
          recipe.authorId === user?.id ? (
            <RecipeForm initialValues={recipeToFormValues(recipe)} onSubmit={handleSubmit} />
          ) : (
            <Alert severity="warning">Изменять рецепт может только его автор</Alert>
          )
        }
      </DataState>
    </Box>
  );
}
