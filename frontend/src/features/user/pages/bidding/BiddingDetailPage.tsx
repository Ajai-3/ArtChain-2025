import { useParams, useNavigate } from "react-router-dom";
import { useAuctionById } from "../../hooks/bidding/useAuctionById";
import { PlaceBidModal } from "../../components/bidding/PlaceBidModal";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setBids, setActiveAuctionData } from "../../../../redux/slices/biddingSlice";
import type { RootState } from "../../../../redux/store";
import { BiddingDetailPageSkeleton } from "../../components/bidding/detail/BiddingDetailPageSkeleton";
import { DetailNavigation } from "../../components/bidding/detail/DetailNavigation";
import { DetailImageSection } from "../../components/bidding/detail/DetailImageSection";
import { DetailHostInfo } from "../../components/bidding/detail/DetailHostInfo";
import { DetailStatsCard } from "../../components/bidding/detail/DetailStatsCard";
import { DetailBidFeed } from "../../components/bidding/detail/DetailBidFeed";

export default function BiddingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Fetch data
  const { data: fetchedAuction, isLoading: loading, refetch } = useAuctionById(id);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sync to Redux
  useEffect(() => {
    if (fetchedAuction) {
        dispatch(setActiveAuctionData(fetchedAuction));
    }
  }, [fetchedAuction, dispatch]);

  // Read from Redux
  const auction = useSelector((state: RootState) => state.bidding.activeAuction);

  if (loading) return <BiddingDetailPageSkeleton />;
  if (!auction) return <div className="h-full flex items-center justify-center text-muted-foreground">Auction not found</div>;

  // Derive granular status
  const isLive = auction.status === 'ACTIVE';
  const isEnded = auction.status === 'ENDED';
  const isScheduled = auction.status === 'SCHEDULED' || (!isLive && !isEnded);
  const isUnsold = isEnded && (!auction.bids || auction.bids.length === 0);

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col md:flex-row gap-4 p-4 md:p-0 overflow-hidden max-w-[1600px] mx-auto">
        {/* Left Panel: Image & Key Info - Takes remaining height */}
        <div className="flex-1 flex flex-col gap-4 min-w-0 h-full">
            <DetailNavigation 
                auction={auction} 
                navigate={navigate} 
                isLive={isLive} 
                isEnded={isEnded} 
                isUnsold={isUnsold} 
            />
            
            <DetailImageSection 
                auction={auction} 
                isLive={isLive} 
                isEnded={isEnded} 
                isUnsold={isUnsold} 
            />

            <DetailHostInfo auction={auction} />
        </div>

        {/* Right Panel: Action & Bids */}
        <div className="w-full md:w-[450px] lg:w-[500px] shrink-0 flex flex-col gap-4 h-full overflow-hidden">
            <DetailStatsCard 
                auction={auction}
                isLive={isLive}
                isEnded={isEnded}
                isScheduled={isScheduled}
                isUnsold={isUnsold}
                onPlaceBid={() => setIsModalOpen(true)}
                refetch={refetch}
            />

            <DetailBidFeed 
                auction={auction}
                isLive={isLive}
                isEnded={isEnded}
                isScheduled={isScheduled}
                isUnsold={isUnsold}
            />
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
