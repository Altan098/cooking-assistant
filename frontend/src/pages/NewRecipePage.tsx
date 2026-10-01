import { Box, Typography, TextField, Button, Stack } from '@mui/material';

export default function NewRecipePage() {
  return (
    <Box component="div" sx={{ maxWidth: 600 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Новый рецепт
      </Typography>
      <Stack spacing={2}>
        <TextField label="Название" fullWidth />
        <TextField label="Описание" fullWidth multiline rows={3} />
        <TextField label="Время приготовления (мин)" type="number" fullWidth />
        <TextField label="Порции" type="number" fullWidth />
        <TextField label="Ингредиенты" fullWidth multiline rows={2} />
        <TextField label="Шаги приготовления" fullWidth multiline rows={4} />
        <Button variant="contained" disabled>
          Сохранить
        </Button>
      </Stack>
    </Box>
  );
}