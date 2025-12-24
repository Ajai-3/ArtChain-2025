import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../features/admin/components/sidebar/AdminSidebar";

const AdminLayout: React.FC = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-black">
      <Sidebar />
      <main className="flex-1 overflow-y-auto scrollbar bg-gray-50 dark:bg-black p-4">
          <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
