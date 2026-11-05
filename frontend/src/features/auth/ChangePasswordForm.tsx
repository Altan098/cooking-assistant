import { useState } from 'react';
import type { FormEvent } from 'react';
import { Alert, Box, Button, Collapse, Stack, TextField } from '@mui/material';
import { getErrorMessage } from '../../shared/api/client';
import { validateNewPassword } from '../../shared/lib/validation';
import { useAuth } from './useAuth';

export default function ChangePasswordForm() {
  const { changePassword } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordError, setNewPasswordError] = useState<string | undefined>();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitError(null);
    setIsSaved(false);

    const validation = validateNewPassword(newPassword);
    setNewPasswordError(validation);
    if (validation) return;

    setIsSubmitting(true);
    try {
      await changePassword({ current_password: currentPassword, new_password: newPassword });
      setCurrentPassword('');
      setNewPassword('');
      setIsSaved(true);
    } catch (e) {
      setSubmitError(getErrorMessage(e));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box component="form" noValidate onSubmit={handleSubmit}>
      <Collapse in={isSaved}>
        <Alert severity="success" sx={{ mb: 2 }}>
          Пароль изменён. Другие устройства вышли из аккаунта.
        </Alert>
      </Collapse>
      <Collapse in={!!submitError}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {submitError}
        </Alert>
      </Collapse>
      <Stack spacing={2}>
        <TextField
          label="Текущий пароль"
          type="password"
          autoComplete="current-password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          disabled={isSubmitting}
        />
        <TextField
          label="Новый пароль"
          type="password"
          autoComplete="new-password"
          value={newPassword}
          onChange={(e) => {
            setNewPassword(e.target.value);
            setNewPasswordError(undefined);
          }}
          error={!!newPasswordError}
          helperText={newPasswordError}
          disabled={isSubmitting}
        />
        <Box component="div">
          <Button type="submit" variant="outlined" disabled={isSubmitting || !currentPassword}>
            Сменить пароль
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}
