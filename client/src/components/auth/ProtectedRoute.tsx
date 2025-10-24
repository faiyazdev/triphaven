import type { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const token = useSelector((state: RootState) => state.auth.accessToken);
  // If no user, redirect to login
  if (!user || !token) {
    return <Navigate to="/signin" replace />;
  }

  // If token exists, render the requested route
  return <Outlet />;
};

export default ProtectedRoute;
