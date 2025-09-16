import { LayoutDashboard } from "lucide-react";
import React, { useState } from "react";
import CategoryFilters from "../components/categoryManagement/CategoryFilters";
import CategoryTable from "../components/categoryManagement/CategoryTable";

const CategoryManagement: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [useCountFilter, setUseCountFilter] = useState("all");

  const dummyCategories = [
    { id: "1sfsferwr1321321", name: "Digital Art", status: "Active" },
    { id: "2dfe1231aadad131a", name: "Photography", status: "Inactive" },
    { id: "3adadqe1aadad11131", name: "Illustrations", status: "Active" },
    { id: "d11asdadada13113da4", name: "Sketches", status: "Inactive" },
    { id: "13131131aweadq1335", name: "3D Models", status: "Active" },
  ];

  // Filtered categories
  const filteredCategories = dummyCategories.filter((cat) => {
    const matchesSearch = cat.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || cat.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="container mx-auto p-4">
      {/* Header */}
      <div className="mb-6">
        <div className="flex gap-2 items-center">
          <LayoutDashboard />
          <h1 className="text-2xl font-bold">Category Management</h1>
        </div>
        <p className="text-zinc-500">
          Create, edit, and maintain artwork categories.
        </p>
      </div>

      {/* Filters */}
      <CategoryFilters
        search={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        useCountFilter={useCountFilter}
        setUseCountFilter={setUseCountFilter}
      />

      {/* Table */}
      <CategoryTable categories={filteredCategories} />
    </div>
  );
};

export default CategoryManagement;
