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
import { Loader2 } from "lucide-react";

const UserManagement: React.FC = () => {
  const [page, setPage] = useState(1);
  const [rawSearch, setRawSearch] = useState("");
  const debouncedSearch = useDebounce(rawSearch, 500);

  const toggleBanMutation = useToggleBanUserMutation();

  const { data, isLoading } = useGetAllUsers({
    page,
    limit: 10,
    search: debouncedSearch,
  });

  const totalPages = data?.meta
    ? Math.ceil(data.meta.total / data.meta.limit)
    : 0;

  const isToggling = (userId: string) => toggleBanMutation.isPending && toggleBanMutation.variables?.userId === userId;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>

      <Input
        type="text"
        placeholder="Search by name, email, or username..."
        onChange={(e) => {
          setPage(1);
          setRawSearch(e.target.value);
        }}
        className="mb-4 w-full max-w-md"
      />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={`skeleton-${index}`}>
                  <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-[60px]" /></TableCell>
                </TableRow>
              ))
            ) : data?.data && data.data.length > 0 ? (
              data.data.map((user: any) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name || "-"}</TableCell>
                  <TableCell>{user.email || "-"}</TableCell>
                  <TableCell>{user.username || "-"}</TableCell>
                  <TableCell className="capitalize">{user.role || "-"}</TableCell>
                  <TableCell className="capitalize">{user.status || "-"}</TableCell>
                  <TableCell>
                    <Button
                      variant={user.status === "banned" ? "outline" : "destructive"}
                      size="sm"
                      disabled={isToggling(user.id)}
                      onClick={() => {
                        const action = user.status === "banned" ? "unban" : "ban";
                        const confirmed = confirm(`Are you sure you want to ${action} ${user.name}?`);
                        if (confirmed) {
                          toggleBanMutation.mutate({ userId: user.id });
                        }
                      }}
                    >
                      {isToggling(user.id) ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        user.status === "banned" ? "Unban" : "Ban"
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  {data ? "No users found" : "Failed to load users"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {data?.meta && data.meta.total > 0 && (
        <div className="flex items-center justify-between mt-4">
          <Button
            variant="outline"
            disabled={page === 1 || isLoading}
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          >
            Previous
          </Button>
          <span className="text-sm">
            Page {page} of {totalPages} ({data.meta.total} total users)
          </span>
          <Button
            variant="outline"
            disabled={page >= totalPages || isLoading}
            onClick={() => setPage((prev) => prev + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
