import { useState } from 'react';
import { Box, Typography, TextField, Button, Grid } from '@mui/material';
import RecipeCard from '../components/RecipeCard';
import { mockRecipes } from '../data/mockRecipes';
import type { Recipe } from '../types/recipe';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Recipe[]>([]);

  const handleSearch = () => {
    const q = query.toLowerCase().trim();
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
      <Box component="div" sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          fullWidth
          label="Введите ингредиент"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button variant="contained" onClick={handleSearch}>
          Найти
        </Button>
      </Box>
      <Grid container spacing={3}>
        {results.map((r) => (
          <Grid key={r.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <RecipeCard recipe={r} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}