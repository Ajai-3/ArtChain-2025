import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";

interface ReportFiltersProps {
  status: string;
  setStatus: (value: string) => void;
  targetType: string;
  setTargetType: (value: string) => void;
}

export const ReportFilters: React.FC<ReportFiltersProps> = ({
  status,
  setStatus,
  targetType,
  setTargetType,
}) => {
  return (
    <div className="flex gap-4">
      <Select value={status} onValueChange={setStatus}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All Statuses</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="resolved">Resolved</SelectItem>
          <SelectItem value="dismissed">Dismissed</SelectItem>
        </SelectContent>
      </Select>

      <Select value={targetType} onValueChange={setTargetType}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All Types</SelectItem>
          <SelectItem value="ART">Art</SelectItem>
          <SelectItem value="COMMENT">Comment</SelectItem>
          <SelectItem value="USER">User</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
