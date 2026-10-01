import { Box, Typography, Paper, Grid } from '@mui/material';

const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
const meals = ['Завтрак', 'Обед', 'Ужин'];

export default function MealPlanPage() {
  return (
    <Box component="div">
      <Typography variant="h4" sx={{ mb: 3 }}>
        Планировщик меню
      </Typography>
      <Grid container spacing={1}>
        {days.map((d) => (
          <Grid key={d} size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper sx={{ p: 1 }}>
              <Typography
                variant="subtitle1"
                sx={{ textAlign: 'center', fontWeight: 'bold' }}
              >
                {d}
              </Typography>
              {meals.map((m) => (
                <Paper
                  key={m}
                  variant="outlined"
                  sx={{ p: 1, my: 0.5, minHeight: 40 }}
                >
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