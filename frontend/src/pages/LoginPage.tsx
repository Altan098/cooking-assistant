import { Box, Typography, Link } from '@mui/material';
import { Link as RouterLink, Navigate, useLocation } from 'react-router-dom';
import { LoginForm, useAuth } from '../features/auth';

export default function LoginPage() {
  const { status } = useAuth();
  const location = useLocation();

  if (status === 'authenticated') {
    return <Navigate to={location.state?.from ?? '/profile'} replace />;
  }

  return (
    <Box component="div" sx={{ maxWidth: 400, mx: 'auto' }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Вход
      </Typography>
      <LoginForm />
      <Typography variant="body2" sx={{ mt: 2 }}>
        Нет аккаунта?{' '}
        <Link component={RouterLink} to="/register" state={location.state}>
          Зарегистрироваться
        </Link>
      </Typography>
    </Box>
  );
}
