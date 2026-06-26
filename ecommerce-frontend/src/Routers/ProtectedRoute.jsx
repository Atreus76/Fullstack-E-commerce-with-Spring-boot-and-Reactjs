import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const ProtectedRoute = ({ requireAdmin = false }) => {
  const location = useLocation();
  const { user, isAdmin, initialized } = useAuthStore();

  if (!initialized) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 text-center">
        <p className="text-lg text-gray-600">Checking access...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
