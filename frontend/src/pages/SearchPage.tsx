import { Box, Paper, Typography } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import { SearchBar } from '../features/recipe-search';
import RecipeList from '../entities/recipe/ui/RecipeList';
import { useDocumentTitle } from '../shared/lib/useDocumentTitle';
import PageHeader from '../shared/ui/PageHeader';

export default function SearchPage() {
  useDocumentTitle('Поиск');
  // Запрос хранится в адресе: результат можно обновить и отправить ссылкой.
  const [params, setParams] = useSearchParams();
  const query = params.get('ingredient') ?? '';

  return (
    <Box component="div">
      <PageHeader
        title="Поиск по ингредиентам"
        subtitle="Укажите, что есть дома, а мы подскажем, что из этого приготовить."
      />

      <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 }, mb: 4 }}>
        <SearchBar
          key={query}
          initialQuery={query}
          onSearch={(value) => setParams(value ? { ingredient: value } : {})}
        />
      </Paper>

      {query ? (
        <RecipeList
          filters={{ ingredient: query }}
          emptyText="Ничего не найдено. Попробуйте другой ингредиент."
        />
      ) : (
        <Typography color="text.secondary" sx={{ textAlign: 'center', my: 6 }}>
          Начните с того, что лежит в холодильнике.
        </Typography>
      )}
    </Box>
  );
}
