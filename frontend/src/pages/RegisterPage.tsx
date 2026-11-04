import { Box, Typography, Link } from '@mui/material';
import { Link as RouterLink, Navigate, useLocation } from 'react-router-dom';
import { RegisterForm, useAuth } from '../features/auth';

export default function RegisterPage() {
  const { status } = useAuth();
  const location = useLocation();

  if (status === 'authenticated') {
    return <Navigate to={location.state?.from ?? '/profile'} replace />;
  }

  return (
    <Box component="div" sx={{ maxWidth: 400, mx: 'auto' }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Регистрация
      </Typography>
      <RegisterForm />
      <Typography variant="body2" sx={{ mt: 2 }}>
        Уже есть аккаунт?{' '}
        <Link component={RouterLink} to="/login" state={location.state}>
          Войти
        </Link>
      </Typography>
    </Box>
  );
}
