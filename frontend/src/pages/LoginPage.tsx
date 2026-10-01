import { Box, Typography, TextField, Button, Stack, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export default function LoginPage() {
  return (
    <Box component="div" sx={{ maxWidth: 400, mx: 'auto' }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Вход
      </Typography>
      <Stack spacing={2}>
        <TextField label="Email" type="email" fullWidth />
        <TextField label="Пароль" type="password" fullWidth />
        <Button variant="contained" disabled>
          Войти
        </Button>
        <Typography variant="body2">
          Нет аккаунта?{' '}
          <Link component={RouterLink} to="/register">
            Зарегистрироваться
          </Link>
        </Typography>
      </Stack>
    </Box>
  );
}