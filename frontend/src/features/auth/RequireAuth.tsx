import { Navigate, Outlet, useLocation } from 'react-router-dom';
import PageLoader from '../../shared/ui/PageLoader';
import { useAuth } from './useAuth';

export default function RequireAuth() {
  const { status } = useAuth();
  const location = useLocation();

  if (status === 'loading') return <PageLoader />;

  if (status === 'anonymous') {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
