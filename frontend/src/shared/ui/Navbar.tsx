import { useState } from 'react';
import type { ReactNode } from 'react';
import {
  AppBar,
  Box,
  Button,
  Container,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Toolbar,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { NavLink } from 'react-router-dom';
import Logo from './Logo';

const links = [
  { to: '/', label: 'Главная' },
  { to: '/recipes', label: 'Рецепты' },
  { to: '/search', label: 'Поиск' },
  { to: '/shopping-list', label: 'Покупки' },
  { to: '/meal-plan', label: 'Меню' },
  { to: '/profile', label: 'Профиль' },
];

interface Props {
  actions?: ReactNode;
}

export default function Navbar({ actions }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <AppBar
      position="sticky"
      color="inherit"
      elevation={0}
      sx={{
        bgcolor: 'rgba(251, 246, 238, 0.86)',
        backdropFilter: 'blur(12px)',
        borderBottom: 1,
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="lg" disableGutters>
        <Toolbar sx={{ gap: 1, minHeight: { xs: 64, md: 72 } }}>
          <IconButton
            edge="start"
            aria-label="Открыть меню"
            onClick={() => setMenuOpen(true)}
            sx={{ display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Box component="div" sx={{ flexGrow: 1, minWidth: 0 }}>
            <Logo />
          </Box>
          <Box component="nav" sx={{ display: { xs: 'none', md: 'flex' }, gap: 0.5, mr: 1 }}>
            {links.map((l) => (
              <Button
                key={l.to}
                color="inherit"
                component={NavLink}
                to={l.to}
                end={l.to === '/'}
                sx={{
                  px: 1.5,
                  fontWeight: 600,
                  '&.active': { color: 'primary.main', bgcolor: 'rgba(181, 71, 46, 0.1)' },
                }}
              >
                {l.label}
              </Button>
            ))}
          </Box>
          {actions}
        </Toolbar>
      </Container>

      <Drawer open={menuOpen} onClose={() => setMenuOpen(false)}>
        <Box component="div" sx={{ p: 2 }}>
          <Logo />
        </Box>
        <List component="nav" sx={{ width: 260 }}>
          {links.map((l) => (
            <ListItemButton
              key={l.to}
              component={NavLink}
              to={l.to}
              end={l.to === '/'}
              onClick={() => setMenuOpen(false)}
              sx={{ '&.active': { color: 'primary.main', bgcolor: 'rgba(181, 71, 46, 0.1)' } }}
            >
              <ListItemText primary={l.label} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>
    </AppBar>
  );
}
