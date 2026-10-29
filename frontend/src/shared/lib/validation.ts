import type { RecipeFormErrors, RecipeFormValues } from '../../features/recipe-form/types';

export function validateRecipeForm(values: RecipeFormValues): RecipeFormErrors {
  const errors: RecipeFormErrors = {};

  if (!values.title.trim()) {
    errors.title = 'Введите название';
  } else if (values.title.trim().length < 3) {
    errors.title = 'Минимум 3 символа';
  }

  const time = Number(values.cookingTime);
  if (!values.cookingTime || isNaN(time) || time <= 0) {
    errors.cookingTime = 'Введите положительное число';
  }

  const servings = Number(values.servings);
  if (!values.servings || isNaN(servings) || servings < 1) {
    errors.servings = 'Минимум 1 порция';
  }

  if (!values.ingredients.trim()) {
    errors.ingredients = 'Укажите хотя бы один ингредиент';
  }

  if (!values.steps.trim()) {
    errors.steps = 'Опишите хотя бы один шаг';
  }

  return errors;
}