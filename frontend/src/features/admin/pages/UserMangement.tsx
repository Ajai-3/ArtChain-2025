import React, { useState } from "react";

import AdminPageLayout from "../components/common/AdminPageLayout";
import { useDebounce } from "../../../hooks/useDebounce";
import UserTable from "../components/userManagement/UserTable";
import UserFilters from "../components/userManagement/UserFilters";
import { useGetAllUsers } from "../hooks/user-management/useGetAllUsers";
import { useToggleBanUserMutation } from "../hooks/user-management/useToggleBanUserMutation";
import UserStats from "../components/userManagement/UserStats";

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
    limit: 5,
    search: debouncedSearch,
    role: userTypeFilter,   
  status: statusFilter,   
  plan: roleFilter,
  });

  const totalPages = data?.meta
    ? Math.ceil(data.meta.total / data.meta.limit)
    : 0;

  return (
    <AdminPageLayout
      title="User Management"
      description="Control user access, plans, verifications, and account settings"
    >
      {data?.stats && <UserStats stats={data.stats} />}
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
        limit={6}
        toggleBan={(userId) => {
          toggleBanMutation.mutate({ userId });
        }}
        isToggling={(userId) =>
          toggleBanMutation.isPending &&
          toggleBanMutation.variables?.userId === userId
        }
      />
    </AdminPageLayout>
  );
};

export default UserManagement;
