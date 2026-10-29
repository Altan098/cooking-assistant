import { Box, Typography } from '@mui/material';
import { ShoppingList } from '../features/shopping-list';

export default function ShoppingListPage() {
  return (
    <Box component="div" sx={{ maxWidth: 600 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Список покупок
      </Typography>
      <ShoppingList
        initial={[
          { id: 1, name: 'Спагетти', done: false },
          { id: 2, name: 'Бекон', done: false },
        ]}
      />
    </Box>
  );
}