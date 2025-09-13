import { LayoutDashboard } from "lucide-react";
import React from "react";

const CategoryMangement: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <div className="flex gap-2 items-center ">
          <LayoutDashboard />
          <h1 className="text-2xl font-bold "> Category Management</h1>
        </div>
        <p className="text-zinc-500">
          Create, edit, and maintain artwork categories.{" "}
        </p>
      </div>
    </div>
  );
};

export default CategoryMangement;
