import { validateEmail, validateNewPassword } from '../../shared/lib/validation';

export interface AuthFormValues {
  username: string;
  email: string;
  password: string;
}

export type AuthFormErrors = Partial<Record<keyof AuthFormValues, string>>;

function withoutEmpty(errors: AuthFormErrors): AuthFormErrors {
  return Object.fromEntries(Object.entries(errors).filter(([, message]) => message));
}

export function validateLogin(values: AuthFormValues): AuthFormErrors {
  return withoutEmpty({
    email: validateEmail(values.email),
    password: values.password ? undefined : 'Введите пароль',
  });
}

export function validateRegister(values: AuthFormValues): AuthFormErrors {
  return withoutEmpty({
    username: values.username.trim().length < 3 ? 'Минимум 3 символа' : undefined,
    email: validateEmail(values.email),
    password: validateNewPassword(values.password),
  });
}
