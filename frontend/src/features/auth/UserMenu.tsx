import { Button, Typography } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';

export default function UserMenu() {
  const { user, status, logout } = useAuth();
  const navigate = useNavigate();

  if (status === 'loading') return null;

  if (!user) {
    return (
      <Button variant="contained" component={RouterLink} to="/login">
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
      <Typography
        variant="body2"
        noWrap
        sx={{ mx: 1, maxWidth: 140, fontWeight: 600, display: { xs: 'none', sm: 'block' } }}
      >
        {user.username}
      </Typography>
      <Button variant="outlined" color="inherit" onClick={handleLogout}>
        Выйти
      </Button>
    </>
  );
}
