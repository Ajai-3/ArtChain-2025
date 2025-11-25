import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../../../components/ui/dialog";
import { Button } from "../../../../components/ui/button";
import { RadioGroup, RadioGroupItem } from "../../../../components/ui/radio-group";
import { Label } from "../../../../components/ui/label";
import { Textarea } from "../../../../components/ui/textarea";
import { useReport } from "../../hooks/report/useReport";
import { Flag, X } from "lucide-react";
import CustomLoader from "../../../../components/CustomLoader";

interface ContentOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetId: string;
  targetType: "art" | "comment" | "user";
}

type ModalView = "options" | "report";

const REPORT_REASONS = [
  { id: "inappropriate", label: "Inappropriate Content" },
  { id: "spam", label: "Spam or Misleading" },
  { id: "harassment", label: "Harassment or Bullying" },
  { id: "hate_speech", label: "Hate Speech" },
  { id: "other", label: "Other" },
];

export const ContentOptionsModal: React.FC<ContentOptionsModalProps> = ({
  isOpen,
  onClose,
  targetId,
  targetType,
}) => {
  const [view, setView] = useState<ModalView>("options");
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [otherReason, setOtherReason] = useState<string>("");
  const { mutate: report, isPending } = useReport();

  const handleClose = () => {
    setView("options");
    setSelectedReason("");
    setOtherReason("");
    onClose();
  };

  const handleReportSubmit = () => {
    if (!selectedReason) return;
    if (selectedReason === "other" && !otherReason.trim()) return;

    report(
      {
        targetId,
        targetType,
        reason: selectedReason,
        description: selectedReason === "other" ? otherReason : undefined,
      },
      {
        onSuccess: () => {
          handleClose();
          // You might want to show a toast here
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[425px] bg-zinc-900 border-zinc-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {view === "options" ? "Options" : "Report Content"}
          </DialogTitle>
        </DialogHeader>

        {view === "options" ? (
          <div className="flex flex-col gap-2 py-4">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-500 hover:text-red-400 hover:bg-red-500/10"
              onClick={() => setView("report")}
            >
              <Flag className="mr-2 h-4 w-4" />
              Report
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-zinc-300 hover:text-white hover:bg-zinc-800"
              onClick={handleClose}
            >
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-4 py-4">
            <p className="text-sm text-zinc-400">
              Please select a reason for reporting this content.
            </p>
            <RadioGroup
              value={selectedReason}
              onValueChange={setSelectedReason}
              className="gap-3"
            >
              {REPORT_REASONS.map((reason) => (
                <div key={reason.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={reason.id} id={reason.id} className="border-zinc-600 text-main-color" />
                  <Label htmlFor={reason.id} className="text-zinc-300 cursor-pointer">
                    {reason.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>

            {selectedReason === "other" && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                <Label htmlFor="other-reason" className="text-zinc-300">
                  Please specify
                </Label>
                <Textarea
                  id="other-reason"
                  placeholder="Tell us more about the issue..."
                  value={otherReason}
                  onChange={(e) => setOtherReason(e.target.value)}
                  className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                />
              </div>
            )}

            <DialogFooter className="mt-4 gap-2 sm:gap-0">
              <Button
                variant="outline"
                onClick={() => setView("options")}
                className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white"
              >
                Back
              </Button>
              <Button
                onClick={handleReportSubmit}
                disabled={
                  !selectedReason ||
                  (selectedReason === "other" && !otherReason.trim()) ||
                  isPending
                }
                className="bg-red-600 hover:bg-red-700 text-white border-none"
              >
                {isPending ? <CustomLoader /> : "Submit Report"}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
