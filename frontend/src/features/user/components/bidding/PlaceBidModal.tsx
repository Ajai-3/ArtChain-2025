import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../../../components/ui/dialog";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import { toast } from "react-hot-toast";
import { usePlaceBid } from "../../hooks/bidding/usePlaceBid";

interface PlaceBidModalProps {
  isOpen: boolean;
  onClose: () => void;
  auction: any;
  onBidPlaced: () => void;
}

export const PlaceBidModal = ({ isOpen, onClose, auction, onBidPlaced }: PlaceBidModalProps) => {
  const [amount, setAmount] = useState<number>(auction.currentBid + 10);
  const { mutateAsync: placeBid, isPending: loading } = usePlaceBid();

  const handleBid = async () => {
    if (amount <= auction.currentBid) {
      toast.error("Bid must be higher than current bid");
      return;
    }
    if (amount < auction.startPrice) {
        toast.error("Bid must be at least start price");
        return;
    }

    try {
      await placeBid({ auctionId: auction._id, amount });
      onBidPlaced();
      onClose();
    } catch (error) {
      // Handled by hook
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Place a Bid</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="current" className="text-right">
              Current
            </Label>
            <div className="col-span-3 font-bold">{auction.currentBid} Coins</div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">
              Your Bid
            </Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
            <Button variant="outline" onClick={onClose} disabled={loading}>Cancel</Button>
            <Button onClick={handleBid} disabled={loading}>
                {loading ? "Placing..." : "Confirm Bid"}
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
