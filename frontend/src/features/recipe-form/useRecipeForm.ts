import { useState } from 'react';
import { getErrorMessage } from '../../shared/api/client';
import type { Recipe, RecipeInput } from '../../entities/recipe/types';
import type {
  IngredientRow,
  RecipeFormErrors,
  RecipeFormStatus,
  RecipeFormValues,
} from './types';
import { validateRecipeForm } from './validation';

type TextField = 'title' | 'description' | 'image' | 'cookingTime' | 'servings';

const emptyValues: RecipeFormValues = {
  title: '',
  description: '',
  image: '',
  cookingTime: '',
  servings: '',
  ingredients: [{ name: '', amount: '' }],
  steps: [''],
};

export function recipeToFormValues(recipe: Recipe): RecipeFormValues {
  return {
    title: recipe.title,
    description: recipe.description,
    image: recipe.image,
    cookingTime: String(recipe.cookingTime),
    servings: String(recipe.servings),
    ingredients: recipe.ingredients.length
      ? recipe.ingredients.map(({ name, amount }) => ({ name, amount }))
      : emptyValues.ingredients,
    steps: recipe.steps.length ? recipe.steps : emptyValues.steps,
  };
}

function toRecipeInput(values: RecipeFormValues): RecipeInput {
  return {
    title: values.title.trim(),
    description: values.description.trim(),
    image: values.image.trim(),
    cookingTime: Number(values.cookingTime),
    servings: Number(values.servings),
    ingredients: values.ingredients
      .map((row) => ({ name: row.name.trim(), amount: row.amount.trim() }))
      .filter((row) => row.name),
    steps: values.steps.map((step) => step.trim()).filter(Boolean),
  };
}

export function useRecipeForm(
  onSubmit: (input: RecipeInput) => Promise<void>,
  initialValues: RecipeFormValues = emptyValues
) {
  const [values, setValues] = useState<RecipeFormValues>(initialValues);
  const [errors, setErrors] = useState<RecipeFormErrors>({});
  const [status, setStatus] = useState<RecipeFormStatus>('idle');
  const [submitError, setSubmitError] = useState<string | null>(null);

  const update = (field: keyof RecipeFormValues, patch: Partial<RecipeFormValues>) => {
    setValues((prev) => ({ ...prev, ...patch }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const setField = (field: TextField, value: string) => update(field, { [field]: value });

  const setIngredient = (index: number, patch: Partial<IngredientRow>) =>
    update('ingredients', {
      ingredients: values.ingredients.map((row, i) => (i === index ? { ...row, ...patch } : row)),
    });

  const addIngredient = () =>
    update('ingredients', { ingredients: [...values.ingredients, { name: '', amount: '' }] });

  const removeIngredient = (index: number) =>
    update('ingredients', { ingredients: values.ingredients.filter((_, i) => i !== index) });

  const setStep = (index: number, text: string) =>
    update('steps', { steps: values.steps.map((step, i) => (i === index ? text : step)) });

  const addStep = () => update('steps', { steps: [...values.steps, ''] });

  const removeStep = (index: number) =>
    update('steps', { steps: values.steps.filter((_, i) => i !== index) });

  const submit = async () => {
    setSubmitError(null);
    const validation = validateRecipeForm(values);
    setErrors(validation);

    if (Object.keys(validation).length > 0) {
      return;
    }

    try {
      setStatus('submitting');
      await onSubmit(toRecipeInput(values));
      setStatus('idle');
    } catch (e) {
      setStatus('error');
      setSubmitError(getErrorMessage(e));
    }
  };

  return {
    values,
    errors,
    status,
    submitError,
    setField,
    setIngredient,
    addIngredient,
    removeIngredient,
    setStep,
    addStep,
    removeStep,
    submit,
  };
}
