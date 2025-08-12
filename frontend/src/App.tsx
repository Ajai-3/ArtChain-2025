import React from "react";
import { Suspense } from "react";
import { Toaster } from "react-hot-toast";
import NotFound from "./components/NotFound";
import { Routes, Route } from "react-router-dom";
import UserRoutes from "./routes/user/UserRoutes";
import PageFallback from "./components/PageFallback";
import AdminRoutes from "./routes/admin/AdminRoutes";

const App: React.FC = () => {
  return (
    <>
        <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#1f2937',
            color: '#f9fafb',
            fontSize: '14px',
            borderRadius: '8px',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#d1fae5',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fee2e2',
            },
          },
        }}
      />
      <Suspense fallback={<PageFallback />}>
        <Routes>
          {/* Render User Routes */}
          {UserRoutes}

          {/* Render Admin Routes */}
          {AdminRoutes}

          {/* 404 Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  );
};

export default App;
