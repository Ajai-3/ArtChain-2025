import { lazy } from "react";
import { Route, Navigate } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout";
import { AdminAuthRouteGuard } from "./AdminAuthRouteGuard";

const Login = lazy(() => import("../../features/admin/pages/Login"));
const Dashboard = lazy(() => import("../../features/admin/pages/Dashboard"));
const UserManagement = lazy(
  () => import("../../features/admin/pages/UserMangement")
);
const CategoryMangement = lazy(
  () => import("../../features/admin/pages/CategoryMangement")
);

const AdminRoutes = (
  <>
    <Route path="/admin/login" element={<Login />} />
    <Route element={<AdminAuthRouteGuard />}>
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="user-management" element={<UserManagement />} />
        <Route path="category-management" element={<CategoryMangement />} />
      </Route>
    </Route>
  </>
);

export default AdminRoutes;
