import { Box, Typography } from '@mui/material';
import { MealPlanBoard } from '../features/meal-plan';

export default function MealPlanPage() {
  return (
    <Box component="div">
      <Typography variant="h4" sx={{ mb: 3 }}>
        Планировщик меню
      </Typography>
      <MealPlanBoard />
    </Box>
  );
}
