import { useForm } from "react-hook-form";
import React, { useEffect, useMemo } from "react";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import { Button } from "../../../../components/ui/button";
import { Switch } from "../../../../components/ui/switch";
import CustomLoader from "../../../../components/CustomLoader";
import type { Category } from "../../../../types/category/Category";
import type { EditCategory } from "../../schema/editCategorySchema";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../../../components/ui/dialog";

type EditCategoryModalProps = {
  isOpen: boolean;
  onClose: () => void;
  category: Category | null;
  onSave: (data: Partial<EditCategory> & { _id: string }) => void;
  isSaving?: boolean;
};

const EditCategoryModal: React.FC<EditCategoryModalProps> = ({
  isOpen,
  onClose,
  category,
  onSave,
  isSaving = false,
}) => {
  const { register, handleSubmit, watch, setValue } = useForm<EditCategory>({
    defaultValues: { name: "", count: 0, status: "active" },
  });

  useEffect(() => {
    if (category) {
      setValue("name", category.name);
      setValue("count", category.count);
      setValue("status", category.status);
    }
  }, [category, setValue]);

  const formValues = watch();

  const hasChanges = useMemo(() => {
    if (!category) return false;
    return (
      formValues.name !== category.name ||
      formValues.count !== category.count ||
      formValues.status !== category.status
    );
  }, [formValues, category]);

  const getChangedFields = () => {
    if (!category) return {};
    const changed: Partial<EditCategory> = {};
    if (formValues.name !== category.name) changed.name = formValues.name;
    if (formValues.count !== category.count) changed.count = formValues.count;
    if (formValues.status !== category.status)
      changed.status = formValues.status;
    return changed;
  };

  const submitHandler = () => {
    if (!category) return;
    const changedFields = getChangedFields();
    if (Object.keys(changedFields).length === 0) return;
    onSave({ _id: category._id, ...changedFields });
  };

  if (!category) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
        </DialogHeader>

        <form className="space-y-5" onSubmit={handleSubmit(submitHandler)}>
          <div className="space-y-2">
            <Label>Name</Label>
            <Input {...register("name")} />
          </div>

          <div className="space-y-2">
            <Label>Count</Label>
            <Input
              type="number"
              {...register("count", { valueAsNumber: true })}
            />
            <p className="text-xs text-muted-foreground">
              ⚠️ This number represents how many artworks are linked to this
              category. Changing it manually may cause inconsistencies.
            </p>
          </div>

          <div className="flex items-center justify-between">
            <Label>Status</Label>
            <span
              className={`inline-block w-12 text-sm font-medium ${
                formValues.status === "active"
                  ? "text-green-600"
                  : "text-rose-600"
              }`}
            >
              {formValues.status === "active" ? "Active" : "Inactive"}
            </span>
            <Switch
              checked={formValues.status === "active"}
              onCheckedChange={(checked) =>
                setValue("status", checked ? "active" : "inactive")
              }
            />
          </div>

          <div className="border-t pt-3 space-y-1 text-sm text-zinc-500">
            <div>
              <span className="font-medium text-zinc-700">Created At: </span>
              {category.createdAt
                ? new Date(category.createdAt).toLocaleString()
                : "-"}
            </div>
            {category.updatedAt &&
              category.updatedAt !== category.createdAt && (
                <div>
                  <span className="font-medium text-zinc-700">
                    Last Updated:{" "}
                  </span>
                  {new Date(category.updatedAt).toLocaleString()}
                </div>
              )}
          </div>

          <DialogFooter className="mt-5">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="green"
              disabled={!hasChanges || isSaving}
            >
              {isSaving && <CustomLoader className="mr-2" />} Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditCategoryModal;
