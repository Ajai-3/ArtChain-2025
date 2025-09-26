// components/admin/RejectModal.tsx
import React, { useState } from "react";
import { Button } from "../../../../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../../../../components/ui/dialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../../../components/ui/select";
import { Input } from "../../../../components/ui/input";
import CustomLoader from "../../../../components/CustomLoader";

interface RejectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  isLoading?: boolean;
}

const RejectModal: React.FC<RejectModalProps> = ({ isOpen, onClose, onConfirm, isLoading }) => {
  const [reason, setReason] = useState("");
  const [customReason, setCustomReason] = useState("");

  const handleConfirm = () => {
    const finalReason = reason === "other" ? customReason : reason;
    if (!finalReason.trim()) return;
    onConfirm(finalReason);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Reject Artist Request</DialogTitle>
          <DialogDescription>Please provide a reason for rejection.</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3">
          <Select onValueChange={setReason}>
            <SelectTrigger>
              <SelectValue placeholder="Select a reason" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Incomplete profile">Incomplete profile</SelectItem>
              <SelectItem value="Invalid details">Invalid details</SelectItem>
              <SelectItem value="Suspicious activity">Suspicious activity</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>

          {reason === "other" && (
            <Input
              placeholder="Enter custom reason"
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
            />
          )}
        </div>

        <DialogFooter className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button
            onClick={handleConfirm}
            disabled={isLoading}
            variant="destructive"
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isLoading ? <CustomLoader /> : "Reject"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RejectModal;
