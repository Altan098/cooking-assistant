import { useState } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  IconButton,
  TextField,
  Button,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

interface Item {
  id: number;
  name: string;
  done: boolean;
}

export default function ShoppingListPage() {
  const [items, setItems] = useState<Item[]>([
    { id: 1, name: 'Спагетти', done: false },
    { id: 2, name: 'Бекон', done: false },
  ]);
  const [text, setText] = useState('');

  const add = () => {
    if (!text.trim()) return;
    setItems([...items, { id: Date.now(), name: text, done: false }]);
    setText('');
  };

  const toggle = (id: number) =>
    setItems(items.map((i) => (i.id === id ? { ...i, done: !i.done } : i)));

  const remove = (id: number) => setItems(items.filter((i) => i.id !== id));

  return (
    <Box maxWidth={600}>
      <Typography variant="h4" mb={3}>
        Список покупок
      </Typography>
      <Box display="flex" gap={2} mb={2}>
        <TextField
          fullWidth
          label="Добавить продукт"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <Button variant="contained" onClick={add}>
          Добавить
        </Button>
      </Box>
      <List>
        {items.map((i) => (
          <ListItem
            key={i.id}
            secondaryAction={
              <IconButton edge="end" onClick={() => remove(i.id)}>
                <DeleteIcon />
              </IconButton>
            }
          >
            <Checkbox checked={i.done} onChange={() => toggle(i.id)} />
            <ListItemText
              primary={i.name}
              sx={{ textDecoration: i.done ? 'line-through' : 'none' }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}