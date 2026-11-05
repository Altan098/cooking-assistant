import { Suspense } from 'react';
import type { ReactNode } from 'react';
import { Container, Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Footer from './Footer';
import Navbar from './Navbar';
import PageLoader from './PageLoader';

interface Props {
  navbarActions?: ReactNode;
}

export default function Layout({ navbarActions }: Props) {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar actions={navbarActions} />
      <Container component="main" maxWidth="lg" sx={{ py: { xs: 3, md: 5 }, flexGrow: 1 }}>
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </Container>
      <Footer />
    </Box>
  );
}
