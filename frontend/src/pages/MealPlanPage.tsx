import { Box } from '@mui/material';
import { MealPlanBoard } from '../features/meal-plan';
import { useDocumentTitle } from '../shared/lib/useDocumentTitle';
import PageHeader from '../shared/ui/PageHeader';

export default function MealPlanPage() {
  useDocumentTitle('Меню на неделю');

  return (
    <Box component="div">
      <PageHeader title="Меню на неделю" subtitle="Выберите блюда на каждый день." />
      <MealPlanBoard />
    </Box>
  );
}
