import { useLocation, Navigate, Outlet } from "react-router-dom";

import useAuth from "../hooks/useAuth.js";

const RequireAuth = () => {
  const { auth } = useAuth();
  const location = useLocation();

  return auth?.email ? (
    <Outlet />
  ) : (
    <Navigate to='/connect' state={{ from: location }} replace />
  );
};

export default RequireAuth;
