import React from 'react';
import { Button } from '../ui/button';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

const ConfirmLogoutModal: React.FC<Props> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="bg-white dark:bg-secondary-color p-6 rounded-lg shadow-lg w-[90%] max-w-sm border border:zinc-800">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">Confirm Logout</h2>
        <p className="text-zinc-600 dark:text-zinc-300 mb-6">Are you sure you want to logout?</p>
        <div className="flex justify-end gap-4">
          <Button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-zinc-300 dark:bg-zinc-600 text-black dark:text-white hover:bg-zinc-400 dark:hover:bg-zinc-500"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
          >
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmLogoutModal;