import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { getPostLoginPath } from '@/lib/roles';

export function RoleBasedRedirect() {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-asra-dark flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to={getPostLoginPath(user)} replace />;
}
