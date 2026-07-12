import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Spinning } from "@/components";

const LoggedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Spinning />;
  }
  if (user) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default LoggedRoute;
