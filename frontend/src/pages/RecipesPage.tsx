import { Button, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Link as RouterLink } from 'react-router-dom';
import RecipeList from '../entities/recipe/ui/RecipeList';
import { useDocumentTitle } from '../shared/lib/useDocumentTitle';
import PageHeader from '../shared/ui/PageHeader';

export default function RecipesPage() {
  useDocumentTitle('Рецепты');

  return (
    <Box component="div">
      <PageHeader
        title="Рецепты"
        subtitle="Блюда на каждый день от участников сообщества."
        action={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            component={RouterLink}
            to="/recipes/new"
          >
            Добавить рецепт
          </Button>
        }
      />
      <RecipeList emptyText="Рецептов пока нет. Добавьте первый!" />
    </Box>
  );
}
