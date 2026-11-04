import type { ReactNode } from 'react';
import { Container, Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

interface Props {
  navbarActions?: ReactNode;
}

export default function Layout({ navbarActions }: Props) {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#fafafa' }}>
      <Navbar actions={navbarActions} />
      <Container sx={{ py: 4 }}>
        <Outlet />
      </Container>
    </Box>
  );
}
