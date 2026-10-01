import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'Главная' },
  { to: '/recipes', label: 'Рецепты' },
  { to: '/search', label: 'Поиск' },
  { to: '/shopping-list', label: 'Покупки' },
  { to: '/meal-plan', label: 'Меню' },
  { to: '/profile', label: 'Профиль' },
];

export default function Navbar() {
  return (
    <AppBar position="static">
      <Toolbar sx={{ flexWrap: 'wrap', gap: 1 }}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Ассистент повара
        </Typography>
        {links.map((l) => (
          <Button key={l.to} color="inherit" component={RouterLink} to={l.to}>
            {l.label}
          </Button>
        ))}
        <Button color="inherit" component={RouterLink} to="/login">
          Войти
        </Button>
      </Toolbar>
    </AppBar>
  );
}