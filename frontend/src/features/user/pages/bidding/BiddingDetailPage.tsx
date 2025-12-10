import { useParams, useNavigate } from "react-router-dom";
import { useAuctionById } from "../../hooks/bidding/useBidding";
import { BiddingBoard } from "../../components/bidding/BiddingBoard";
import { PlaceBidModal } from "../../components/bidding/PlaceBidModal";
import PageFallback from "../../../../components/PageFallback";
import { Button } from "../../../../components/ui/button";
import { Badge } from "../../../../components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";

export default function BiddingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { auction, loading, refetch } = useAuctionById(id);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (loading) return <PageFallback />;
  if (!auction) return <div className="p-10 text-center">Auction not found</div>;

  return (
    <div className="space-y-6">
        <Button variant="ghost" className="mb-4" onClick={() => navigate("/bidding")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Auctions
        </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Image and Details */}
        <div className="space-y-6">
          <div className="aspect-video w-full overflow-hidden rounded-xl border border-border bg-muted">
            <img
              src={auction.artId?.url || "https://via.placeholder.com/800x600"}
              alt={auction.title}
              className="object-contain w-full h-full"
            />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold">{auction.title}</h1>
                    <p className="text-muted-foreground">Original Art by {auction.hostId}</p> 
                </div>
                 <Badge variant={auction.status === "ACTIVE" ? "default" : "secondary"} className="text-lg px-4 py-1">
                    {auction.status}
                </Badge>
            </div>
            
            <p className="text-lg">{auction.description}</p>
            
            <div className="grid grid-cols-2 gap-4 border-t border-border pt-4">
                <div>
                    <span className="text-muted-foreground text-sm">Start Price</span>
                    <p className="font-semibold text-lg">{auction.startPrice} Coins</p>
                </div>
                 <div>
                    <span className="text-muted-foreground text-sm">Time Remaining</span>
                    <p className="font-semibold text-lg">{auction.endTime ? formatDistanceToNow(new Date(auction.endTime), { addSuffix: true }) : "N/A"}</p>
                </div>
            </div>
          </div>
        </div>

        {/* Right Column: Bidding Board and Action */}
        <div className="space-y-6">
          <div className="bg-card p-6 rounded-xl border border-border shadow-sm space-y-4">
            <div className="flex justify-between items-center text-center">
                <div>
                     <span className="text-muted-foreground text-sm">Current Highest Bid</span>
                     <p className="text-4xl font-extrabold text-primary">{auction.currentBid} Coins</p>
                </div>
            </div>
            
            <Button 
                size="lg" 
                className="w-full text-lg py-6"
                onClick={() => setIsModalOpen(true)}
                disabled={auction.status !== "ACTIVE"}
            >
                {auction.status === "ACTIVE" ? "Place Your Bid" : "Auction Ended"}
            </Button>
          </div>

          <BiddingBoard auctionId={auction._id} />
        </div>
      </div>

      <PlaceBidModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        auction={auction}
        onBidPlaced={refetch} 
      />
    </div>
  );
};
