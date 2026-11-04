import { Alert, Box, Button, CircularProgress, Collapse, Stack, TextField } from '@mui/material';
import { useAuth } from './useAuth';
import { useAuthForm } from './useAuthForm';
import { validateLogin } from './validation';

export default function LoginForm() {
  const { login } = useAuth();
  const { values, errors, submitError, isSubmitting, setField, submit } = useAuthForm(
    validateLogin,
    ({ email, password }) => login({ email: email.trim(), password })
  );

  return (
    <Box component="form" noValidate onSubmit={submit}>
      <Collapse in={!!submitError}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {submitError}
        </Alert>
      </Collapse>
      <Stack spacing={2}>
        <TextField
          label="Email"
          type="email"
          autoComplete="email"
          fullWidth
          value={values.email}
          onChange={(e) => setField('email', e.target.value)}
          error={!!errors.email}
          helperText={errors.email}
          disabled={isSubmitting}
        />
        <TextField
          label="Пароль"
          type="password"
          autoComplete="current-password"
          fullWidth
          value={values.password}
          onChange={(e) => setField('password', e.target.value)}
          error={!!errors.password}
          helperText={errors.password}
          disabled={isSubmitting}
        />
        <Button
          type="submit"
          variant="contained"
          disabled={isSubmitting}
          startIcon={isSubmitting ? <CircularProgress size={18} /> : null}
        >
          {isSubmitting ? 'Вход...' : 'Войти'}
        </Button>
      </Stack>
    </Box>
  );
}
