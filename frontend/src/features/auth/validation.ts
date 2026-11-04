export interface AuthFormValues {
  username: string;
  email: string;
  password: string;
}

export type AuthFormErrors = Partial<Record<keyof AuthFormValues, string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateEmail(email: string) {
  if (!email.trim()) return 'Введите email';
  if (!EMAIL_PATTERN.test(email.trim())) return 'Некорректный email';
  return undefined;
}

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
  const username = values.username.trim();
  return withoutEmpty({
    username: username.length < 3 ? 'Минимум 3 символа' : undefined,
    email: validateEmail(values.email),
    password: values.password.length < 6 ? 'Минимум 6 символов' : undefined,
  });
}
