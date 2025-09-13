import React from "react";
import { Button } from "../ui/button";
import CustomLoader from "../CustomLoader";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: "default" | "destructive";
  isLoading?: boolean;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmVariant = "destructive",
  isLoading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
      <div className="bg-white dark:bg-secondary-color p-6 rounded-lg shadow-lg w-[90%] max-w-sm border border-zinc-800">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">
          {title}
        </h2>
        <p className="text-zinc-600 dark:text-zinc-300 mb-6">{description}</p>
        <div className="flex justify-end gap-4">
          <Button
            onClick={onClose}
            variant="outline"
            className="px-4 py-2"
          >
            {cancelText}
          </Button>
          <Button
            onClick={onConfirm}
            variant={confirmVariant}
            className="px-4 py-2 bg-red-600"
            disabled={isLoading}
          >
            {isLoading ?<CustomLoader /> : confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
