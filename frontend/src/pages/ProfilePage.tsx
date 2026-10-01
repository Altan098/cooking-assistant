import { Box, Typography, Avatar, Paper, Stack } from '@mui/material';

export default function ProfilePage() {
  return (
    <Box component="div" sx={{ maxWidth: 500 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Профиль
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Stack
          component="div"
          direction="row"
          spacing={2}
          sx={{ alignItems: 'center' }}
        >
          <Avatar sx={{ width: 64, height: 64 }}>П</Avatar>
          <Box component="div">
            <Typography variant="h6">Пользователь</Typography>
            <Typography color="text.secondary">user@example.com</Typography>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
}