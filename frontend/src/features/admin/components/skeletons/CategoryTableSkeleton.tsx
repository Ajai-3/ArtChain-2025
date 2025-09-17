import React from "react";
import { TableRow, TableCell } from "../../../../components/ui/table";

const CategoryTableSkeleton: React.FC<{ rows?: number }> = ({ rows = 8 }) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <TableRow key={i} className="animate-pulse">
          {/* No */}
          <TableCell>
            <div className="h-4 bg-zinc-700 rounded w-6" />
          </TableCell>

          {/* ID */}
          <TableCell>
            <div className="h-4 bg-zinc-700 rounded w-28" />
          </TableCell>

          {/* Name */}
          <TableCell>
            <div className="h-4 bg-zinc-700 rounded w-40" />
          </TableCell>

          {/* Use Count */}
          <TableCell>
            <div className="h-4 bg-zinc-700 rounded w-12" />
          </TableCell>

          {/* Status */}
          <TableCell>
            <div className="h-4 bg-zinc-700 rounded-full w-20" />
          </TableCell>

          {/* Created At */}
          <TableCell>
            <div className="h-4 bg-zinc-700 rounded w-32 mb-1" />
            <div className="h-4 bg-zinc-700 rounded w-20" />
          </TableCell>

          {/* Actions */}
          <TableCell className="flex gap-2">
            <div className="h-8 w-12 bg-zinc-700 rounded" />
            <div className="h-8 w-14 bg-zinc-700 rounded" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
};

export default CategoryTableSkeleton;
