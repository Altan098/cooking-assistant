import { Link } from '@mui/material';
import { Link as RouterLink, Navigate, useLocation } from 'react-router-dom';
import { AuthCard, LoginForm, useAuth } from '../features/auth';
import { useDocumentTitle } from '../shared/lib/useDocumentTitle';

export default function LoginPage() {
  useDocumentTitle('Вход');
  const { status } = useAuth();
  const location = useLocation();

  if (status === 'authenticated') {
    return <Navigate to={location.state?.from ?? '/profile'} replace />;
  }

  return (
    <AuthCard
      title="Вход"
      subtitle="Рады видеть вас снова."
      footer={
        <>
          Нет аккаунта?{' '}
          <Link component={RouterLink} to="/register" state={location.state}>
            Зарегистрироваться
          </Link>
        </>
      }
    >
      <LoginForm />
    </AuthCard>
  );
}
