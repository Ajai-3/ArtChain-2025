import React from "react";
import { format } from "date-fns";
import { Pencil } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../components/ui/table";
import CategoryTableSkeleton from "../skeletons/CategoryTableSkeleton";
import type { Category } from "../../../../types/category/Category";


interface CategoryTableProps {
  categories: Category[];
  isLoading?: boolean;
  page: number;
  limit: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
}

const CategoryTable: React.FC<CategoryTableProps> = ({
  categories,
  isLoading,
  page,
  limit,
  totalPages,
  onPageChange,
}) => {

  const pageWindow = 5;
  let startPage = Math.max(1, page - Math.floor(pageWindow / 2));
  let endPage = Math.min(totalPages, startPage + pageWindow - 1);
  if (endPage - startPage < pageWindow - 1) {
    startPage = Math.max(1, endPage - pageWindow + 1);
  }
  const pages = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );

  return (
    <>
    <div className="overflow-x-auto rounded-lg border border-zinc-800">
      <Table className="min-w-full border">
        <TableHeader>
          <TableRow className="bg-gray-50 dark:bg-zinc-900">
            <TableHead>No</TableHead>
            <TableHead>Id</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Use Count</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? <CategoryTableSkeleton /> : categories.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-4 text-zinc-500">
                No categories found
              </TableCell>
            </TableRow>
          ) : (
            categories.map((cat, idx) => (
              <TableRow key={cat._id}>
                <TableCell>{(page - 1) * limit + idx + 1}</TableCell>
                <TableCell>{cat._id}</TableCell>
                <TableCell>{cat.name || "No category"}</TableCell>
                <TableCell>{cat.count}</TableCell>
                <TableCell>
                  <span
                    className={`inline-block w-16 text-center py-[.2rem] rounded-full text-xs ${
                      cat.status === "active" ? "bg-green-700/30 text-green-600" : "bg-rose-700/30 text-rose-600"
                    }`}
                  >
                    {cat.status}
                  </span>
                </TableCell>
                <TableCell className="px-4 py-2">
                  {cat.createdAt ? (
                    <>
                      <div>
                        {format(new Date(cat.createdAt), "MMMM d, yyyy")}
                      </div>
                      <div>{format(new Date(cat.createdAt), "hh:mm a")}</div>
                    </>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Pencil />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="bg-red-600"
                  >
                    Block
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      
    </div>
    {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4 flex-wrap">
          <Button
            size="sm"
            variant="outline"
            disabled={page === 1}
            onClick={() => onPageChange(1)}
          >
            First
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={page === 1}
            onClick={() => onPageChange(page - 1)}
          >
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

          <Button
            size="sm"
            variant="outline"
            disabled={page === totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            Next
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={page === totalPages}
            onClick={() => onPageChange(totalPages)}
          >
            Last
          </Button>
        </div>
      )} </>
  );
};

export default CategoryTable;
