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
    <div className="container mx-auto p-2 sm:p-4">
      <AdminPageHeader title={title} description={description} />
      {children}
    </div>
  );
};

export default AdminPageLayout;
