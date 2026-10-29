import { useState } from 'react';
import { Box, TextField, Button, List } from '@mui/material';
import ShoppingItemRow from './ShoppingItemRow';
import { useShoppingList } from './useShoppingList';
import type { ShoppingItem } from './types';

interface Props {
  initial?: ShoppingItem[];
}

export default function ShoppingList({ initial }: Props) {
  const { items, add, toggle, remove } = useShoppingList(initial);
  const [text, setText] = useState('');

  const handleAdd = () => {
    add(text);
    setText('');
  };

  return (
    <Box component="div">
      <Box component="div" sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          fullWidth
          label="Добавить продукт"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleAdd();
          }}
        />
        <Button variant="contained" onClick={handleAdd}>
          Добавить
        </Button>
      </Box>

      <List>
        {items.map((i) => (
          <ShoppingItemRow
            key={i.id}
            item={i}
            onToggle={toggle}
            onRemove={remove}
          />
        ))}
      </List>
    </Box>
  );
}