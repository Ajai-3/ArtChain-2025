import { Star } from "lucide-react";
import { useState } from "react";

interface ArtCardFavoriteButtonProps {
  isFavorited: boolean;
  favoriteCount: number;
  onClick: (e: React.MouseEvent) => void;
  size?: number;
}

export const ArtCardFavoriteButton: React.FC<ArtCardFavoriteButtonProps> = ({
  isFavorited,
  favoriteCount,
  onClick,
  size = 20,
}) => {
  const [animate, setAnimate] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAnimate(true);
    onClick(e);
    setTimeout(() => setAnimate(false), 300);
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-1 bg-white/10 p-2 rounded-full hover:bg-black/70 text-white transition-all duration-200"
    >
      <Star
        size={size}
        className={`transition-transform duration-300 ${
          isFavorited ? "text-yellow-400 fill-yellow-400" : "text-white"
        } ${animate ? "scale-125" : "scale-100"}`}
      />
      <span className="text-sm min-w-[20px] text-right">{favoriteCount}</span>
    </button>
  );
};
