import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setActiveAuction } from "../../../../redux/slices/biddingSlice";
import { getBiddingSocket } from "../../../../socket/socketManager";

export const useBiddingSocket = (auctionId: string | undefined) => {
  const dispatch = useDispatch();
  const bids = useSelector((state: any) => state.bidding.bids);

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
        
        return () => clearInterval(checkInterval);
    }

    return () => {
      const s = getBiddingSocket();
      if (s) {
        s.emit("leave_auction", auctionId);
      }
    };
  }, [auctionId, dispatch]);

  return { bids };
};
