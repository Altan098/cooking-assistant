import { Button, Typography } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';

export default function UserMenu() {
  const { user, status, logout } = useAuth();
  const navigate = useNavigate();

  if (status === 'loading') return null;

  if (!user) {
    return (
      <Button color="inherit" component={RouterLink} to="/login">
        Войти
      </Button>
    );
  }

  const handleLogout = async () => {
    // Сначала уходим с защищённой страницы, иначе RequireAuth отправит на /login.
    navigate('/');
    await logout().catch(() => undefined);
  };

  return (
    <>
      <Typography variant="body2" sx={{ mx: 1 }}>
        {user.username}
      </Typography>
      <Button color="inherit" onClick={handleLogout}>
        Выйти
      </Button>
    </>
  );
}
