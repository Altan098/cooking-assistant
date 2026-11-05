import type { ReactNode } from 'react';
import { Box, Paper, Stack, Typography } from '@mui/material';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';

const benefits = ['Свои рецепты', 'Список покупок', 'Меню на неделю'];

interface Props {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}

export default function AuthCard({ title, subtitle, children, footer }: Props) {
  return (
    <Paper
      variant="outlined"
      sx={{
        maxWidth: 900,
        mx: 'auto',
        mt: { md: 2 },
        borderRadius: '24px',
        overflow: 'hidden',
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
      }}
    >
      <Box
        component="div"
        sx={{
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 3,
          p: 5,
          bgcolor: 'secondary.main',
          color: '#FFFFFF',
        }}
      >
        <Typography variant="h4" component="p">
          Всё для домашней кухни в одном месте
        </Typography>
        <Stack spacing={1.5}>
          {benefits.map((benefit) => (
            <Box key={benefit} component="div" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CheckCircleOutlinedIcon fontSize="small" />
              <Typography>{benefit}</Typography>
            </Box>
          ))}
        </Stack>
      </Box>

      <Box component="div" sx={{ p: { xs: 3, sm: 5 } }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {title}
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          {subtitle}
        </Typography>
        {children}
        <Typography variant="body2" sx={{ mt: 3 }}>
          {footer}
        </Typography>
      </Box>
    </Paper>
  );
}
