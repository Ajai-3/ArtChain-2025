import React from "react";
import { X } from "lucide-react";
import { SupportUserList } from "./SupportUserList";

interface SupportModalProps {
  type: "supporters" | "supporting";
  userId: string;
  onClose: () => void;
}

export const SupportModal: React.FC<SupportModalProps> = ({
  type,
  userId,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0   backdrop-blur-sm" onClick={onClose}></div>

      <div className="relative z-50 bg-white dark:bg-secondary-color border sm:border-zinc-700 sm:rounded-3xl shadow-lg h-full sm:h-[420px] w-full sm:w-[470px] p-2 sm:p-6">
        <button
          className="absolute top-3 right-3 text-zinc-500 hover:text-zinc-700 dark:hover:text-white"
          onClick={onClose}
        >
          <X size={20} />
        </button>

        <h2 className="text-lg font-bold mb-4">
          {type === "supporters" ? "Supporters" : "Supporting"}
        </h2>

        <SupportUserList type={type} onClose={onClose} userId={userId} />
      </div>
    </div>
  );
};
