import { Route } from 'react-router-dom';
import { lazy } from 'react';
import UserLayout from '../../layouts/UserLayout';
import { AuthRouteGuard } from './AuthRouteGuard';

// Lazy-loaded pages
const Home = lazy(() => import('../../features/user/pages/Home'));
const Profile = lazy(() => import('../../features/user/pages/Profile'));
const Auth = lazy(() => import('../../features/user/components/auth/Auth'));
const ResetPassword = lazy(() => import('../../features/user/components/auth/ResetPassword'));
const SignupPassword = lazy(() => import('../../features/user/components/auth/SignupPassword'));
const Messages = lazy(() => import('../../features/user/pages/Messages'));
const Liora = lazy(() => import('../../features/user/pages/Liora'));
const Notifications = lazy(() => import('../../features/user/pages/Notifications'));
const Bidding = lazy(() => import('../../features/user/pages/Bidding'));
const Shop = lazy(() => import('../../features/user/pages/Shop'));
const Wallet = lazy(() => import('../../features/user/pages/Wallet'));
const Settings = lazy(() => import('../../features/user/pages/Settings'));

const UserRoutes = (
  <>
    <Route element={<AuthRouteGuard />}>
      <Route path="/login" element={<Auth />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/verify" element={<SignupPassword />} />
    </Route>

    <Route path="/" element={<UserLayout />}>
      <Route index element={<Home />} />
      <Route path="messages" element={<Messages />} />
      <Route path="liora.ai" element={<Liora />} />
      <Route path="notifications" element={<Notifications />} />
      <Route path="bidding" element={<Bidding />} />
      <Route path="shop" element={<Shop />} />
      <Route path="wallet" element={<Wallet />} />
      <Route path="profile" element={<Profile />} />
      <Route path="profile/:userId" element={<Profile />} />
      <Route path="settings" element={<Settings />} />
    </Route>
  </>
);

export default UserRoutes;