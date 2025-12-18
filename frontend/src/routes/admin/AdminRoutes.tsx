import { lazy } from "react";
import { Route, Navigate } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout";
import { AdminAuthRouteGuard } from "./AdminAuthRouteGuard";
import { AdminGuestRouteGuard } from "./AdminGuestRouteGuard";
import { ROUTES } from "../../constants/routes";

const Login = lazy(() => import("../../features/admin/pages/Login"));
const Dashboard = lazy(() => import("../../features/admin/pages/Dashboard"));
const UserManagement = lazy(
  () => import("../../features/admin/pages/UserMangement")
);
const CategoryMangement = lazy(
  () => import("../../features/admin/pages/CategoryMangement")
);
const AIConfigPage = lazy(() => import("../../features/admin/pages/AIConfigPage"));

const ContentModeration = lazy(() => import("../../features/admin/pages/ContentModeration"));
const WalletManagement = lazy(() => import("../../features/admin/pages/WalletManagement"));
const ArtManagement = lazy(() => import("../../features/admin/pages/ArtManagement"));
const AuctionManagement = lazy(() => import("../../features/admin/pages/AuctionManagement"));
const CommissionSettings = lazy(() => import("../../features/admin/pages/CommissionSettings"));
const CommissionRequestsPage = lazy(() => import("../../features/admin/pages/CommissionRequestsPage"));
const WithdrawalManagement = lazy(() => import("../../features/admin/pages/WithdrawalManagement"));

const AdminRoutes = (
  <>
    <Route element={<AdminGuestRouteGuard />}>
      <Route path={ROUTES.ADMIN_LOGIN} element={<Login />} />
    </Route>

    <Route element={<AdminAuthRouteGuard />}>
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="user-management" element={<UserManagement />} />
        <Route path="category-management" element={<CategoryMangement />} />
        <Route path="ai-settings" element={<AIConfigPage />} />
        <Route path="commission-settings" element={<CommissionSettings />} />
        <Route path="commission-requests" element={<CommissionRequestsPage />} />
        <Route path="content-moderation" element={<ContentModeration />} />
        <Route path="wallet-management" element={<WalletManagement />} />
        <Route path="art-management" element={<ArtManagement />} />
        <Route path="auction-management" element={<AuctionManagement />} />
        <Route path="withdrawal-management" element={<WithdrawalManagement />} />
      </Route>
    </Route>
  </>
);

export default AdminRoutes;
