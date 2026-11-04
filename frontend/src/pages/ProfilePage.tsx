import { Box, Typography, Avatar, Paper, Stack } from '@mui/material';
import { useAuth } from '../features/auth';

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) return null;

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
          <Avatar sx={{ width: 64, height: 64 }}>
            {user.username.charAt(0).toUpperCase()}
          </Avatar>
          <Box component="div">
            <Typography variant="h6">{user.username}</Typography>
            <Typography color="text.secondary">{user.email}</Typography>
            <Typography variant="caption" color="text.secondary">
              {`С нами с ${new Date(user.created_at).toLocaleDateString('ru-RU')}`}
            </Typography>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
}
