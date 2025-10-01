// components/art/ArtCardLikeButton.tsx
import { Gem } from "lucide-react";
import { useState } from "react";

interface ArtCardLikeButtonProps {
  isLiked: boolean;
  likedCount: number;
  onClick: (e: React.MouseEvent) => void;
  size?: number;
}

export const ArtCardLikeButton: React.FC<ArtCardLikeButtonProps> = ({
  isLiked,
  likedCount,
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
      className="flex items-center gap-1 transition-all duration-200"
    >
      <span className="text-sm min-w-[20px] text-right">{likedCount}</span>
      <Gem
        size={size}
        className={`transition-transform duration-300 ${
          isLiked ? "text-pink-500 fill-pink-500" : "text-white"
        } ${animate ? "scale-125" : "scale-100"}`}
      />
    </button>
  );
};
