import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import type { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
}

// Redirects to sign-in if user is not authenticated
export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  return <>{children}</>;
}
