import { Coins } from "lucide-react";
import React from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../redux/store";



const ArtCoin: React.FC = () => {
  const wallet = useSelector((state: RootState) => state.wallet)

  const formatBalance = (balance: number) => {
  if (balance >= 1_000_000_000) return (balance / 1_000_000_000).toFixed(1) + "B";
  if (balance >= 1_000_000) return (balance / 1_000_000).toFixed(1) + "M";
  if (balance >= 1_000) return (balance / 1_000).toFixed(1) + "K";
  return balance.toString();
};

  return (
    <div className="flex items-center gap-1 text-sm font-medium bg-main-color/10 text-main-color px-3 py-1 rounded-full">
      <Coins className="w-4 h-4" />
      {formatBalance(wallet.balance)} AC
    </div>
  );
};

export default ArtCoin;
