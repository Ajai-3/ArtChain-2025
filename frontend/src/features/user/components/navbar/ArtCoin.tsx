import { Coins } from "lucide-react";
import React from "react";
import type { User } from "../../../../types/users/user/user";

interface ArtCoinProps {
  coin: number;
}

const ArtCoin: React.FC<ArtCoinProps> = ({ coin }) => {
  return (
    <div className="flex items-center gap-1 text-sm font-medium bg-main-color/10 text-main-color px-3 py-1 rounded-full">
      <Coins className="w-4 h-4" />
      {coin} AC
    </div>
  );
};

export default ArtCoin;
