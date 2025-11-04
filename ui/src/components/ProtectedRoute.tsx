import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface ProtectedRouteProps {
  allowedRoles?: ("admin" | "farmer")[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  if (!user?.token) return <Navigate to="/" replace />;

  if (allowedRoles && !allowedRoles.includes(user.role!))
    return <Navigate to="/" replace />;

  return <Outlet />;
};

export default ProtectedRoute;
