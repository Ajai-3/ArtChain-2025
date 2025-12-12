import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setActiveAuction, addBid } from "../../../../redux/slices/biddingSlice";
import { getBiddingSocket } from "../../../../socket/socketManager";

export const useBiddingSocket = (auctionId: string | undefined) => {
  const dispatch = useDispatch();
  const bids = useSelector((state: any) => state.bidding.bids);
  const [activeUsers, setActiveUsers] = useState<number>(0);

  useEffect(() => {
    if (!auctionId) return;

    dispatch(setActiveAuction(auctionId));
    
    // Get the global socket instance
    const socket = getBiddingSocket();
    
    if (socket && socket.connected) {
        socket.emit("join_auction", auctionId);
    } else {
        // Retry logic or listener for connection could be added here if critical
        // For now, assume provider initializes it eventually
        const checkInterval = setInterval(() => {
             const s = getBiddingSocket();
             if (s && s.connected) {
                 s.emit("join_auction", auctionId);
                 clearInterval(checkInterval);
             }
        }, 1000); // Check every second
        
        // Clean up interval on unmount
        return () => clearInterval(checkInterval);
    }

    // Listeners
    const handleNewBid = (newBid: any) => {
        console.log("⚡ [Frontend Hook] Received 'bid_placed' event:", newBid);
        dispatch(addBid(newBid));
    };

    const handleAuctionEnded = (_data: any) => {
         // Could dispatch an action to update status
         // For now, just invalidate queries to fetch final state
         // But optimally: dispatch(updateAuctionStatus('ENDED'));
    };
    
    const handleActiveUsers = (count: number) => {
        setActiveUsers(count);
    };

    socket?.on("bid_placed", handleNewBid);
    socket?.on("auction_ended", handleAuctionEnded);
    socket?.on("active_users", handleActiveUsers);

    return () => {
      const s = getBiddingSocket();
      if (s) {
        s.emit("leave_auction", auctionId);
        s.off("bid_placed", handleNewBid);
        s.off("auction_ended", handleAuctionEnded);
        s.off("active_users", handleActiveUsers);
      }
    };
  }, [auctionId, dispatch]);

  return { bids, activeUsers };
};
