import { useNavigate } from "react-router-dom";
import { useAuctions } from "../../hooks/bidding/useAuctions";
import { AuctionCard } from "../../components/bidding/AuctionCard";
import { AuctionCardSkeleton } from "../../components/bidding/AuctionCardSkeleton";
import { Button } from "../../../../components/ui/button";
import { Plus, Filter, Gavel } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../../components/ui/popover";
import { Calendar } from "../../../../components/ui/calendar";
import { format } from "date-fns";
import { useState } from "react";
import { CreateAuctionModal } from "../../components/bidding/CreateAuctionModal";
import { Badge } from "../../../../components/ui/badge";

export default function BiddingListPage() {
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const navigate = useNavigate();
  
  const formattedDate = date ? format(date, "yyyy-MM-dd") : "";

  const { data: auctions = [], isLoading: loading, isFetching } = useAuctions(
      statusFilter, 
      formattedDate, 
      ""
  );
  
  const [isVisiable, setIsVisiable] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const activeFilters = (statusFilter !== "ALL" ? 1 : 0) + (date ? 1 : 0);

  const clearFilters = () => {
      setStatusFilter("ALL");
      setDate(undefined);
  };

  return (
    <div className="space-y-6 container mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border/40 pb-4">
        <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Auctions</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Place your bids on exclusive digital art.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
             <Button variant="outline" size="sm" onClick={() => navigate("/bidding/my-bids")}>
                 <Gavel className="mr-2 h-4 w-4" /> My Bids
             </Button>

             <Popover open={isVisiable} onOpenChange={setIsVisiable}>
                <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="h-9 relative border-dashed">
                        <Filter className="mr-2 h-4 w-4" />
                        Filters
                        {activeFilters > 0 && (
                            <Badge variant="secondary" className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px]">
                                {activeFilters}
                            </Badge>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-5" align="end">
                    <div className="space-y-4">
                        <div className="flex justify-between items-center border-b border-border/50 pb-2">
                            <h4 className="font-semibold leading-none">Filter Auctions</h4>
                            {activeFilters > 0 && (
                                <button onClick={clearFilters} className="text-xs text-primary font-medium hover:underline">
                                    Reset
                                </button>
                            )}
                        </div>
                        
                        <div className="space-y-2">
                             <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</label>
                             <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="h-9 w-full">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">All Statuses</SelectItem>
                                    <SelectItem value="ACTIVE">Live Active</SelectItem>
                                    <SelectItem value="SCHEDULED">Scheduled Upcoming</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                             <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Start Date</label>
                             <div className="rounded-md border bg-card">
                                 <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={setDate}
                                    initialFocus
                                    className="p-3"
                                 />
                             </div>
                        </div>
                    </div>
                </PopoverContent>
             </Popover>

            <Button size="sm" variant="main" onClick={() => setIsCreateModalOpen(true)}>
                <Plus className="mr-2 h-4 w-4" /> Create
            </Button>
        </div>
      </div>

      {/* Grid */}
      {(loading) ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                  <AuctionCardSkeleton key={i} />
              ))}
          </div>
      ) : auctions.length === 0 ? (
        <div className="text-center py-20 rounded-xl bg-muted/20 border border-dashed border-border/60">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4 opacity-50">
                 <Filter className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-1">No auctions found</h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-4">
                No auctions match your selected filters.
            </p>
            {activeFilters > 0 && (
                 <Button variant="outline" size="sm" onClick={clearFilters}>
                     Clear Filters
                 </Button>
            )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {auctions?.map((auction: any) => (
            <AuctionCard key={auction.id} auction={auction} />
          ))}
        </div>
      )}

      <CreateAuctionModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onAuctionCreated={() => window.location.reload()} 
      />
    </div>
  );
};
