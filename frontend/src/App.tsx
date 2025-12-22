import React, { Suspense } from "react";
import NotFound from "./components/NotFound";
import PageFallback from "./components/PageFallback";
import UserRoutes from "./routes/user/UserRoutes";
import AdminRoutes from "./routes/admin/AdminRoutes";
import CustomToaster from "./components/CustomToaster"; 

import { Routes, Route } from "react-router-dom";

import { useGetPlatformConfig } from "./features/user/hooks/platform/useGetPlatformConfig";
import { VideoCallProvider } from "./context/VideoCallContext";
import { IncomingCallModal } from "./features/user/components/call/IncomingCallModal";
import { CallOverlay } from "./features/user/components/call/CallOverlay";

const App: React.FC = () => {
  useGetPlatformConfig();
  
  return (
    <>
      <CustomToaster /> 
      <VideoCallProvider>
        <IncomingCallModal />
        <CallOverlay />
        <Suspense fallback={<PageFallback />}>
          <Routes>
            {/* User Routes */}
            {UserRoutes}

            {/* Admin Routes */}
            {AdminRoutes}

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </VideoCallProvider>
    </>
  );
};

export default App;
