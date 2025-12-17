import React from "react";
import { TableRow, TableCell } from "../../../../components/ui/table";
import { Skeleton } from "../../../../components/ui/skeleton";

interface WithdrawalTableSkeletonProps {
  rows?: number;
}

const WithdrawalTableSkeleton: React.FC<WithdrawalTableSkeletonProps> = ({ rows = 6 }) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, index) => (
        <TableRow
          key={index}
          className="hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
        >
          {/* Checkbox (if added later) or User */}
          <TableCell className="px-4 py-2">
            <div className="flex items-center gap-3">
               <Skeleton className="w-10 h-10 rounded-full" />
               <div className="space-y-1">
                 <Skeleton className="h-4 w-24" />
                 <Skeleton className="h-3 w-32" />
               </div>
            </div>
          </TableCell>

          {/* Request ID */}
          <TableCell className="px-4 py-2">
            <Skeleton className="h-4 w-20" />
          </TableCell>

          {/* Amount */}
          <TableCell className="px-4 py-2">
            <Skeleton className="h-5 w-24" />
          </TableCell>

          {/* Method */}
          <TableCell className="px-4 py-2">
            <Skeleton className="h-4 w-28" />
          </TableCell>

          {/* Status */}
          <TableCell className="px-4 py-2">
            <Skeleton className="h-6 w-20 rounded-full" />
          </TableCell>

          {/* Date */}
          <TableCell className="px-4 py-2">
            <Skeleton className="h-4 w-24" />
          </TableCell>

          {/* Actions */}
          <TableCell className="px-4 py-2 text-right">
             <Skeleton className="h-8 w-16 ml-auto rounded" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
};

export default WithdrawalTableSkeleton;
