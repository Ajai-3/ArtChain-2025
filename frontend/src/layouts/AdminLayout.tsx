import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../features/admin/components/sidebar/AdminSidebar";

const AdminLayout: React.FC = () => {
  return (
    <div className="h-screen">
      <div className="flex">
        <Sidebar />
          <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
