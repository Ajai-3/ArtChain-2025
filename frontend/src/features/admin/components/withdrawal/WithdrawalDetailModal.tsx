import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../../components/ui/dialog";
import { Button } from "../../../../components/ui/button";
import { Badge } from "../../../../components/ui/badge";
import { Textarea } from "../../../../components/ui/textarea";
import { Label } from "../../../../components/ui/label";
import {
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Banknote,
  Smartphone,
  User,
  Calendar,
  IndianRupee,
} from "lucide-react";
import { useUpdateWithdrawalStatus } from "../../hooks/withdrawal/useUpdateWithdrawalStatus";
import { formatNumber } from "../../../../libs/formatNumber";

interface WithdrawalDetailModalProps {
  withdrawal: any;
  isOpen: boolean;
  onClose: () => void;
}

const WithdrawalDetailModal: React.FC<WithdrawalDetailModalProps> = ({
  withdrawal,
  isOpen,
  onClose,
}) => {
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectInput, setShowRejectInput] = useState(false);
  const { mutate: updateStatus, isPending } = useUpdateWithdrawalStatus();

  const handleApprove = () => {
    updateStatus(
      {
        withdrawalId: withdrawal.id,
        status: "APPROVED",
      },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      alert("Please provide a rejection reason");
      return;
    }

    updateStatus(
      {
        withdrawalId: withdrawal.id,
        status: "REJECTED",
        rejectionReason,
      },
      {
        onSuccess: () => {
          onClose();
          setRejectionReason("");
          setShowRejectInput(false);
        },
      }
    );
  };

  const handleComplete = () => {
    updateStatus(
      {
        withdrawalId: withdrawal.id,
        status: "COMPLETED",
      },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case "APPROVED":
      case "PROCESSING":
        return <AlertCircle className="w-5 h-5 text-blue-500" />;
      case "COMPLETED":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "REJECTED":
      case "FAILED":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "APPROVED":
      case "PROCESSING":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "COMPLETED":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "REJECTED":
      case "FAILED":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto custom-scrollbar">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-3">
            Withdrawal Request Details
            <Badge
              className={`${getStatusColor(withdrawal.status)} flex items-center gap-1.5 px-3 py-1`}
            >
              {getStatusIcon(withdrawal.status)}
              {withdrawal.status}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Request Information */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <IndianRupee className="w-4 h-4" />
                <span>Amount</span>
              </div>
              <p className="text-2xl font-bold text-main-color">
                {formatNumber(withdrawal.amount)} AC
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Calendar className="w-4 h-4" />
                <span>Request Date</span>
              </div>
              <p className="text-lg font-semibold">
                {new Date(withdrawal.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* User Information */}
          <div className="bg-gradient-to-br from-main-color/10 to-purple-600/10 dark:from-main-color/20 dark:to-purple-600/20 p-4 rounded-lg border border-main-color/20">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              <User className="w-4 h-4" />
              User Information
            </div>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-main-color to-purple-600 flex items-center justify-center text-white text-2xl font-bold overflow-hidden flex-shrink-0">
                {withdrawal.user?.profileImage ? (
                  <img
                    src={withdrawal.user.profileImage}
                    alt={withdrawal.user.name || "User"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>{(withdrawal.user?.name || withdrawal.userId || "U").charAt(0).toUpperCase()}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold dark:text-white truncate">
                  {withdrawal.user?.name || "Unknown User"}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                  {withdrawal.user?.email || "No email available"}
                </p>
                <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">User ID:</span>
                    <p className="font-mono text-xs text-gray-700 dark:text-gray-300 truncate" title={withdrawal.userId}>{withdrawal.userId}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Wallet ID:</span>
                    <p className="font-mono text-xs text-gray-700 dark:text-gray-300 truncate" title={withdrawal.walletId}>{withdrawal.walletId}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method Details */}
          <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              {withdrawal.method === "BANK_TRANSFER" ? (
                <Banknote className="w-4 h-4" />
              ) : (
                <Smartphone className="w-4 h-4" />
              )}
              Payment Method: {withdrawal.method === "BANK_TRANSFER" ? "Bank Transfer" : "UPI"}
            </div>

            {withdrawal.method === "BANK_TRANSFER" ? (
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Account Holder:</span>
                  <p className="font-semibold">{withdrawal.accountHolderName}</p>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Account Number:</span>
                  <p className="font-mono">{withdrawal.accountNumber}</p>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">IFSC Code:</span>
                  <p className="font-mono">{withdrawal.ifscCode}</p>
                </div>
              </div>
            ) : (
              <div className="text-sm">
                <span className="text-gray-500 dark:text-gray-400">UPI ID:</span>
                <p className="font-mono">{withdrawal.upiId}</p>
              </div>
            )}
          </div>

          {/* Rejection Reason (if rejected) */}
          {withdrawal.rejectionReason && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 rounded-lg">
              <p className="text-sm font-medium text-red-800 dark:text-red-300 mb-2">
                Rejection Reason:
              </p>
              <p className="text-sm text-red-700 dark:text-red-400">
                {withdrawal.rejectionReason}
              </p>
            </div>
          )}

          {/* Rejection Input (when rejecting) */}
          {showRejectInput && (
            <div className="space-y-2">
              <Label htmlFor="rejectionReason">Rejection Reason *</Label>
              <Textarea
                id="rejectionReason"
                placeholder="Enter reason for rejection..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
                className="resize-none"
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            {withdrawal.status === "PENDING" && (
              <>
                {!showRejectInput ? (
                  <>
                    <Button
                      onClick={handleApprove}
                      disabled={isPending}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      onClick={() => setShowRejectInput(true)}
                      disabled={isPending}
                      variant="destructive"
                      className="flex-1"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      onClick={() => {
                        setShowRejectInput(false);
                        setRejectionReason("");
                      }}
                      variant="outline"
                      className="flex-1"
                      disabled={isPending}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleReject}
                      disabled={isPending || !rejectionReason.trim()}
                      variant="destructive"
                      className="flex-1"
                    >
                      Confirm Rejection
                    </Button>
                  </>
                )}
              </>
            )}

            {withdrawal.status === "APPROVED" && (
              <Button
                onClick={handleComplete}
                disabled={isPending}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Mark as Completed
              </Button>
            )}

            {(withdrawal.status === "COMPLETED" ||
              withdrawal.status === "REJECTED" ||
              withdrawal.status === "FAILED") && (
              <Button onClick={onClose} variant="outline" className="flex-1">
                Close
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WithdrawalDetailModal;
