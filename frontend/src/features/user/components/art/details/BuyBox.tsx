import React from "react";

interface BuyBoxProps {
  price?: {
    artcoins?: number;
    fiat?: number;
  };
  onBuy: () => void;
  isLoading?: boolean;
}

const BuyBox: React.FC<BuyBoxProps> = ({ price, onBuy, isLoading }) => {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 mb-4 shadow-lg">
      <h3 className="text-base font-semibold text-white mb-3">Purchase Artwork</h3>
      
      <div className="flex items-baseline gap-2 mb-4">
        <span className="text-2xl font-bold text-main-color">
          {price?.artcoins?.toLocaleString()}
        </span>
        <span className="text-zinc-400 font-medium">AC</span>
      </div>

      <button
        onClick={onBuy}
        disabled={isLoading}
        className={`w-full bg-main-color hover:bg-main-color/90 text-white font-bold py-2.5 px-4 rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-md ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isLoading ? 'Processing...' : 'Buy Now'}
      </button>
      
      <p className="text-xs text-zinc-500 mt-3 text-center">
        Secure transaction via ArtChain
      </p>
    </div>
  );
};

export default BuyBox;
