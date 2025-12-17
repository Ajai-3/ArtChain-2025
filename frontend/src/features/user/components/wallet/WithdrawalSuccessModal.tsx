import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../../components/ui/dialog";
import { Button } from "../../../../components/ui/button";
import { CheckCircle, Lock, RefreshCw, Clock } from "lucide-react";

interface WithdrawalSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  method: string;
  accountDetails: string;
}

const WithdrawalSuccessModal: React.FC<WithdrawalSuccessModalProps> = ({
  isOpen,
  onClose,
  amount,
  method,
  accountDetails,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md w-full bg-background rounded-lg p-6 border border-border">
        <DialogHeader>
          <div className="flex flex-col items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <DialogTitle className="text-2xl font-bold text-center text-foreground">
              Withdrawal Request Submitted!
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Amount Info */}
          <div className="bg-gradient-to-br from-main-color/10 to-purple-600/10 dark:from-main-color/20 dark:to-purple-600/20 p-4 rounded-lg border border-main-color/20">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Withdrawal Amount</p>
              <p className="text-3xl font-bold text-foreground">{amount} AC</p>
              <p className="text-xs text-muted-foreground mt-1">≈ ₹{amount * 10}</p>
            </div>
          </div>

          {/* Payment Details */}
          <div className="bg-secondary/50 p-3 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Payment Method</p>
            <p className="font-semibold text-foreground">{method === "BANK_TRANSFER" ? "Bank Transfer" : "UPI"}</p>
            <p className="text-sm text-muted-foreground mt-1">{accountDetails}</p>
          </div>

          {/* Important Information */}
          <div className="space-y-3 pt-2">
            <div className="flex gap-3 items-start">
              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Lock className="w-4 h-4 text-blue-500" />
              </div>
              <div>
                <p className="font-medium text-sm text-foreground">Amount Moved to Locked Balance</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Your {amount} AC has been moved to locked balance and will be processed shortly.
                </p>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Clock className="w-4 h-4 text-yellow-500" />
              </div>
              <div>
                <p className="font-medium text-sm text-foreground">Processing Time</p>
                <p className="text-xs text-muted-foreground mt-1">
                  An admin will review and approve your request. Funds will be credited to your account within <span className="font-semibold">7 business days</span> after approval.
                </p>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <RefreshCw className="w-4 h-4 text-purple-500" />
              </div>
              <div>
                <p className="font-medium text-sm text-foreground">Automatic Refund</p>
                <p className="text-xs text-muted-foreground mt-1">
                  If any error occurs during processing, the amount will be automatically refunded to your balance.
                </p>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <Button
            onClick={onClose}
            className="w-full mt-4"
            variant="main"
          >
            Got it, Thanks!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WithdrawalSuccessModal;
