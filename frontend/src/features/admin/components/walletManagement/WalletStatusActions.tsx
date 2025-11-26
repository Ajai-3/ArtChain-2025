import React, { useState } from "react";
import { Button } from "../../../../components/ui/button";
import { Lock, Ban, CheckCircle } from "lucide-react";
import ConfirmModal from "../../../../components/modals/ConfirmModal";
import { useUpdateWalletStatus } from "../../hooks/walletManagement/useUpdateWalletStatus";

interface WalletStatusActionsProps {
  walletId: string;
  currentStatus: "active" | "locked" | "suspended";
  userName: string;
}

const WalletStatusActions: React.FC<WalletStatusActionsProps> = ({
  walletId,
  currentStatus,
  userName,
}) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [action, setAction] = useState<"lock" | "suspend" | "activate">("lock");
  
  const updateStatusMutation = useUpdateWalletStatus();

  const handleAction = (newAction: "lock" | "suspend" | "activate") => {
    setAction(newAction);
    setIsConfirmOpen(true);
  };

  const confirmAction = () => {
    const statusMap = {
      lock: "locked",
      suspend: "suspended",
      activate: "active",
    } as const;

    updateStatusMutation.mutate(
      { walletId, status: statusMap[action] },
      {
        onSuccess: () => setIsConfirmOpen(false),
      }
    );
  };

  const isLoading = updateStatusMutation.isPending;

  return (
    <>
      <div className="flex gap-2">
        {currentStatus !== "locked" && currentStatus !== "suspended" && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAction("lock")}
              className="bg-yellow-500 text-white hover:bg-yellow-800"
              title="Lock Wallet"
            >
              <Lock className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAction("suspend")}
              className="bg-red-500 text-white hover:bg-red-800"
              title="Suspend Wallet"
            >
              <Ban className="w-4 h-4" />
            </Button>
          </>
        )}

        {(currentStatus === "locked" || currentStatus === "suspended") && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAction("activate")}
            className="bg-green-500 text-white hover:bg-green-800"
            title="Activate Wallet"
          >
            <CheckCircle className="w-4 h-4" />
          </Button>
        )}
      </div>

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        title={`Confirm ${action === "lock" ? "Lock" : action === "suspend" ? "Suspend" : "Activation"}`}
        description={
          action === "lock"
            ? `Are you sure you want to lock ${userName}'s wallet? They won't be able to make transactions.`
            : action === "suspend"
            ? `Are you sure you want to suspend ${userName}'s wallet? This is a severe action.`
            : `Are you sure you want to activate ${userName}'s wallet? Access will be restored.`
        }
        confirmText={
          action === "lock" ? "Lock" : action === "suspend" ? "Suspend" : "Activate"
        }
        confirmVariant={
          action === "activate" ? "default" : "destructive"
        }
        onConfirm={confirmAction}
        isLoading={isLoading}
      />
    </>
  );
};

export default WalletStatusActions;
