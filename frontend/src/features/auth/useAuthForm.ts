import { useState } from 'react';
import type { FormEvent } from 'react';
import { getErrorMessage } from '../../shared/api/client';
import type { AuthFormErrors, AuthFormValues } from './validation';

export function useAuthForm(
  validate: (values: AuthFormValues) => AuthFormErrors,
  onSubmit: (values: AuthFormValues) => Promise<void>
) {
  const [values, setValues] = useState<AuthFormValues>({ username: '', email: '', password: '' });
  const [errors, setErrors] = useState<AuthFormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setField = (field: keyof AuthFormValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitError(null);

    const validation = validate(values);
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } catch (e) {
      setSubmitError(getErrorMessage(e));
    } finally {
      setIsSubmitting(false);
    }
  };

  return { values, errors, submitError, isSubmitting, setField, submit };
}
