import { Typography, Box, Button, Stack } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export default function HomePage() {
  return (
    <Box component="div" sx={{ textAlign: 'center', mt: 4 }}>
      <Typography variant="h3" gutterBottom>
        Добро пожаловать в «Ассистент повара»
      </Typography>
      <Typography component="p" variant="h6" color="text.secondary" sx={{ mb: 4 }}>
        Подбирайте рецепты, планируйте меню и составляйте список покупок.
      </Typography>
      <Stack
        component="div"
        direction="row"
        spacing={2}
        sx={{ justifyContent: 'center' }}
      >
        <Button variant="contained" component={RouterLink} to="/recipes">
          Каталог рецептов
        </Button>
        <Button variant="outlined" component={RouterLink} to="/search">
          Поиск по ингредиентам
        </Button>
      </Stack>
    </Box>
  );
}