import type { RecipeFormErrors, RecipeFormValues } from './types';

const MAX_TITLE_LENGTH = 200;
const MAX_IMAGE_LENGTH = 500;
const MAX_INGREDIENT_LENGTH = 100;
const MAX_COOKING_TIME = 100000;
const MAX_SERVINGS = 1000;

export function validateRecipeForm(values: RecipeFormValues): RecipeFormErrors {
  const errors: RecipeFormErrors = {};

  const title = values.title.trim();
  if (!title) {
    errors.title = 'Введите название';
  } else if (title.length < 3) {
    errors.title = 'Минимум 3 символа';
  } else if (title.length > MAX_TITLE_LENGTH) {
    errors.title = `Максимум ${MAX_TITLE_LENGTH} символов`;
  }

  if (values.image.trim().length > MAX_IMAGE_LENGTH) {
    errors.image = `Максимум ${MAX_IMAGE_LENGTH} символов`;
  }

  const time = Number(values.cookingTime);
  if (!values.cookingTime || !Number.isInteger(time) || time <= 0 || time > MAX_COOKING_TIME) {
    errors.cookingTime = 'Введите целое положительное число';
  }

  const servings = Number(values.servings);
  if (!values.servings || !Number.isInteger(servings) || servings < 1 || servings > MAX_SERVINGS) {
    errors.servings = `Введите целое число от 1 до ${MAX_SERVINGS}`;
  }

  const ingredients = values.ingredients
    .map((row) => ({ name: row.name.trim(), amount: row.amount.trim() }))
    .filter((row) => row.name || row.amount);
  if (ingredients.length === 0) {
    errors.ingredients = 'Укажите хотя бы один ингредиент';
  } else if (ingredients.some((row) => !row.name || !row.amount)) {
    errors.ingredients = 'Для каждого ингредиента укажите название и количество';
  } else if (
    ingredients.some(
      (row) => row.name.length > MAX_INGREDIENT_LENGTH || row.amount.length > MAX_INGREDIENT_LENGTH
    )
  ) {
    errors.ingredients = `Название и количество — максимум ${MAX_INGREDIENT_LENGTH} символов`;
  }

  if (!values.steps.some((step) => step.trim())) {
    errors.steps = 'Опишите хотя бы один шаг';
  }

  return errors;
}
