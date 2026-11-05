import { Box, CircularProgress } from '@mui/material';

export default function PageLoader() {
  return (
    <Box component="div" sx={{ display: 'flex', justifyContent: 'center', my: 6 }}>
      <CircularProgress aria-label="Загрузка" />
    </Box>
  );
}
