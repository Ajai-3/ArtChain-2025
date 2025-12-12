import React from "react";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import type { DateRange } from "react-day-picker";
import { cn } from "../../../../libs/utils";
import { Button } from "../../../../components/ui/button";
import { Calendar } from "../../../../components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../../components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";

interface AuctionFiltersProps {
  status: string;
  onStatusChange: (value: string) => void;
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
}

const AuctionFilters: React.FC<AuctionFiltersProps> = ({
  status,
  onStatusChange,
  dateRange,
  onDateRangeChange,
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      
      {/* Date Range Picker */}
      <div className="flex-1 sm:max-w-[300px]">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800",
                !dateRange && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange?.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, "LLL dd, y")} -{" "}
                    {format(dateRange.to, "LLL dd, y")}
                  </>
                ) : (
                  format(dateRange.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date range</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateRange?.from}
              selected={dateRange}
              onSelect={onDateRangeChange}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex gap-2 w-full sm:w-auto">
        <Select value={status} onValueChange={onStatusChange}>
          <SelectTrigger className="w-full sm:w-[150px] bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-zinc-900">
            <SelectItem value="ALL">All Status</SelectItem>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="SCHEDULED">Scheduled</SelectItem>
            <SelectItem value="ENDED">Ended</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default AuctionFilters;
