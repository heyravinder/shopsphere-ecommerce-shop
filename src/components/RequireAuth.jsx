import { Navigate, useLocation } from 'react-router-dom';
import { isAdmin, useAuth } from '../context/AuthContext.jsx';

export default function RequireAuth({ admin = false, children }) {
  const { user, ready } = useAuth();
  const location = useLocation();
  if (!ready) return <p>Loading...</p>;
  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  if (admin && !isAdmin(user)) return <p role="alert">Your account doesn't have access to this page.</p>;
  return children;
}
