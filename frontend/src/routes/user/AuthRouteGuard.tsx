import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import type { RootState } from "../../redux/store";
import { ROUTES } from "../../constants/routes"; 

export function AuthRouteGuard() {
  const { isAuthenticated } = useSelector((state: RootState) => state.user);
  
  if (isAuthenticated) {
    return <Navigate to={ROUTES.HOME} replace />;
  }
  
  return <Outlet />;
}