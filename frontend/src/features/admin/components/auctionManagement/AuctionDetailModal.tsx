import React, { useMemo, useEffect, useRef } from "react";
import { Dialog, DialogContent } from "../../../../components/ui/dialog";
import { useGetAuctionById } from "../../hooks/auctionManagement/useGetAuctionById";
import { useGetAuctionBids } from "../../hooks/auctionManagement/useGetAuctionBids";
import { format } from "date-fns";
import { Tag, User, DollarSign, Award, X, Trophy, Gavel, ExternalLink, Clock } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { Link } from "react-router-dom";

interface AuctionDetailModalProps {
  auctionId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

const AuctionDetailModal: React.FC<AuctionDetailModalProps> = ({
  auctionId,
  isOpen,
  onClose,
}) => {
  const { data: auction, isLoading: isLoadingAuction } = useGetAuctionById(auctionId);
  const {
    data: bidsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoadingBids,
  } = useGetAuctionBids(auctionId);

  // Native Intersection Observer for Infinite Scroll
  const observerTarget = useRef<HTMLTableRowElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [hasNextPage, fetchNextPage, isFetchingNextPage]);

  // Flatten bids from pages
  const allBids = useMemo(() => bidsData?.pages.flatMap((page) => page.bids) || [], [bidsData]);
  const totalBids = bidsData?.pages[0]?.total || 0;
  
  // Calculate unique participants from loaded bids (Frontend approximation)
  const uniqueBidders = useMemo(() => {
    const bidders = new Set(allBids.map(b => b.bidderId));
    return bidders.size;
  }, [allBids]);
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] md:max-w-[1000px] p-0 overflow-hidden bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 gap-0">
        <div className="absolute top-4 right-4 z-50">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full w-8 h-8 bg-white/50 hover:bg-white dark:bg-black/50 dark:hover:bg-zinc-800 backdrop-blur-sm"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {isLoadingAuction ? (
          <div className="flex justify-center items-center h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-900 dark:border-zinc-100"></div>
          </div>
        ) : auction ? (
          <div className="flex flex-col md:flex-row h-[85vh] md:h-[600px]">
            {/* LEFT SIDE: Full Details (No Scroll) */}
            <div className="w-full md:w-[40%] bg-zinc-50 dark:bg-zinc-900/30 p-6 flex flex-col border-b md:border-b-0 md:border-r border-zinc-200 dark:border-zinc-800">
               
               {/* 1. Image Area (Flexible Height) */}
               <div className="flex-1 flex items-center justify-center min-h-0 mb-4">
                  <div className="relative w-full aspect-square max-w-[240px] rounded-xl overflow-hidden bg-white dark:bg-zinc-800 shadow-sm border border-zinc-200 dark:border-zinc-700">
                     {auction.imageKey ? (
                        <img
                        src={auction.imageKey}
                        alt={auction.title}
                        className="w-full h-full object-contain p-2"
                        />
                     ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-zinc-400">
                           <Tag className="w-10 h-10 mb-2 opacity-20" />
                           <span className="text-xs">No Image</span>
                        </div>
                     )}
                     <div className="absolute top-3 right-3">
                         <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold border shadow-sm ${
                                auction.status === "ACTIVE"
                                ? "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/50 dark:text-green-400 dark:border-green-800"
                                : auction.status === "SCHEDULED"
                                ? "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/50 dark:text-blue-400 dark:border-blue-800"
                                : "bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700"
                            }`}
                            >
                            {auction.status}
                        </span>
                    </div>
                  </div>
               </div>

               {/* 2. Title & Date */}
               <div className="text-center mb-2">
                 <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-1 leading-tight">
                    {auction.title}
                 </h2>
                 <p className="text-xs text-zinc-500 inline-flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {format(new Date(auction.startTime), "MMM d, h:mm a")} - {format(new Date(auction.endTime), "MMM d, h:mm a")}
                 </p>
               </div>

               {/* 3. CURRENT BID (Prominent) */}
               <div className="mb-4 bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                   <div className="flex items-center justify-between mb-2">
                       <span className="text-xs font-semibold text-zinc-500 uppercase flex items-center gap-1.5">
                           <Gavel className="w-3.5 h-3.5" /> Current Highest Bid
                       </span>
                       <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[10px] px-2 py-0.5 rounded-full font-bold">
                           Active
                       </span>
                   </div>
                   <div className="flex items-end gap-1">
                       <span className="text-3xl font-bold text-green-600 tracking-tight">
                           {auction.currentBid || auction.startPrice}
                       </span>
                       <span className="text-sm font-medium text-zinc-500 mb-1.5">AC</span>
                   </div>
               </div>

               {/* 4. Secondary Stats Grid */}
               <div className="grid grid-cols-2 gap-3 mb-4">
                   <div className="flex flex-col p-3 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-sm">
                       <span className="text-[10px] text-zinc-500 uppercase font-medium mb-1 flex items-center gap-1.5">
                           <User className="w-3.5 h-3.5" /> Participants
                       </span>
                       <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{uniqueBidders}</span>
                   </div>
                   <div className="flex flex-col p-3 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-sm">
                       <span className="text-[10px] text-zinc-500 uppercase font-medium mb-1 flex items-center gap-1.5">
                           <DollarSign className="w-3.5 h-3.5" /> Start Price
                       </span>
                       <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{auction.startPrice} AC</span>
                   </div>
               </div>

               {/* 5. Host Info (with Link) */}
               <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-3 flex items-center justify-between gap-3 shadow-sm group hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
                  <div className="flex items-center gap-3">
                      {auction.host?.profileImage ? (
                          <img src={auction.host.profileImage} className="w-8 h-8 rounded-full object-cover"/>
                      ) : <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center"><User className="w-4 h-4 text-zinc-400"/></div>}
                      <div className="flex flex-col">
                          <span className="text-[10px] text-zinc-400 uppercase">Hosted by</span>
                          <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{auction.host?.username || "Unknown"}</span>
                      </div>
                  </div>
                  {auction.host?.username && (
                    <Link to={`/${auction.host.username}`} target="_blank" className="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
                        <ExternalLink className="w-4 h-4" />
                    </Link>
                  )}
               </div>
            </div>

            {/* RIGHT SIDE: Winner & Bids Table */}
            <div className="w-full md:w-[60%] flex flex-col h-full bg-white dark:bg-zinc-950">
              
              {/* Winner Section ONLY (If Exists) */}
                {auction.winner && (
                    <div className="flex-shrink-0 p-6 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/30 dark:bg-zinc-900/5">
                        <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/10 dark:to-orange-900/10 border border-yellow-100 dark:border-yellow-900/30 rounded-xl">
                            <div className="relative flex-shrink-0">
                                {auction.winner.profileImage ? (
                                    <img src={auction.winner.profileImage} className="w-14 h-14 rounded-full object-cover border-2 border-white dark:border-zinc-900 shadow-sm"/>
                                ) : (
                                    <div className="w-14 h-14 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center border-2 border-white dark:border-zinc-900 shadow-sm">
                                        <Trophy className="w-6 h-6 text-yellow-600 dark:text-yellow-500"/>
                                    </div>
                                )}
                                <div className="absolute -bottom-1 -right-1 bg-yellow-500 text-white p-1 rounded-full border-2 border-white dark:border-zinc-900">
                                   <Trophy className="w-3 h-3" />
                                </div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs text-yellow-700 dark:text-yellow-500 font-bold uppercase tracking-wider mb-0.5">Auction Winner</p>
                                <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100 truncate">{auction.winner.name || auction.winner.username}</p>
                                <p className="text-sm font-medium text-zinc-500">
                                   Winning Bid: <span className="text-green-600 dark:text-green-500">{auction.currentBid || auction.startPrice} AC</span>
                                </p>
                            </div>
                            
                             {auction.winner?.username && (
                                <Link to={`/${auction.winner.username}`} target="_blank" className="p-2 text-yellow-600/50 hover:text-yellow-700 hover:bg-yellow-100/50 rounded-full transition-colors ml-2">
                                    <ExternalLink className="w-4 h-4" />
                                </Link>
                              )}
                        </div>
                    </div>
                )}

              {/* Bids Table Header */}
               <div className="px-6 py-3 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-white dark:bg-zinc-950">
                   <h3 className="text-sm font-semibold flex items-center gap-2">
                     <Award className="w-4 h-4 text-zinc-400"/>
                     Bid History
                   </h3>
                   <span className="text-xs bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full text-zinc-500">
                     {totalBids} Total
                   </span>
                </div>

              {/* Bids List - Scrollable */}
              <div className="flex-1 overflow-hidden scrollbar flex flex-col bg-white dark:bg-zinc-950 relative">
                <div className="flex-1 overflow-y-auto custom-scrollbar p-0">
                  {isLoadingBids ? (
                    <div className="flex justify-center py-10">
                       <span className="animate-spin w-5 h-5 border-2 border-zinc-300 border-t-zinc-600 rounded-full"></span>
                    </div>
                  ) : allBids.length > 0 ? (
                    <table className="w-full text-sm">
                        <thead className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-10">
                            <tr>
                                <th className="px-6 py-2.5 text-left font-medium text-zinc-500 text-[10px] uppercase tracking-wider">Bidder</th>
                                <th className="px-6 py-2.5 text-right font-medium text-zinc-500 text-[10px] uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-2.5 text-right font-medium text-zinc-500 text-[10px] uppercase tracking-wider">Time</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 bg-white dark:bg-zinc-950">
                          {allBids.map((bid, index) => (
                            <tr key={bid.id || index} className="group hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                              <td className="px-6 py-3">
                                <div className="flex items-center gap-3">
                                  {bid.bidder?.profileImage ? (
                                    <img src={bid.bidder.profileImage} className="w-8 h-8 rounded-full object-cover border border-zinc-100 dark:border-zinc-800"/>
                                  ) : <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center"><User className="w-4 h-4 text-zinc-400"/></div>}
                                  <div className="flex flex-col">
                                      <span className="font-medium text-zinc-900 dark:text-zinc-100 text-xs">
                                        {bid.bidder?.username || "Guest"}
                                      </span>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-3 text-right">
                                  <span className="text-sm font-bold text-green-600 font-mono">
                                    {bid.amount.toLocaleString()}
                                  </span>
                                  <span className="text-[10px] text-zinc-400 ml-1">AC</span>
                              </td>
                              <td className="px-6 py-3 text-right">
                                    <span className="text-xs text-zinc-500">
                                        {format(new Date(bid.createdAt), "MMM d, h:mm a")}
                                    </span>
                              </td>
                            </tr>
                          ))}
                          
                           {/* Infinite Scroll Trigger */}
                           {hasNextPage && (
                             <tr ref={observerTarget}>
                               <td colSpan={3} className="text-center py-6">
                                 {isFetchingNextPage ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <span className="w-4 h-4 border-2 border-zinc-200 border-t-zinc-500 rounded-full animate-spin"></span>
                                        <span className="text-xs text-zinc-400">Loading more...</span>
                                    </div>
                                 ) : (
                                    <span className="text-xs text-zinc-300 h-4 block"></span>
                                 )}
                               </td>
                             </tr>
                           )}
                        </tbody>
                    </table>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-40 text-zinc-400">
                      <p className="text-sm font-medium text-zinc-500">No Bids Placed Yet</p>
                      <p className="text-xs text-zinc-400 mt-1">Be the first!</p>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center p-12 text-zinc-500">Auction not found</div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AuctionDetailModal;
