import type { ReactElement } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../features/auth/AuthContext";

export default function AdminRoute({ children }: { children: ReactElement }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="clay-card p-4 text-sm text-slate-600">Checking super admin access...</div>;
  }

  if (!user || user.role !== "SUPER_ADMIN") {
    return <Navigate to="/app" replace />;
  }

  return children;
}
