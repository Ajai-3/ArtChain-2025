import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../../components/ui/dialog";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../../../../components/ui/radio-group";
import { useCreateWithdrawalRequest } from "../../hooks/wallet/useCreateWithdrawalRequest";
import { Loader2, Banknote, Smartphone } from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../redux/store";

interface WithdrawalRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WithdrawalRequestModal: React.FC<WithdrawalRequestModalProps> = ({
  isOpen,
  onClose,
}) => {
  const wallet = useSelector((state: RootState) => state.wallet);
  const [method, setMethod] = useState<"BANK_TRANSFER" | "UPI">("UPI");
  const [amount, setAmount] = useState("");
  const [accountHolderName, setAccountHolderName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [upiId, setUpiId] = useState("");

  const { mutate: createRequest, isPending } = useCreateWithdrawalRequest();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: any = {
      amount: parseFloat(amount),
      method,
    };

    if (method === "BANK_TRANSFER") {
      payload.accountHolderName = accountHolderName;
      payload.accountNumber = accountNumber;
      payload.ifscCode = ifscCode;
    } else {
      payload.upiId = upiId;
    }

    createRequest(payload, {
      onSuccess: () => {
        onClose();
        setAmount("");
        setAccountHolderName("");
        setAccountNumber("");
        setIfscCode("");
        setUpiId("");
      },
    });
  };

  const availableBalance = wallet.balance || 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto custom-scrollbar">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            New Withdrawal Request
          </DialogTitle>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Available Balance: <span className="font-semibold text-main-color">{availableBalance.toLocaleString()} AC</span>
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (AC)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min={100}
              max={availableBalance}
              required
              className="text-lg"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Minimum: 100 AC | Maximum: {availableBalance.toLocaleString()} AC
            </p>
          </div>

          {/* Method Selection */}
          <div className="space-y-3">
            <Label>Withdrawal Method</Label>
            <RadioGroup
              value={method}
              onValueChange={(value) => setMethod(value as "BANK_TRANSFER" | "UPI")}
              className="grid grid-cols-2 gap-4"
            >
              <div>
                <RadioGroupItem
                  value="UPI"
                  id="upi"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="upi"
                  className="flex flex-col items-center justify-between rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 hover:bg-gray-50 dark:hover:bg-gray-900/50 peer-data-[state=checked]:border-main-color peer-data-[state=checked]:bg-main-color/5 cursor-pointer transition-all"
                >
                  <Smartphone className="mb-3 h-6 w-6" />
                  <span className="text-sm font-medium">UPI</span>
                </Label>
              </div>
              <div>
                <RadioGroupItem
                  value="BANK_TRANSFER"
                  id="bank"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="bank"
                  className="flex flex-col items-center justify-between rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 hover:bg-gray-50 dark:hover:bg-gray-900/50 peer-data-[state=checked]:border-main-color peer-data-[state=checked]:bg-main-color/5 cursor-pointer transition-all"
                >
                  <Banknote className="mb-3 h-6 w-6" />
                  <span className="text-sm font-medium">Bank Transfer</span>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Conditional Fields */}
          {method === "UPI" ? (
            <div className="space-y-2">
              <Label htmlFor="upiId">UPI ID</Label>
              <Input
                id="upiId"
                type="text"
                placeholder="yourname@upi"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                required
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="accountHolderName">Account Holder Name</Label>
                <Input
                  id="accountHolderName"
                  type="text"
                  placeholder="Enter account holder name"
                  value={accountHolderName}
                  onChange={(e) => setAccountHolderName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="accountNumber">Account Number</Label>
                <Input
                  id="accountNumber"
                  type="text"
                  placeholder="Enter account number"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ifscCode">IFSC Code</Label>
                <Input
                  id="ifscCode"
                  type="text"
                  placeholder="Enter IFSC code"
                  value={ifscCode}
                  onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                  required
                />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-main-color hover:bg-main-color/90"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                "Submit Request"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default WithdrawalRequestModal;
