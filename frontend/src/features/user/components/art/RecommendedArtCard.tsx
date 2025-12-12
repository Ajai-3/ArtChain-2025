import React from "react";
import { useNavigate } from "react-router-dom";

interface RecommendedArtCardProps {
  art: {
    artName: string;
    imageUrl: string;
    title: string;
  };
  username: string;
}

const RecommendedArtCard: React.FC<RecommendedArtCardProps> = ({
  art,
  username,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (username && art.artName) {
      navigate(`/${username}/art/${art.artName}`);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="relative group cursor-pointer overflow-hidden rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 bg-zinc-900 border border-zinc-800"
    >
      <div className="aspect-[4/3] overflow-hidden">
        <img
          src={art.imageUrl || "/placeholder.png"}
          alt={art.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
        <p className="text-white text-sm font-medium truncate w-full">{art.title}</p>
      </div>
    </div>
  );
};

export default RecommendedArtCard;
