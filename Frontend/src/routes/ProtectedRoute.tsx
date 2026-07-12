import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Spinning } from "@/components";

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Spinning />;
  }
  if (!user) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
