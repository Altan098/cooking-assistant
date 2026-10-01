import { Box, Typography, Paper, Grid } from '@mui/material';

const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
const meals = ['Завтрак', 'Обед', 'Ужин'];

export default function MealPlanPage() {
  return (
    <Box>
      <Typography variant="h4" mb={3}>
        Планировщик меню
      </Typography>
      <Grid container spacing={1}>
        {days.map((d) => (
          <Grid item key={d} xs={12} sm={6} md={3} lg={1.7}>
            <Paper sx={{ p: 1 }}>
              <Typography variant="subtitle1" align="center" fontWeight="bold">
                {d}
              </Typography>
              {meals.map((m) => (
                <Paper key={m} variant="outlined" sx={{ p: 1, my: 0.5, minHeight: 40 }}>
                  <Typography variant="caption" color="text.secondary">
                    {m}
                  </Typography>
                </Paper>
              ))}
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}