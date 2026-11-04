import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Collapse,
  FormHelperText,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import type { RecipeInput } from '../../entities/recipe/types';
import { useRecipeForm } from './useRecipeForm';
import type { RecipeFormValues } from './types';

interface Props {
  initialValues?: RecipeFormValues;
  onSubmit: (input: RecipeInput) => Promise<void>;
}

export default function RecipeForm({ initialValues, onSubmit }: Props) {
  const form = useRecipeForm(onSubmit, initialValues);
  const { values, errors, status, submitError, setField } = form;

  const isSubmitting = status === 'submitting';

  return (
    <Box component="div">
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
          error={!!errors.image}
          helperText={errors.image}
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

        <Typography variant="h6">Ингредиенты</Typography>
        {values.ingredients.map((row, index) => (
          <Stack key={index} component="div" direction="row" spacing={1}>
            <TextField
              label={`Ингредиент ${index + 1}`}
              fullWidth
              value={row.name}
              onChange={(e) => form.setIngredient(index, { name: e.target.value })}
              disabled={isSubmitting}
            />
            <TextField
              label={`Количество ${index + 1}`}
              sx={{ width: '45%' }}
              value={row.amount}
              onChange={(e) => form.setIngredient(index, { amount: e.target.value })}
              disabled={isSubmitting}
            />
            <IconButton
              aria-label={`Удалить ингредиент ${index + 1}`}
              onClick={() => form.removeIngredient(index)}
              disabled={isSubmitting || values.ingredients.length === 1}
            >
              <DeleteIcon />
            </IconButton>
          </Stack>
        ))}
        {errors.ingredients && <FormHelperText error>{errors.ingredients}</FormHelperText>}
        <Box component="div">
          <Button startIcon={<AddIcon />} onClick={form.addIngredient} disabled={isSubmitting}>
            Добавить ингредиент
          </Button>
        </Box>

        <Typography variant="h6">Приготовление</Typography>
        {values.steps.map((step, index) => (
          <Stack key={index} component="div" direction="row" spacing={1}>
            <TextField
              label={`Шаг ${index + 1}`}
              fullWidth
              multiline
              value={step}
              onChange={(e) => form.setStep(index, e.target.value)}
              disabled={isSubmitting}
            />
            <IconButton
              aria-label={`Удалить шаг ${index + 1}`}
              onClick={() => form.removeStep(index)}
              disabled={isSubmitting || values.steps.length === 1}
            >
              <DeleteIcon />
            </IconButton>
          </Stack>
        ))}
        {errors.steps && <FormHelperText error>{errors.steps}</FormHelperText>}
        <Box component="div">
          <Button startIcon={<AddIcon />} onClick={form.addStep} disabled={isSubmitting}>
            Добавить шаг
          </Button>
        </Box>

        <Button
          variant="contained"
          onClick={form.submit}
          disabled={isSubmitting}
          startIcon={isSubmitting ? <CircularProgress size={18} /> : null}
        >
          {isSubmitting ? 'Сохранение...' : 'Сохранить'}
        </Button>
      </Stack>
    </Box>
  );
}
