import React, { Suspense } from "react";
import NotFound from "./components/NotFound";
import PageFallback from "./components/PageFallback";
import UserRoutes from "./routes/user/UserRoutes";
import AdminRoutes from "./routes/admin/AdminRoutes";
import CustomToaster from "./components/CustomToaster"; 

import { Routes, Route } from "react-router-dom";

const App: React.FC = () => {
  return (
    <>
      <CustomToaster /> 
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
    </>
  );
};

export default App;
