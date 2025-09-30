import { Gem } from "lucide-react";
import { useState } from "react";

export const LikeButton = ({
  isLiked,
  likeCount,
  onClick,
}: {
  isLiked: boolean;
  likeCount: number;
  onClick: () => void;
}) => {
  const [animate, setAnimate] = useState(false);

  const handleClick = () => {
    setAnimate(true);
    onClick(); 
    setTimeout(() => setAnimate(false), 300);
  };

  return (
    <div className="flex items-center gap-2 cursor-pointer">
      <Gem
        size={22}
        onClick={handleClick}
        className={`transition-transform duration-300 
          ${isLiked ? "text-pink-500 fill-pink-500" : "text-white/60"} 
          ${animate ? "scale-125" : "scale-100"}`}
      />
    </div>
  );
};
