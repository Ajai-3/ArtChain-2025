import React from "react";
import { TableRow, TableCell } from "../../../../components/ui/table";
import { Skeleton } from "../../../../components/ui/skeleton";

interface UserTableSkeletonProps {
  rows?: number; // optional number of skeleton rows
}

const UserTableSkeleton: React.FC<UserTableSkeletonProps> = ({ rows = 6 }) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, index) => (
        <TableRow
          key={index}
          className="hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
        >
          {/* No */}
          <TableCell className="px-2 py-2">
            <Skeleton className="h-4 w-6" />
          </TableCell>

          {/* Name with avatar */}
          <TableCell className="flex items-center gap-2 px-4 py-2">
            <Skeleton className="w-14 h-14 rounded-sm" />
            <div>
              <Skeleton className="h-4 w-24 mb-1" />
              <Skeleton className="h-4 w-24" />
            </div>
          </TableCell>

          {/* Email */}
          <TableCell className="px-4 py-2">
            <Skeleton className="h-4 w-32" />
          </TableCell>

          {/* Plan */}
          <TableCell className="px-4 py-2">
            <Skeleton className="h-4 w-20 rounded-full" />
          </TableCell>

          {/* Role */}
          <TableCell className="px-4 py-2">
            <Skeleton className="h-4 w-20 rounded-full" />
          </TableCell>

          {/* Joined At */}
          <TableCell className="px-4 py-2">
            <Skeleton className="h-4 w-28" />
          </TableCell>

          {/* Status */}
          <TableCell className="px-4 py-2">
            <Skeleton className="h-4 w-16 rounded-full" />
          </TableCell>

          {/* Actions */}
          <TableCell className="px-4 py-2 flex gap-2">
            <Skeleton className="h-8 w-16 rounded" />
            <Skeleton className="h-8 w-16 rounded" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
};

export default UserTableSkeleton;
