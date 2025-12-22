import React from "react";
import { LayoutDashboard } from "lucide-react";

interface AdminPageHeaderProps {
  title: string;
  description: string;
}

const AdminPageHeader: React.FC<AdminPageHeaderProps> = ({
  title,
  description,
}) => {
  return (
    <div className="mb-2 sm:mb-4">
      <div className="flex gap-2 items-center">
        <LayoutDashboard />
        <h1 className="text-2xl font-bold ">{title}</h1>
      </div>
      <p className="text-zinc-500">{description}</p>
    </div>
  );
};

export default AdminPageHeader;
