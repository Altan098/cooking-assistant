import {
    Box,
    TextField,
    Button,
    Stack,
    Alert,
    CircularProgress,
    Collapse,
  } from '@mui/material';
  import { useRecipeForm } from './useRecipeForm';
  import type { RecipeFormValues } from './types';
  
  interface Props {
    onSubmit: (values: RecipeFormValues) => Promise<void>;
  }
  
  export default function RecipeForm({ onSubmit }: Props) {
    const { values, errors, status, submitError, setField, submit } =
      useRecipeForm(onSubmit);
  
    const isSubmitting = status === 'submitting';
  
    return (
      <Box component="div">
        <Collapse in={status === 'success'}>
          <Alert severity="success" sx={{ mb: 2 }}>
            Рецепт успешно сохранён
          </Alert>
        </Collapse>
  
        <Collapse in={status === 'error'}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {submitError || 'Не удалось сохранить рецепт'}
          </Alert>
        </Collapse>
  
        <Stack spacing={2}>
          <TextField
            label="Название"
            fullWidth
            value={values.title}
            onChange={(e) => setField('title', e.target.value)}
            error={!!errors.title}
            helperText={errors.title}
            disabled={isSubmitting}
          />
  
          <TextField
            label="Описание"
            fullWidth
            multiline
            rows={3}
            value={values.description}
            onChange={(e) => setField('description', e.target.value)}
            disabled={isSubmitting}
          />
  
          <TextField
            label="Ссылка на изображение"
            fullWidth
            value={values.image}
            onChange={(e) => setField('image', e.target.value)}
            disabled={isSubmitting}
          />
  
          <TextField
            label="Время приготовления (мин)"
            type="number"
            fullWidth
            value={values.cookingTime}
            onChange={(e) => setField('cookingTime', e.target.value)}
            error={!!errors.cookingTime}
            helperText={errors.cookingTime}
            disabled={isSubmitting}
          />
  
          <TextField
            label="Порции"
            type="number"
            fullWidth
            value={values.servings}
            onChange={(e) => setField('servings', e.target.value)}
            error={!!errors.servings}
            helperText={errors.servings}
            disabled={isSubmitting}
          />
  
          <TextField
            label="Ингредиенты (через запятую)"
            fullWidth
            multiline
            rows={2}
            value={values.ingredients}
            onChange={(e) => setField('ingredients', e.target.value)}
            error={!!errors.ingredients}
            helperText={errors.ingredients}
            disabled={isSubmitting}
          />
  
          <TextField
            label="Шаги приготовления (через точку с запятой)"
            fullWidth
            multiline
            rows={4}
            value={values.steps}
            onChange={(e) => setField('steps', e.target.value)}
            error={!!errors.steps}
            helperText={errors.steps}
            disabled={isSubmitting}
          />
  
          <Button
            variant="contained"
            onClick={submit}
            disabled={isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={18} /> : null}
          >
            {isSubmitting ? 'Сохранение...' : 'Сохранить'}
          </Button>
        </Stack>
      </Box>
    );
  }