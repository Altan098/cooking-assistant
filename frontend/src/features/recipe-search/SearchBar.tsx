import { useState } from 'react';
import { Box, TextField, Button } from '@mui/material';

interface Props {
  onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: Props) {
  const [query, setQuery] = useState('');

  const handleSubmit = () => {
    onSearch(query.trim().toLowerCase());
  };

  return (
    <Box component="div" sx={{ display: 'flex', gap: 2, mb: 3 }}>
      <TextField
        fullWidth
        label="Введите ингредиент"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleSubmit();
        }}
      />
      <Button variant="contained" onClick={handleSubmit}>
        Найти
      </Button>
    </Box>
  );
}