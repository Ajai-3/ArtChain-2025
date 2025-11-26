import { Route } from "react-router-dom";
import { lazy } from "react";
import UserLayout from "../../layouts/UserLayout";
import SettingsLayout from "../../layouts/SettingsLayout";
import { AuthRouteGuard } from "./AuthRouteGuard";
import Test from "../../components/Test";
import SuccessPage from "../../features/user/components/wallet/SuccessPage";
import { ROUTES, ROUTE_PATTERNS } from "../../constants/routes";

// Lazy-loaded pages
const Home = lazy(() => import("../../features/user/pages/Home"));
const Profile = lazy(() => import("../../features/user/pages/Profile"));
const Auth = lazy(() => import("../../features/user/components/auth/Auth"));
const ResetPassword = lazy(
  () => import("../../features/user/components/auth/ResetPassword")
);
const SignupPassword = lazy(
  () => import("../../features/user/components/auth/SignupPassword")
);
const Chat = lazy(() => import("../../features/user/pages/Chat"));
const Liora = lazy(() => import("../../features/user/pages/Liora"));
const Bidding = lazy(() => import("../../features/user/pages/Bidding"));
const Shop = lazy(() => import("../../features/user/pages/Shop"));
const Wallet = lazy(() => import("../../features/user/pages/Wallet"));
const ArtPage = lazy(() => import("../../features/user/pages/ArtPage"));

// Profile tabs
const ProfileGallery = lazy(
  () => import("../../features/user/components/profile/GalleryTab")
);
const ProfileFavorites = lazy(
  () => import("../../features/user/components/profile/FavoritesTab")
);
const ProfilePosts = lazy(
  () => import("../../features/user/components/profile/PostsTab")
);
const ProfileShop = lazy(
  () => import("../../features/user/components/profile/ShopTab")
);
const ProfileAbout = lazy(
  () => import("../../features/user/components/profile/AboutTab")
);

// Settings pages
const ProfileSettings = lazy(
  () => import("../../features/user/components/settings/profileSettings/ProfileSettings")
);
const PasswordSettings = lazy(
  () => import("../../features/user/components/settings/passwordsecurity/PasswordSettings")
);
const PrivacySettings = lazy(
  () => import("../../features/user/components/settings/PrivacySettings")
);
const NotificationSettings = lazy(
  () => import("../../features/user/components/settings/NotificationSettings")
);
const SubscriptionSettings = lazy(
  () => import("../../features/user/components/settings/SubscriptionSettings")
);
const PurchaseHistory = lazy(
  () => import("../../features/user/components/settings/PurchaseHistory")
);
const SalesHistory = lazy(
  () => import("../../features/user/components/settings/SalesHistory")
);
const LikedItems = lazy(
  () => import("../../features/user/components/settings/LikedItems")
);
const BlockedUsers = lazy(
  () => import("../../features/user/components/settings/BlockedUsers")
);
const HelpAndSupport = lazy(
  () => import("../../features/user/components/settings/HelpAndSupport")
);
const Settings = lazy(
  () => import("../../features/user/pages/Settings")
);

const UserRoutes = (
  <>
    <Route element={<AuthRouteGuard />}>
      <Route path={ROUTES.LOGIN} element={<Auth />} />
      <Route path={ROUTES.RESET_PASSWORD} element={<ResetPassword />} />
      <Route path={ROUTES.VERIFY} element={<SignupPassword />} />
    </Route>

    <Route path={ROUTES.HOME} element={<UserLayout />}>
      <Route index element={<Home />} />
      <Route path="liora.ai" element={<Liora />} />
      <Route path="bidding" element={<Bidding />} />
      <Route path="shop" element={<Shop />} />
      <Route path="wallet" element={<Wallet />} />
      <Route path="test" element={<Test />} />
      <Route path="success" element={<SuccessPage />} />
      <Route path={ROUTE_PATTERNS.ART_PAGE} element={<ArtPage />} />

      <Route path="chat" element={<Chat />} />
      <Route path={ROUTE_PATTERNS.CHAT_CONVERSATION} element={<Chat />} />

      {/* Settings Routes - Protected */}
      <Route path="settings" element={<SettingsLayout />}>
        <Route index element={<Settings />} />
        <Route path="profile" element={<ProfileSettings />} />
        <Route path="password" element={<PasswordSettings />} />
        <Route path="privacy" element={<PrivacySettings />} />
        <Route path="notifications" element={<NotificationSettings />} />
        <Route path="subscriptions" element={<SubscriptionSettings />} />
        <Route path="purchases" element={<PurchaseHistory />} />
        <Route path="sales" element={<SalesHistory />} />
        <Route path="liked" element={<LikedItems />} />
        <Route path="blocked" element={<BlockedUsers />} />
        <Route path="support" element={<HelpAndSupport />} />
      </Route>

      {/* Profile Routes */}
      <Route path={ROUTE_PATTERNS.PROFILE} element={<Profile />}>
        <Route index element={<ProfileGallery />} />
        <Route path="gallery" element={<ProfileGallery />} />
        <Route path="favorites" element={<ProfileFavorites />} />
        <Route path="posts" element={<ProfilePosts />} />
        <Route path="shop" element={<ProfileShop />} />
        <Route path="about" element={<ProfileAbout />} />
      </Route>
    </Route>
  </>
);

export default UserRoutes;

