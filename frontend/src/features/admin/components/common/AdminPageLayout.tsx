import React from "react";
import AdminPageHeader from "./AdminPageHeader";

interface AdminPageLayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

const AdminPageLayout: React.FC<AdminPageLayoutProps> = ({
  title,
  description,
  children,
}) => {
  return (
    <div className="w-full space-y-2">
      <AdminPageHeader title={title} description={description} />
      {children}
    </div>
  );
};

export default AdminPageLayout;
