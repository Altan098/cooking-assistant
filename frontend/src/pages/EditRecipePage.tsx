import { Alert, Box, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { getRecipe, updateRecipe } from '../entities/recipe/api';
import type { RecipeInput } from '../entities/recipe/types';
import { useAuth } from '../features/auth';
import { RecipeForm, recipeToFormValues } from '../features/recipe-form';
import { useRequest } from '../shared/lib/useRequest';
import DataState from '../shared/ui/DataState';

export default function EditRecipePage() {
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
    <Box component="div" sx={{ maxWidth: 600 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Редактирование рецепта
      </Typography>
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
