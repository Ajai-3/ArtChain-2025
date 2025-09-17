import { format } from "date-fns";
import { Pencil } from "lucide-react";
import React, { useState } from "react";
import EditCategoryModal from "./EditCategoryModal";
import { Button } from "../../../../components/ui/button";
import type { Category } from "../../../../types/category/Category";
import ConfirmModal from "../../../../components/modals/ConfirmModal";
import CategoryTableSkeleton from "../skeletons/CategoryTableSkeleton";
import { useUpdateCategory } from "../../hooks/category-management/useUpdateCategory";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../components/ui/table";

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
  const { mutate: updateCategory, isPending } = useUpdateCategory();
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toggleCategory, setToggleCategory] = useState<Category | null>(null);

  const handleEdit = (cat: Category) => {
    setSelectedCategory(cat);
    setOpen(true);
  };


  const handleToggleClick = (cat: Category) => {
    setToggleCategory(cat);
    setConfirmOpen(true);
  };

  const handleConfirmToggle = () => {
    if (!toggleCategory) return;
    const newStatus =
      toggleCategory.status === "active" ? "inactive" : "active";
    updateCategory(
      { _id: toggleCategory._id, status: newStatus },
      { onSuccess: () => setConfirmOpen(false) }
    );
  };

  const pageWindow = 5;
  let startPage = Math.max(1, page - Math.floor(pageWindow / 2));
  let endPage = Math.min(totalPages, startPage + pageWindow - 1);
  if (endPage - startPage < pageWindow - 1)
    startPage = Math.max(1, endPage - pageWindow + 1);
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
            {isLoading ? (
              <CategoryTableSkeleton />
            ) : categories.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-4 text-zinc-500"
                >
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
                        cat.status === "active"
                          ? "bg-green-700/30 text-green-600"
                          : "bg-rose-700/30 text-rose-600"
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
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(cat)}
                    >
                      <Pencil />
                    </Button>
                    <Button
                      variant={
                        cat.status === "active" ? "destructive" : "green"
                      }
                      size="sm"
                      className={`w-20 ${
                        cat.status === "active" ? "bg-red-600" : ""
                      }`}
                      onClick={() => handleToggleClick(cat)}
                    >
                      {cat.status === "active" ? "Deactivate" : "Activate"}
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
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => onPageChange(1)}
          >
            First
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => onPageChange(page - 1)}
          >
            Prev
          </Button>
          {pages.map((p) => (
            <Button
              key={p}
              variant={page === p ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(p)}
            >
              {p}
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            disabled={page === totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            Next
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={page === totalPages}
            onClick={() => onPageChange(totalPages)}
          >
            Last
          </Button>
        </div>
      )}

      {selectedCategory && (
        <EditCategoryModal
          isOpen={open}
          onClose={() => {
            setOpen(false);
            setSelectedCategory(null);
          }}
          category={selectedCategory}
          onSave={(data) => {
            if (!selectedCategory) return;
            updateCategory(data,
              { onSuccess: () => setOpen(false) }
            );
          }}
          isSaving={isPending}
        />
      )}

      {toggleCategory && (
        <ConfirmModal
          isOpen={confirmOpen}
          onClose={() => setConfirmOpen(false)}
          onConfirm={handleConfirmToggle}
          title={
            toggleCategory.status === "active"
              ? "Deactivate Category?"
              : "Activate Category?"
          }
          description={
            toggleCategory.status === "active"
              ? "Deactivating this category will hide its artworks from users and it cannot be selected as an artwork category."
              : "Activating this category will make it visible to users and selectable for artworks."
          }
          confirmText={
            toggleCategory.status === "active" ? "Deactivate" : "Activate"
          }
        />
      )}
    </>
  );
};

export default CategoryTable;
