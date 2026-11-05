import { useState } from 'react';
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getErrorMessage } from '../../shared/api/client';
import { deleteAccountRequest } from './api';
import { useAuth } from './useAuth';

export default function DeleteAccountButton() {
  const { endSession } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setError(null);
    setIsDeleting(true);
    try {
      await deleteAccountRequest(password);
      navigate('/');
      endSession();
    } catch (e) {
      setError(getErrorMessage(e));
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Button color="error" variant="outlined" onClick={() => setOpen(true)}>
        Удалить аккаунт
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>Удалить аккаунт?</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Будут удалены ваши рецепты, список покупок и меню. Восстановить их нельзя.
          </DialogContentText>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <TextField
            label="Пароль для подтверждения"
            type="password"
            autoComplete="current-password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isDeleting}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} disabled={isDeleting}>
            Отмена
          </Button>
          <Button color="error" onClick={handleDelete} disabled={isDeleting || !password}>
            Удалить навсегда
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
