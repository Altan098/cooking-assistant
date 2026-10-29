import { ListItem, ListItemText, Checkbox, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import type { ShoppingItem } from './types';

interface Props {
  item: ShoppingItem;
  onToggle: (id: number) => void;
  onRemove: (id: number) => void;
}

export default function ShoppingItemRow({ item, onToggle, onRemove }: Props) {
  return (
    <ListItem
      secondaryAction={
        <IconButton edge="end" onClick={() => onRemove(item.id)}>
          <DeleteIcon />
        </IconButton>
      }
    >
      <Checkbox checked={item.done} onChange={() => onToggle(item.id)} />
      <ListItemText
        primary={item.name}
        sx={{ textDecoration: item.done ? 'line-through' : 'none' }}
      />
    </ListItem>
  );
}