const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 100;

export function validateEmail(email: string): string | undefined {
  if (!email.trim()) return 'Введите email';
  if (!EMAIL_PATTERN.test(email.trim())) return 'Некорректный email';
  return undefined;
}

export function validateNewPassword(password: string): string | undefined {
  if (password.length < MIN_PASSWORD_LENGTH) return `Минимум ${MIN_PASSWORD_LENGTH} символов`;
  if (password.length > MAX_PASSWORD_LENGTH) return `Максимум ${MAX_PASSWORD_LENGTH} символов`;
  return undefined;
}
