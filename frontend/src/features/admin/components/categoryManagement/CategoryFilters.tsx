import React, { useState } from "react";
import { Input } from "../../../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import { Button } from "../../../../components/ui/button";
import { SquarePen } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../../../components/ui/dialog";
import { categorySchema } from "../../schema/categorySchema";
import CustomLoader from "../../../../components/CustomLoader";
import { useCreateCategory } from "../../hooks/category-management/useCreateCategory";

interface CategoryFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  useCountFilter: string;
  setUseCountFilter: (value: string) => void;
}

const CategoryFilters: React.FC<CategoryFiltersProps> = ({
  search,
  onSearchChange,
  statusFilter,
  setStatusFilter,
  useCountFilter,
  setUseCountFilter,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  const createCategory = useCreateCategory();

  const handleCreate = () => {
    // Validate input
    const result = categorySchema.safeParse({ name: categoryName });

    if (!result.success) {
      setValidationError(result.error.errors[0].message);
      return;
    }

    setValidationError(null);

    // Call mutation
    createCategory.mutate(result.data, {
      onSuccess: () => {
        setCategoryName("");
        setIsOpen(false);
      },
    });
  };

  return (
    <>
      {/* Filters Row */}
      <div className="bg-zinc-100 dark:bg-zinc-950 border dark:border-zinc-800 p-4 rounded-lg mb-3 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <Input
          type="text"
          placeholder="Search categories..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          variant="green-focus"
          className="w-full"
        />

        <Select onValueChange={setStatusFilter} defaultValue={statusFilter}>
          <SelectTrigger className="w-full sm:w-64">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={setUseCountFilter} defaultValue={useCountFilter}>
          <SelectTrigger className="w-full sm:w-64">
            <SelectValue placeholder="Use Count" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="low">Low (&lt; 20)</SelectItem>
            <SelectItem value="medium">Medium (20–50)</SelectItem>
            <SelectItem value="high">High (&gt; 50)</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="green" onClick={() => setIsOpen(true)}>
          <SquarePen /> Create Category
        </Button>
      </div>

      {/* Create Category Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create Category</DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <Input
              variant="green-focus"
              placeholder="Enter category name"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              autoFocus
              maxLength={20}
            />

            <div className="flex justify-between text-sm text-zinc-400 mt-1">
              {validationError && (
                <p className="text-red-600 ml-1">{validationError}</p>
              )}
              <span>{categoryName.trim().length}/20</span>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={createCategory.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="green"
              onClick={handleCreate}
              disabled={createCategory.isPending}
              className="flex items-center gap-2"
            >
              {createCategory.isPending ? <CustomLoader /> : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CategoryFilters;
