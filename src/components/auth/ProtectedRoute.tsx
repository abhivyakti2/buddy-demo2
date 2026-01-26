import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';

type ProtectedRouteProps = {
  children: React.ReactNode;
};

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAppSelector((state) => state.auth);

  if (loading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
