import React from "react";
import { Star, User, IndianRupee, Coins, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ShopItemProps {
  item: {
    id: string;
    previewUrl: string;
    title: string;
    favoriteCount: number;
    priceType: "artcoin" | "fiat";
    artcoins?: number;
    fiatPrice?: number;
    artName: string;
    user?: {
      profileImage?: string;
      username: string;
    };
  };
}

const ShopItemCard: React.FC<ShopItemProps> = ({ item }) => {
  const navigate = useNavigate();

  return (
    <div
      className="group relative bg-card/40 backdrop-blur-sm border border-white/5 rounded-xl overflow-hidden hover:shadow-2xl hover:shadow-green-500/10 transition-all duration-300 cursor-pointer h-full flex flex-col"
      onClick={() => navigate(`/${item.user?.username}/art/${item.artName}`)}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={item.previewUrl}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

        {/* Price Badge */}
        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-1.5 shadow-lg">
          {item.priceType === "artcoin" ? (
            <Coins className="w-3.5 h-3.5 text-yellow-400" />
          ) : (
            <IndianRupee className="w-3.5 h-3.5 text-green-400" />
          )}
          <span className="text-white font-bold text-sm">
            {item.priceType === "artcoin" ? item.artcoins : item.fiatPrice}
          </span>
        </div>

        {/* Favorite Count Badge */}
        <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1.5 rounded-full border border-white/10 flex items-center gap-1.5">
          <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
          <span className="text-white text-xs font-medium">{item.favoriteCount}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 gap-3">
        <div className="flex justify-between items-start gap-2">
          <h3 className="text-white font-semibold text-lg leading-tight line-clamp-1 group-hover:text-green-400 transition-colors">
            {item.title}
          </h3>
        </div>

        <div className="mt-auto flex items-center justify-between pt-3 border-t border-white/5">
          {/* User Info */}
          <div className="flex items-center gap-2.5 group/user">
            <div className="relative">
              {item.user?.profileImage ? (
                <img
                  src={item.user.profileImage}
                  alt={item.user.username}
                  className="w-8 h-8 rounded-full border border-white/10 object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center border border-white/10">
                  <User className="w-4 h-4 text-zinc-400" />
                </div>
              )}
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-black" />
            </div>
            <div className="flex flex-col">
              <span className="text-zinc-400 text-xs">Creator</span>
              <span className="text-zinc-200 text-xs font-medium group-hover/user:text-white transition-colors">
                @{item.user?.username}
              </span>
            </div>
          </div>

          {/* Buy Action Hint */}
          <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-green-500 group-hover:text-black transition-all duration-300">
            <ShoppingBag className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopItemCard;
