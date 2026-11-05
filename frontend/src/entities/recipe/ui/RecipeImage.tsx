import { useState } from 'react';
import { Box } from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant';

interface Props {
  src: string;
  alt: string;
  height: number | string | Record<string, number | string>;
  fit?: 'cover' | 'contain';
}

export default function RecipeImage({ src, alt, height, fit = 'cover' }: Props) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  if (!src || failedSrc === src) {
    return (
      <Box
        component="div"
        role="img"
        aria-label={alt}
        sx={{
          height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #F4E6D4 0%, #EBD3BD 100%)',
          color: 'primary.main',
        }}
      >
        <RestaurantIcon fontSize="large" sx={{ opacity: 0.6 }} />
      </Box>
    );
  }

  return (
    <Box
      component="img"
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailedSrc(src)}
      sx={{
        display: 'block',
        height,
        width: '100%',
        objectFit: fit,
        bgcolor: '#F4E6D4',
        transition: 'transform 0.4s ease',
      }}
    />
  );
}
