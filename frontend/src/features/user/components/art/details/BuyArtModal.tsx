import React from "react";
import { X, Wallet, Loader2 } from "lucide-react";

interface BuyArtModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  artName: string;
  price: number;
  balance: number;
  isLoading: boolean;
}

const BuyArtModal: React.FC<BuyArtModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  artName,
  price,
  balance,
  isLoading,
}) => {
  if (!isOpen) return null;

  const canAfford = balance >= price;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-zinc-800">
          <h2 className="text-lg font-bold text-white">Confirm Purchase</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="flex flex-col gap-2">
            <span className="text-sm text-zinc-400">Buying Artwork</span>
            <span className="text-xl font-semibold text-white">{artName}</span>
          </div>

          <div className="bg-zinc-800/50 rounded-xl p-4 space-y-3 border border-zinc-800">
            <div className="flex justify-between items-center text-sm">
              <span className="text-zinc-400">Price</span>
              <span className="text-white font-medium">{price} AC</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-zinc-400">Your Balance</span>
              <span className={`${canAfford ? "text-green-400" : "text-red-400"} font-medium flex items-center gap-1`}>
                <Wallet size={14} />
                {balance} AC
              </span>
            </div>
            <div className="border-t border-zinc-700 pt-3 flex justify-between items-center text-sm">
               <span className="text-zinc-400">Remaining</span>
               <span className="text-zinc-200 font-medium whitespace-nowrap">
                 {canAfford ? `${balance - price} AC` : "Insufficient Funds"}
               </span>
            </div>
          </div>

          {!canAfford && (
            <div className="text-red-400 text-xs text-center bg-red-500/10 p-2 rounded-lg">
              You do not have enough Art Coins to purchase this artwork.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800 flex gap-3 justify-end bg-zinc-900/50">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-medium text-zinc-300 hover:bg-zinc-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={!canAfford || isLoading}
            className="bg-main-color hover:bg-main-color/90 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading && <Loader2 size={16} className="animate-spin" />}
            Confirm Purchase
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuyArtModal;
