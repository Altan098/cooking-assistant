import { useState } from 'react';
import { Box, Typography, Grid, Fade } from '@mui/material';
import { SearchBar } from '../features/recipe-search';
import RecipeCard from '../entities/recipe/ui/RecipeCard';
import { mockRecipes } from '../entities/recipe/mock';
import type { Recipe } from '../entities/recipe/types';

export default function SearchPage() {
  const [results, setResults] = useState<Recipe[]>([]);
  const [searched, setSearched] = useState(false);

  const handleSearch = (q: string) => {
    setSearched(true);
    if (!q) {
      setResults([]);
      return;
    }
    setResults(
      mockRecipes.filter((r) =>
        r.ingredients.some((i) => i.name.toLowerCase().includes(q))
      )
    );
  };

  return (
    <Box component="div">
      <Typography variant="h4" sx={{ mb: 3 }}>
        Поиск по ингредиентам
      </Typography>

      <SearchBar onSearch={handleSearch} />

      {searched && results.length === 0 && (
        <Fade in>
          <Typography color="text.secondary" sx={{ mt: 4, textAlign: 'center' }}>
            Ничего не найдено. Попробуйте другой ингредиент.
          </Typography>
        </Fade>
      )}

      {results.length > 0 && (
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
    </Box>
  );
}