import { Container, Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#fafafa' }}>
      <Navbar />
      <Container sx={{ py: 4 }}>
        <Outlet />
      </Container>
    </Box>
  );
}