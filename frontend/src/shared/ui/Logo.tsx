import { Box, Typography } from '@mui/material';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import { Link as RouterLink } from 'react-router-dom';

interface Props {
  light?: boolean;
}

export default function Logo({ light = false }: Props) {
  return (
    <Box
      component={RouterLink}
      to="/"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 1.25,
        color: light ? '#FFFFFF' : 'text.primary',
        textDecoration: 'none',
      }}
    >
      <Box
        component="span"
        sx={{
          width: 36,
          height: 36,
          flexShrink: 0,
          borderRadius: '50%',
          display: 'grid',
          placeItems: 'center',
          bgcolor: 'primary.main',
          color: '#FFFFFF',
        }}
      >
        <RestaurantMenuIcon sx={{ fontSize: 20 }} />
      </Box>
      <Typography
        component="span"
        sx={{
          fontFamily: "'Playfair Display Variable', Georgia, serif",
          fontWeight: 700,
          fontSize: { xs: '1.05rem', sm: '1.25rem' },
          whiteSpace: 'nowrap',
        }}
      >
        Ассистент повара
      </Typography>
    </Box>
  );
}
