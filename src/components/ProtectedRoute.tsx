import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    // You could render a loading spinner here
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-hpe-blue-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-hpe-green-500"></div>
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;