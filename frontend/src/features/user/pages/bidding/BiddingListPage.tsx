import { useAuctions } from "../../hooks/bidding/useBidding";
import { AuctionCard } from "../../components/bidding/AuctionCard";
import PageFallback from "../../../../components/PageFallback";
import { Button } from "../../../../components/ui/button";
import { Plus } from "lucide-react";

import { useState } from "react";
import { CreateAuctionModal } from "../../components/bidding/CreateAuctionModal";

export default function BiddingListPage() {
  const { auctions, loading } = useAuctions();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  if (loading) return <PageFallback />;

  // Note: Optimistic update or refetch would be ideal here. 
  // For now, page reload or socket event might handle it, but simple reload logic is easier to add if needed.
  // Actually, useAuctions runs on mount. Triggering a refetch would require hoisting state or using a query library.
  // I will just let the user refresh or rely on eventual consistency for now, or add window.location.reload as a crude fix if needed, 
  // but better to just let it be.

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Art Auctions</h1>
            <p className="text-muted-foreground mt-2">Bid on exclusive digital art pieces.</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Create Auction
        </Button>
      </div>

      {auctions.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
            No active auctions found. Check back later!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {auctions?.map((auction) => (
            <AuctionCard key={auction._id} auction={auction} />
          ))}
        </div>
      )}

      <CreateAuctionModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onAuctionCreated={() => window.location.reload()} // Simple refresh for now to see new auction
      />
    </div>
  );
};
