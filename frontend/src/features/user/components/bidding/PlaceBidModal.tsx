import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../../../components/ui/dialog";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import { toast } from "react-hot-toast";
import { usePlaceBid } from "../../hooks/bidding/usePlaceBid";
import { useGetWallet } from "../../hooks/wallet/useGetWallet";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../redux/store";
import { AlertCircle, Wallet } from "lucide-react";

interface PlaceBidModalProps {
  isOpen: boolean;
  onClose: () => void;
  auction: any;
  onBidPlaced: () => void;
}

export const PlaceBidModal = ({ isOpen, onClose, auction, onBidPlaced }: PlaceBidModalProps) => {
  const [amount, setAmount] = useState<number>(0);
  const { mutateAsync: placeBid, isPending: loading } = usePlaceBid();
  const walletData = useSelector((state: RootState) => state.wallet);
  const user = useSelector((state: RootState) => state.user.user);
  
  // Get fresh highest bid from Redux (updated via socket)
  const reduxHighestBid = useSelector((state: any) => state.bidding.currentHighestBid);
  const currentHighestBid = reduxHighestBid > 0 ? reduxHighestBid : auction.currentBid;

  // Refetch wallet on mount to ensure freshness, but rely on Redux for display
  useGetWallet();
  
  // Initialize bid amount to next likely step
  useEffect(() => {
    if (isOpen) {
        setAmount(currentHighestBid > 0 ? currentHighestBid + 10 : auction.startPrice);
    }
  }, [isOpen, currentHighestBid, auction.startPrice]);

  // Determine user's previous bid amount on this auction
  const myHighestBid = auction.bids && auction.bids.length > 0 
    ? auction.bids
        .filter((bid: any) => bid.bidderId === user?.id)
        .reduce((max: any, bid: any) => bid.amount > max.amount ? bid : max, { amount: 0 })
    : { amount: 0 };
    
  // Check if I am the current highest bidder (global)
  // We compare my highest bid against the absolute current highest
  const isSelfOutbid = myHighestBid.amount === currentHighestBid && currentHighestBid > 0;
  const previousLockedAmount = isSelfOutbid ? myHighestBid.amount : 0;
  
  // Calculate required lock
  const requiredLock = Math.max(0, amount - previousLockedAmount);
  
  // Wallet Calculations
  const availableBalance = walletData?.balance || 0;
  const lockedBalance = walletData?.lockedAmount || 0; 
  const freeBalance = availableBalance - lockedBalance;

  // Validation
  // If no bids yet, must be >= startPrice. If bids exist, must be > currentBid
  const isValidBid = amount > currentHighestBid && amount >= auction.startPrice;
  const hasFunds = freeBalance >= requiredLock;
  
  const handleBid = async () => {
    if (!isValidBid) {
      toast.error("Bid must be higher than current bid and start price");
      return;
    }
    if (!hasFunds) {
        toast.error("Insufficient free wallet balance");
        return;
    }

    try {
      await placeBid({ auctionId: auction.id, amount });
      // toast is handled in usePlaceBid hook
      onBidPlaced(); // This should refetch wallet
      onClose();
    } catch (error: any) {
      // Error handled by hook
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-indigo-500" />
            Place a Bid
          </DialogTitle>
        </DialogHeader>
        
        {/* Wallet Stats */}
        <div className="bg-muted/30 p-3 rounded-lg border text-sm space-y-2">
             <div className="flex justify-between">
                <span className="text-muted-foreground">Wallet Balance:</span>
                <span className="font-semibold">{availableBalance.toLocaleString()} AC</span>
             </div>
             <div className="flex justify-between text-amber-600">
                <span>Locked Amount:</span>
                <span>{lockedBalance.toLocaleString()} AC</span>
             </div>
             <div className="flex justify-between border-t pt-2 mt-1">
                <span className="font-bold">Free Balance:</span>
                <span className={`font-bold ${hasFunds ? 'text-emerald-600' : 'text-destructive'}`}>
                    {freeBalance.toLocaleString()} AC
                </span>
             </div>
        </div>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="current" className="text-right text-muted-foreground">
              Current
            </Label>
            <div className="col-span-3 font-bold text-lg">
                {currentHighestBid > 0 ? currentHighestBid.toLocaleString() : "No Bids"} <span className="text-xs font-normal text-muted-foreground">AC</span>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right font-bold">
              Your Bid
            </Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className={`col-span-3 font-bold text-lg ${!hasFunds || !isValidBid ? 'border-destructive focus-visible:ring-destructive' : 'border-indigo-500/50'}`}
            />
          </div>
          
          {/* Lock Info */}
          <div className="bg-blue-500/10 p-3 rounded-lg border border-blue-500/20 text-sm">
             <div className="flex justify-between items-center text-blue-700 dark:text-blue-300">
                <span className="flex items-center gap-2">
                    Lock Amount:
                    {isSelfOutbid && <span className="text-[10px] bg-blue-500/20 px-1.5 rounded uppercase tracking-wider">Top Up</span>}
                </span>
                <span className="font-bold text-lg">{requiredLock.toLocaleString()} AC</span>
             </div>
             {isSelfOutbid ? (
                 <p className="text-[10px] text-blue-600/70 mt-1">
                     (Only locking difference from your previous bid of {previousLockedAmount})
                 </p>
             ) : (
                myHighestBid.amount > 0 && (
                    <p className="text-[10px] text-orange-600/80 mt-1 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        Previous bid funds were returned. Locking full amount.
                    </p>
                )
             )}
          </div>
          
          {/* Errors */}
          {!isValidBid && amount > 0 && (
              <p className="text-xs text-destructive font-medium flex items-center gap-1 justify-center">
                  <AlertCircle className="h-3 w-3" /> Bid must be higher than {(currentHighestBid || auction.startPrice).toLocaleString()}
              </p>
          )}
          {!hasFunds && isValidBid && (
               <p className="text-xs text-destructive font-bold flex items-center gap-1 justify-center">
                  <AlertCircle className="h-3 w-3" /> Insufficient funds to lock {requiredLock.toLocaleString()} coins.
              </p>
          )}

        </div>
        <DialogFooter>
            <Button variant="outline" onClick={onClose} disabled={loading}>Cancel</Button>
            <Button 
                onClick={handleBid} 
                disabled={loading || !isValidBid || !hasFunds}
                className="bg-indigo-600 hover:bg-indigo-500 w-full sm:w-auto"
            >
                {loading ? "Placing..." : `Confirm for ${amount.toLocaleString()} AC`}
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
