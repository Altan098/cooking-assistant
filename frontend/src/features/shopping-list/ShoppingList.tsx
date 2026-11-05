import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Collapse,
  LinearProgress,
  List,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import DataState from '../../shared/ui/DataState';
import ShoppingItemRow from './ShoppingItemRow';
import { useShoppingList } from './useShoppingList';

export default function ShoppingList() {
  const { request, actionError, add, toggle, remove } = useShoppingList();
  const [text, setText] = useState('');
  const [inputError, setInputError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = async () => {
    const name = text.trim();
    if (!name) {
      setInputError('Введите название продукта');
      return;
    }
    setIsAdding(true);
    if (await add(name)) setText('');
    setIsAdding(false);
  };

  return (
    <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
      <Collapse in={!!actionError}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {actionError}
        </Alert>
      </Collapse>

      <Box component="div" sx={{ display: 'flex', gap: 1.5, mb: 2 }}>
        <TextField
          fullWidth
          label="Добавить продукт"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setInputError(null);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !isAdding) handleAdd();
          }}
          error={!!inputError}
          helperText={inputError}
          slotProps={{ htmlInput: { maxLength: 200 } }}
        />
        <Button variant="contained" onClick={handleAdd} disabled={isAdding}>
          Добавить
        </Button>
      </Box>

      <DataState
        request={request}
        isEmpty={(items) => items.length === 0}
        emptyText="Список пуст. Добавьте первый продукт."
      >
        {(items) => {
          const doneCount = items.filter((i) => i.done).length;
          return (
            <>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {`Куплено ${doneCount} из ${items.length}`}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={(doneCount / items.length) * 100}
                aria-label="Прогресс покупок"
                sx={{ height: 8, borderRadius: 4, mb: 1 }}
              />
              <List>
                {items.map((i) => (
                  <ShoppingItemRow key={i.id} item={i} onToggle={toggle} onRemove={remove} />
                ))}
              </List>
            </>
          );
        }}
      </DataState>
    </Paper>
  );
}
