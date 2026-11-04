import { useState } from 'react';
import { Box, Typography, Grid, Fade } from '@mui/material';
import { SearchBar } from '../features/recipe-search';
import RecipeCard from '../entities/recipe/ui/RecipeCard';
import { getRecipes } from '../entities/recipe/api';
import { useRequest } from '../shared/lib/useRequest';
import DataState from '../shared/ui/DataState';

export default function SearchPage() {
  const [query, setQuery] = useState<string | null>(null);
  const request = useRequest(
    () => (query ? getRecipes({ ingredient: query }) : Promise.resolve([])),
    [query]
  );

  return (
    <Box component="div">
      <Typography variant="h4" sx={{ mb: 3 }}>
        Поиск по ингредиентам
      </Typography>

      <SearchBar onSearch={setQuery} />

      {query !== null && (
        <DataState
          request={request}
          isEmpty={(results) => results.length === 0}
          emptyText="Ничего не найдено. Попробуйте другой ингредиент."
        >
          {(results) => (
            <Grid container spacing={3}>
              {results.map((r, idx) => (
                <Grid key={r.id} size={{ xs: 12, sm: 6, md: 4 }}>
                  <Fade in timeout={300 + idx * 100}>
                    <div>
                      <RecipeCard recipe={r} />
                    </div>
                  </Fade>
                </Grid>
              ))}
            </Grid>
          )}
        </DataState>
      )}
    </Box>
  );
}
