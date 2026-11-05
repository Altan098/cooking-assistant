import { Box, Container, Typography } from '@mui/material';
import Logo from './Logo';

const CURRENT_YEAR = new Date().getFullYear();

export default function Footer() {
  return (
    <Box component="footer" sx={{ bgcolor: 'secondary.main', color: '#FFFFFF', mt: 8, py: 5 }}>
      <Container
        maxWidth="lg"
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box component="div">
          <Logo light />
          <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
            Рецепты, покупки и меню на неделю в одном месте.
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ opacity: 0.8 }}>
          {`© ${CURRENT_YEAR} Ассистент повара`}
        </Typography>
      </Container>
    </Box>
  );
}
