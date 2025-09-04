import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../components/ui/table";
import { Button } from "../../../../components/ui/button";
import { Skeleton } from "../../../../components/ui/skeleton";
import { Loader2 } from "lucide-react";

interface UserTableProps {
  users: any[];
  isLoading: boolean;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  toggleBan: (userId: string) => void;
  isToggling: (userId: string) => boolean;
}

const UserTable: React.FC<UserTableProps> = ({
  users,
  isLoading,
  page,
  totalPages,
  onPageChange,
  toggleBan,
  isToggling,
}) => {
  const renderPagination = () => {
    if (totalPages <= 1) return null;

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
        <Button size="sm" variant="outline" disabled={page === 1} onClick={() => onPageChange(1)}>
          First
        </Button>
        <Button size="sm" variant="outline" disabled={page === 1} onClick={() => onPageChange(page - 1)}>
          Prev
        </Button>

        {startPage > 1 && <span className="px-2">...</span>}
        {pages.map((p) => (
          <Button
            key={p}
            size="sm"
            variant={p === page ? "default" : "outline"}
            onClick={() => onPageChange(p)}
          >
            {p}
          </Button>
        ))}
        {endPage < totalPages && <span className="px-2">...</span>}

        <Button size="sm" variant="outline" disabled={page === totalPages} onClick={() => onPageChange(page + 1)}>
          Next
        </Button>
        <Button size="sm" variant="outline" disabled={page === totalPages} onClick={() => onPageChange(totalPages)}>
          Last
        </Button>
      </div>
    );
  };

  return (
    <div className="overflow-x-auto rounded-lg">
      <Table className="min-w-full border border-zinc-800">
        <TableHeader>
          <TableRow className="bg-gray-50 dark:bg-zinc-900">
            <TableHead className="px-4 py-2 text-left">Name</TableHead>
            <TableHead className="px-4 py-2 text-left">Email</TableHead>
            <TableHead className="px-4 py-2 text-left">Username</TableHead>
            <TableHead className="px-4 py-2 text-left">Role</TableHead>
            <TableHead className="px-4 py-2 text-left">Status</TableHead>
            <TableHead className="px-4 py-2 text-left">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading
            ? Array.from({ length: 10 }).map((_, index) => (
                <TableRow key={index} className="hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors">
                  {[...Array(6)].map((_, i) => (
                    <TableCell key={i}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            : users && users.length > 0
            ? users.map((user: any) => (
                <TableRow key={user.id} className="hover:bg-gray-100 dark:hover:bg-zinc-900 transition-colors">
                  <TableCell className="px-4 py-2">{user.name || "-"}</TableCell>
                  <TableCell className="px-4 py-2">{user.email || "-"}</TableCell>
                  <TableCell className="px-4 py-2">{user.username || "-"}</TableCell>
                  <TableCell className="px-4 py-2 capitalize">{user.role || "-"}</TableCell>
                  <TableCell className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        user.status === "banned"
                          ? "bg-red-700/30 text-red-600"
                          : "bg-green-700/30 text-green-600"
                      }`}
                    >
                      {user.status}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-2">
                    <Button
                      variant={user.status === "banned" ? "outline" : "destructive"}
                      size="sm"
                      disabled={isToggling(user.id)}
                      onClick={() => toggleBan(user.id)}
                    >
                      {isToggling(user.id) ? <Loader2 className="w-4 h-4 animate-spin" /> : user.status === "banned" ? "Unban" : "Ban"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    No users found
                  </TableCell>
                </TableRow>
              )}
        </TableBody>
      </Table>

      {renderPagination()}
    </div>
  );
};

export default UserTable;
