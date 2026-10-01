import { Box, Typography, TextField, Button, Stack, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export default function RegisterPage() {
  return (
    <Box maxWidth={400} mx="auto">
      <Typography variant="h4" mb={3}>
        Регистрация
      </Typography>
      <Stack spacing={2}>
        <TextField label="Имя" fullWidth />
        <TextField label="Email" type="email" fullWidth />
        <TextField label="Пароль" type="password" fullWidth />
        <Button variant="contained" disabled>
          Создать аккаунт
        </Button>
        <Typography variant="body2">
          Уже есть аккаунт?{' '}
          <Link component={RouterLink} to="/login">
            Войти
          </Link>
        </Typography>
      </Stack>
    </Box>
  );
}