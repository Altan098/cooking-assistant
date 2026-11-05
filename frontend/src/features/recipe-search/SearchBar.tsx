import { useState } from 'react';
import { Box, Button, Chip, InputAdornment, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const SUGGESTIONS = ['Курица', 'Картошка', 'Рис', 'Сыр', 'Лук'];

interface Props {
  initialQuery?: string;
  onSearch: (query: string) => void;
}

export default function SearchBar({ initialQuery = '', onSearch }: Props) {
  const [query, setQuery] = useState(initialQuery);

  const search = (value: string) => {
    setQuery(value);
    onSearch(value.trim().toLowerCase());
  };

  return (
    <Box component="div">
      <Box component="div" sx={{ display: 'flex', gap: 1.5 }}>
        <TextField
          fullWidth
          label="Введите ингредиент"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') search(query);
          }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            },
            htmlInput: { maxLength: 100 },
          }}
        />
        <Button variant="contained" onClick={() => search(query)}>
          Найти
        </Button>
      </Box>
      <Box component="div" sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1.5 }}>
        {SUGGESTIONS.map((name) => (
          <Chip key={name} label={name} variant="outlined" onClick={() => search(name)} />
        ))}
      </Box>
    </Box>
  );
}
