import { useState } from 'react';
import { validateRecipeForm } from '../../shared/lib/validation';
import type { RecipeFormErrors, RecipeFormStatus, RecipeFormValues } from './types';

const initialValues: RecipeFormValues = {
  title: '',
  description: '',
  image: '',
  cookingTime: '',
  servings: '',
  ingredients: '',
  steps: '',
};

export function useRecipeForm(onSubmit: (values: RecipeFormValues) => Promise<void>) {
  const [values, setValues] = useState<RecipeFormValues>(initialValues);
  const [errors, setErrors] = useState<RecipeFormErrors>({});
  const [status, setStatus] = useState<RecipeFormStatus>('idle');
  const [submitError, setSubmitError] = useState<string | null>(null);

  const setField = (field: keyof RecipeFormValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const submit = async () => {
    setSubmitError(null);
    const validation = validateRecipeForm(values);
    setErrors(validation);

    if (Object.keys(validation).length > 0) {
      return;
    }

    try {
      setStatus('submitting');
      await onSubmit(values);
      setStatus('success');
      setValues(initialValues);
    } catch (e) {
      setStatus('error');
      setSubmitError(e instanceof Error ? e.message : 'Неизвестная ошибка');
    }
  };

  return { values, errors, status, submitError, setField, submit };
}