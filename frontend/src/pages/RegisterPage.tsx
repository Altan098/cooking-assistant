import { Link } from '@mui/material';
import { Link as RouterLink, Navigate, useLocation } from 'react-router-dom';
import { AuthCard, RegisterForm, useAuth } from '../features/auth';
import { useDocumentTitle } from '../shared/lib/useDocumentTitle';

export default function RegisterPage() {
  useDocumentTitle('Регистрация');
  const { status } = useAuth();
  const location = useLocation();

  if (status === 'authenticated') {
    return <Navigate to={location.state?.from ?? '/profile'} replace />;
  }

  return (
    <AuthCard
      title="Регистрация"
      subtitle="Создайте аккаунт за минуту."
      footer={
        <>
          Уже есть аккаунт?{' '}
          <Link component={RouterLink} to="/login" state={location.state}>
            Войти
          </Link>
        </>
      }
    >
      <RegisterForm />
    </AuthCard>
  );
}
