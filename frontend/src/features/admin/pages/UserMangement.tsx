import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../components/ui/table';
import { Button } from '../../../components/ui/button';
import { Skeleton } from '../../../components/ui/skeleton';
import { useGetAllUsers } from '../../../api/admin/user-management/queries';

const UserManagement: React.FC = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, error } = useGetAllUsers({
    page,
    limit: 10,
  });


  if (isError) {
    console.error('Error fetching users:', error);
    return (
      <div className="p-4 text-red-500">
        Error loading users: {error?.message}
      </div>
    );
  }

  const totalPages = data?.meta ? Math.ceil(data.meta.total / data.meta.limit) : 0;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      
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
              // Loading skeleton
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
              // Render actual user data
              data.data.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name || '-'}</TableCell>
                  <TableCell>{user.email || '-'}</TableCell>
                  <TableCell>{user.username || '-'}</TableCell>
                  <TableCell className="capitalize">{user.role || '-'}</TableCell>
                  <TableCell className="capitalize">{user.status || '-'}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              // No users found
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  {data ? "No users found" : "Failed to load users"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination controls */}
      {(data?.meta && data.meta.total > 0) && (
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