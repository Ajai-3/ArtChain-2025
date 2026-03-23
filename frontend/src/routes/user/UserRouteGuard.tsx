import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import type { RootState } from "../../redux/store";
import { ROUTES } from "../../constants/routes";

export function UserRouteGuard() {
  const { isAuthenticated } = useSelector((state: RootState) => state.user);
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login and save the location the user tried to access
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  return <Outlet />;
}

export default UserRouteGuard;
