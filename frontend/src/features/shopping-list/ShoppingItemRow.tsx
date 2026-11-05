import { ListItem, ListItemText, Checkbox, IconButton } from '@mui/material';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import type { ShoppingItem } from './types';

interface Props {
  item: ShoppingItem;
  onToggle: (item: ShoppingItem) => void;
  onRemove: (id: number) => void;
}

export default function ShoppingItemRow({ item, onToggle, onRemove }: Props) {
  return (
    <ListItem
      divider
      secondaryAction={
        <IconButton edge="end" aria-label={`Удалить ${item.name}`} onClick={() => onRemove(item.id)}>
          <DeleteOutlinedIcon />
        </IconButton>
      }
    >
      <Checkbox
        checked={item.done}
        onChange={() => onToggle(item)}
        slotProps={{ input: { 'aria-label': `Отметить ${item.name}` } }}
      />
      <ListItemText
        primary={item.name}
        sx={{
          textDecoration: item.done ? 'line-through' : 'none',
          color: item.done ? 'text.secondary' : 'text.primary',
        }}
      />
    </ListItem>
  );
}
