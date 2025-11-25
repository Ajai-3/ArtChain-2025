import { LayoutDashboard } from "lucide-react";
import React, { useState, useEffect } from "react";
import CategoryFilters from "../components/categoryManagement/CategoryFilters";
import CategoryTable from "../components/categoryManagement/CategoryTable";
import { useGetAllCategory } from "../hooks/category-management/useGetAllCategory";
import { useDebounce } from "../../../hooks/useDebounce";

const CategoryManagement: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [useCountFilter, setUseCountFilter] = useState("all");
  const [page, setPage] = useState(1);
  const limit = 8;

  const debouncedSearch = useDebounce(searchQuery, 500);

  const { data, isLoading, error } = useGetAllCategory({
    page,
    limit,
    search: debouncedSearch,
    status: statusFilter === "all" ? undefined : statusFilter,
    countFilter:
      useCountFilter === "all"
        ? undefined
        : useCountFilter === "low"
        ? 0
        : useCountFilter === "medium"
        ? 20
        : 50,
  });

  const categories = data?.data || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / limit);

  useEffect(() => setPage(1), [debouncedSearch, statusFilter, useCountFilter]);

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <div className="flex gap-2 items-center">
          <LayoutDashboard />
          <h1 className="text-2xl font-bold "> Category Management</h1>
        </div>
        <p className="text-zinc-500">
          Create, edit, and control categories easily.
        </p>
      </div>

      <CategoryFilters
        search={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        useCountFilter={useCountFilter}
        setUseCountFilter={setUseCountFilter}
      />

      {error && <p className="text-red-500 mb-2">Error loading categories</p>}

      <CategoryTable
        categories={categories}
        isLoading={isLoading}
        page={page}
        limit={limit}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>

  );
};

export default CategoryManagement;
