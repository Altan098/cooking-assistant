import AuthForm from './AuthForm';
import { useAuth } from './useAuth';
import { validateLogin } from './validation';

export default function LoginForm() {
  const { login } = useAuth();

  return (
    <AuthForm
      fields={[
        { name: 'email', label: 'Email', type: 'email', autoComplete: 'email' },
        { name: 'password', label: 'Пароль', type: 'password', autoComplete: 'current-password' },
      ]}
      submitLabel="Войти"
      submittingLabel="Вход..."
      validate={validateLogin}
      onSubmit={({ email, password }) => login({ email: email.trim(), password })}
    />
  );
}
