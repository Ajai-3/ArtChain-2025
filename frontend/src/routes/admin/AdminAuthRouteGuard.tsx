import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import type { RootState } from "../../redux/store"; 

export function AdminAuthRouteGuard() {
  const { isAuthenticated } = useSelector((state: RootState) => state.admin);
  
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  
  return <Outlet />;
}