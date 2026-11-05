import { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
} from '@mui/material';
import { getRecipes } from '../../entities/recipe/api';
import { useRequest } from '../../shared/lib/useRequest';
import DataState from '../../shared/ui/DataState';

interface Props {
  title: string;
  onClose: () => void;
  onSelect: (recipeId: number) => Promise<void>;
}

export default function RecipePickerDialog({ title, onClose, onSelect }: Props) {
  const request = useRequest(() => getRecipes({ limit: 100 }), []);
  const [recipeId, setRecipeId] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await onSelect(Number(recipeId));
    setIsSaving(false);
  };

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DataState
          request={request}
          isEmpty={(page) => page.items.length === 0}
          emptyText="Рецептов пока нет"
        >
          {({ items }) => (
            <TextField
              select
              fullWidth
              label="Рецепт"
              value={recipeId}
              onChange={(e) => setRecipeId(e.target.value)}
              sx={{ mt: 1 }}
            >
              {items.map((r) => (
                <MenuItem key={r.id} value={String(r.id)}>
                  {r.title}
                </MenuItem>
              ))}
            </TextField>
          )}
        </DataState>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isSaving}>
          Отмена
        </Button>
        <Button onClick={handleSave} disabled={!recipeId || isSaving}>
          Сохранить
        </Button>
      </DialogActions>
    </Dialog>
  );
}
