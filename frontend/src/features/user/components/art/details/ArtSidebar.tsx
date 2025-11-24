import React, { useRef } from "react";
import RecommendedArtCard from "../RecommendedArtCard";
import BuyBox from "./BuyBox";

interface ArtSidebarProps {
  isForSale: boolean;
  price?: { artcoins?: number; fiat?: number };
  onBuy: () => void;
  recommendedArts: Array<{
    art: {
      id: string;
      title: string;
      imageUrl: string;
      artName: string;
    };
    user: {
      username: string;
    } | null;
  }>;
  isRecLoading: boolean;
  observerTarget: React.RefObject<HTMLDivElement>;
}

const ArtSidebar: React.FC<ArtSidebarProps> = ({
  isForSale,
  price,
  onBuy,
  recommendedArts,
  isRecLoading,
  observerTarget,
}) => {
  return (
    <div className="w-full lg:w-[340px] shrink-0 mt-4 lg:mt-0">
      {isForSale && <BuyBox price={price} onBuy={onBuy} />}

      <div className="bg-zinc-900/50 rounded-xl p-3 border border-zinc-800/50">
        <h3 className="text-base font-semibold mb-3 text-white">Recommended</h3>
        <div className="grid grid-cols-2 gap-2.5">
          {recommendedArts.map((item) => (
            <RecommendedArtCard
              key={item.art.id}
              art={item.art}
              username={item.user?.username || ""}
            />
          ))}
          {isRecLoading && (
            <div className="col-span-full text-center text-zinc-500 py-3 text-sm">
              Loading...
            </div>
          )}
          {!isRecLoading && recommendedArts.length === 0 && (
            <div className="col-span-full text-center text-zinc-500 py-3 text-sm">
              No recommendations found.
            </div>
          )}
          <div ref={observerTarget} className="h-2 w-full col-span-full" />
        </div>
      </div>
    </div>
  );
};

export default ArtSidebar;
