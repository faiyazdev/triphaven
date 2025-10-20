import type { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const user = useSelector((state: RootState) => state.auth.authData);
  // If no user, redirect to login
  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  // If token exists, render the requested route
  return <Outlet />;
};

export default ProtectedRoute;
