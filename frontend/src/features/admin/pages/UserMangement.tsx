import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { Button } from "../../../components/ui/button";
import { Skeleton } from "../../../components/ui/skeleton";
import { Input } from "../../../components/ui/input";
import { useDebounce } from "../../../hooks/useDebounce";
import { useToggleBanUserMutation } from "../../../api/admin/user-management/mutations";
import { useGetAllUsers } from "../../../api/admin/user-management/queries";
import { FileDown, LayoutDashboard, Loader2, User } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import UserFilters from "../components/userManagement/UserFilters";
import UserTable from "../components/userManagement/UserTable";

const UserManagement: React.FC = () => {
  const [page, setPage] = useState(1);
  const [rawSearch, setRawSearch] = useState("");
  const debouncedSearch = useDebounce(rawSearch, 500);
  const [roleFilter, setRoleFilter] = useState("all");
  const [userTypeFilter, setUserTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const toggleBanMutation = useToggleBanUserMutation();
  const { data, isLoading } = useGetAllUsers({
    page,
    limit: 10,
    search: debouncedSearch,
  });

  const totalPages = data?.meta
    ? Math.ceil(data.meta.total / data.meta.limit)
    : 0;

  const isToggling = (userId: string) =>
    toggleBanMutation.isPending &&
    toggleBanMutation.variables?.userId === userId;

  const renderPagination = () => {
    if (!data?.meta || totalPages <= 1) return null;

    const visiblePages = 3;
    let startPage = Math.max(page - 1, 1);
    let endPage = Math.min(startPage + visiblePages - 1, totalPages);

    if (endPage - startPage < visiblePages - 1) {
      startPage = Math.max(endPage - visiblePages + 1, 1);
    }

    const pages = [];
    for (let i = startPage; i <= endPage; i++) pages.push(i);

    return (
      <div className="flex items-center justify-center gap-2 mt-4 flex-wrap">
        <Button
          size="sm"
          variant="outline"
          disabled={page === 1 || isLoading}
          onClick={() => setPage(1)}
        >
          First
        </Button>
        <Button
          size="sm"
          variant="outline"
          disabled={page === 1 || isLoading}
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
        >
          Prev
        </Button>

        {startPage > 1 && <span className="px-2">...</span>}
        {pages.map((p) => (
          <Button
            key={p}
            size="sm"
            variant={p === page ? "default" : "outline"}
            onClick={() => setPage(p)}
          >
            {p}
          </Button>
        ))}
        {endPage < totalPages && <span className="px-2">...</span>}

        <Button
          size="sm"
          variant="outline"
          disabled={page >= totalPages || isLoading}
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
        >
          Next
        </Button>
        <Button
          size="sm"
          variant="outline"
          disabled={page >= totalPages || isLoading}
          onClick={() => setPage(totalPages)}
        >
          Last
        </Button>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <div className="flex gap-2 items-center ">
          <LayoutDashboard />
          <h1 className="text-2xl font-bold "> User Management</h1>
        </div>
        <p className="text-zinc-500">
          Control user access, plans, verifications, and account settings
        </p>
      </div>

      <UserFilters
        search={rawSearch}
        onSearchChange={(value) => {
          setPage(1);
          setRawSearch(value);
        }}
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
        userTypeFilter={userTypeFilter}
        setUserTypeFilter={setUserTypeFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      <UserTable
        users={data?.data || []}
        isLoading={isLoading}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        toggleBan={(userId) => {
          const user = data?.data.find((u: any) => u.id === userId);
          const action = user.status === "banned" ? "unban" : "ban";
          if (confirm(`Are you sure you want to ${action} ${user.name}?`)) {
            toggleBanMutation.mutate({ userId });
          }
        }}
        isToggling={(userId) =>
          toggleBanMutation.isPending &&
          toggleBanMutation.variables?.userId === userId
        }
      />


    </div>
  );
};

export default UserManagement;
