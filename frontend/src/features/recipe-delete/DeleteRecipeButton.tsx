import { useState } from 'react';
import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { getErrorMessage } from '../../shared/api/client';
import { deleteRecipe } from '../../entities/recipe/api';
import type { Recipe } from '../../entities/recipe/types';

interface Props {
  recipe: Recipe;
  onDeleted: () => void;
}

export default function DeleteRecipeButton({ recipe, onDeleted }: Props) {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setError(null);
    setIsDeleting(true);
    try {
      await deleteRecipe(recipe.id);
      onDeleted();
    } catch (e) {
      setError(getErrorMessage(e));
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Button color="error" variant="outlined" onClick={() => setOpen(true)}>
        Удалить
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Удалить рецепт?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {`Рецепт «${recipe.title}» будет удалён без возможности восстановления.`}
          </DialogContentText>
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} disabled={isDeleting}>
            Отмена
          </Button>
          <Button
            color="error"
            onClick={handleDelete}
            disabled={isDeleting}
            startIcon={isDeleting ? <CircularProgress size={18} /> : null}
          >
            Подтвердить
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
