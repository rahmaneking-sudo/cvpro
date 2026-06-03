import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext';
import { Loader2 } from 'lucide-react';

export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-obsidian)] flex items-center justify-center">
        <Loader2 size={32} className="text-[var(--color-champagne)] animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Désactivé temporairement pour ne pas bloquer les utilisateurs :
  // if (user && !user.isActive && location.pathname !== '/activation') {
  //   return <Navigate to="/activation" replace />;
  // }

  return children;
}
