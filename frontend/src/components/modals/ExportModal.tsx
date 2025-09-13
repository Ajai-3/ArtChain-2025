"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Calendar } from "../../components/ui/calendar";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "../../components/ui/select";

interface ExportModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  onExport: (data: { startDate: Date; endDate: Date; format: string }) => void;
}

const ExportModal: React.FC<ExportModalProps> = ({ open, onClose, title, onExport }) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [fileFormat, setFileFormat] = useState<string>("xlsx");

  const handleExport = () => {
    if (!startDate || !endDate) return;
    onExport({ startDate, endDate, format: fileFormat });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl bg-secondary-color">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          {/* Start Date */}
          <div className="flex-1">
            <label className="block mb-1">Start Date</label>
            <Calendar
              mode="single"
              selected={startDate || undefined}
              onSelect={(date) => {
                setStartDate(date || null);
                if (date && endDate && endDate < date) setEndDate(null);
              }}
              defaultMonth={startDate || new Date()}
            />
          </div>

          {/* End Date */}
          <div className="flex-1">
            <label className="block mb-1">End Date</label>
            <Calendar
              mode="single"
              selected={endDate || undefined}
              onSelect={(date) => setEndDate(date || null)}
              disabled={(date) => (startDate ? date < startDate : false)}
              defaultMonth={endDate || startDate || new Date()}
            />
          </div>
        </div>

        {/* File Format */}
        <div className="mt-4">
          <label className="block mb-1">File Format</label>
          <Select value={fileFormat} onValueChange={setFileFormat}>
            <SelectTrigger>
              <SelectValue placeholder="Select format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="xlsx">Excel (.xlsx)</SelectItem>
              <SelectItem value="pdf">PDF</SelectItem>
              <SelectItem value="csv">CSV</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <DialogFooter className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleExport} disabled={!startDate || !endDate}>
            Download
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExportModal;
