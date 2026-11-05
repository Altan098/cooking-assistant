import AuthForm from './AuthForm';
import { useAuth } from './useAuth';
import { validateRegister } from './validation';

export default function RegisterForm() {
  const { register } = useAuth();

  return (
    <AuthForm
      fields={[
        { name: 'username', label: 'Имя', autoComplete: 'username' },
        { name: 'email', label: 'Email', type: 'email', autoComplete: 'email' },
        { name: 'password', label: 'Пароль', type: 'password', autoComplete: 'new-password' },
      ]}
      submitLabel="Создать аккаунт"
      submittingLabel="Создание..."
      validate={validateRegister}
      onSubmit={({ username, email, password }) =>
        register({ username: username.trim(), email: email.trim(), password })
      }
    />
  );
}
