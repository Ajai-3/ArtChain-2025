import React from 'react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";

interface CommissionFiltersProps {
  statusFilter: string;
  onStatusChange: (status: string) => void;
}

const CommissionFilters: React.FC<CommissionFiltersProps> = ({ statusFilter, onStatusChange }) => {
  return (
    <div className="flex items-center gap-4 mb-4">
      <Select value={statusFilter} onValueChange={onStatusChange}>
        <SelectTrigger className="w-[180px] bg-zinc-900 border-zinc-800 text-zinc-300">
          <SelectValue placeholder="All Statuses" />
        </SelectTrigger>
        <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-300">
            <SelectItem value="ALL">All Statuses</SelectItem>
            <SelectItem value="REQUESTED">Requested</SelectItem>
            <SelectItem value="NEGOTIATING">Negotiating</SelectItem>
            <SelectItem value="AGREED">Agreed</SelectItem>
            <SelectItem value="LOCKED">Locked</SelectItem>
            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
            <SelectItem value="DELIVERED">Delivered</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
            <SelectItem value="DISPUTE_RAISED">Disputes</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default CommissionFilters;
