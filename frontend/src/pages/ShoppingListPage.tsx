import { Box } from '@mui/material';
import { ShoppingList } from '../features/shopping-list';
import { useDocumentTitle } from '../shared/lib/useDocumentTitle';
import PageHeader from '../shared/ui/PageHeader';

export default function ShoppingListPage() {
  useDocumentTitle('Список покупок');

  return (
    <Box component="div" sx={{ maxWidth: 720, mx: 'auto' }}>
      <PageHeader title="Список покупок" subtitle="Ничего не забудьте в магазине." />
      <ShoppingList />
    </Box>
  );
}
