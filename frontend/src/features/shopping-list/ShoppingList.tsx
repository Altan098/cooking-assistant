import { useState } from 'react';
import { Alert, Box, TextField, Button, Collapse, List } from '@mui/material';
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
    <Box component="div">
      <Collapse in={!!actionError}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {actionError}
        </Alert>
      </Collapse>

      <Box component="div" sx={{ display: 'flex', gap: 2, mb: 2 }}>
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
        {(items) => (
          <List>
            {items.map((i) => (
              <ShoppingItemRow key={i.id} item={i} onToggle={toggle} onRemove={remove} />
            ))}
          </List>
        )}
      </DataState>
    </Box>
  );
}
