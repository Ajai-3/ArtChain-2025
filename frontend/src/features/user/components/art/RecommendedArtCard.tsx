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
      className="relative group cursor-pointer overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
    >
      <img
        src={art.imageUrl || "/placeholder.png"}
        alt={art.title}
        className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
    </div>
  );
};

export default RecommendedArtCard;
