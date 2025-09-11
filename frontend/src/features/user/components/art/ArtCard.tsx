import React, { useState } from "react";
import type { ArtWithUser } from "../../hooks/art/useGetAllArt";
import { View, User, Star, MessageSquare, Gem } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ArtCardProps {
  item: ArtWithUser;
  lastArtRef?: (node: HTMLDivElement | null) => void;
}

const ArtCard: React.FC<ArtCardProps> = ({ item, lastArtRef }) => {
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const navigate = useNavigate();

  const handleArtClick = () => {
    navigate(`/art/${item.art._id}`);
  };

  const handleProfileClick = () => {
    navigate(`/${item?.user?.username}`);
  };

  return (
    <>
      <div
        ref={lastArtRef ?? null}
        className="relative w-auto h-72 overflow-hidden shadow-lg group cursor-pointer"
        onClick={handleArtClick} 
      >
        <img
          src={item.art.previewUrl}
          alt={item.art.title}
          className="h-72 w-auto object-contain group-hover:brightness-50 transition-all duration-300"
        />

        {/* Overlay */}
        <div className="absolute inset-0 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-3">
          {/* Top-right: zoom */}
          <div className="flex justify-end">
            <button
              onClick={(e) => { e.stopPropagation(); setIsZoomOpen(true); }}
              className="text-white bg-white/10 p-1 rounded-full hover:bg-black/70"
            >
              <View />
            </button>
          </div>

          {/* Bottom-left: profile + title */}
          <div
            className="flex items-center gap-2 absolute bottom-3 left-3"
            onClick={(e) => { e.stopPropagation(); handleProfileClick(); }}
          >
            {item.user?.profileImage ? (
              <img
                src={item.user.profileImage}
                alt={item.user.name || "Profile"}
                className="w-10 h-10 rounded-full border border-zinc-300 dark:border-zinc-600"
              />
            ) : item.user?.name ? (
              <div className="w-10 h-10 rounded-full bg-zinc-600 dark:bg-zinc-700 flex items-center justify-center text-white text-xl">
                {item.user.name.charAt(0).toUpperCase()}
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full bg-zinc-600 dark:bg-zinc-700 flex items-center justify-center text-white">
                <User className="w-5 h-5" />
              </div>
            )}
            <div className="flex flex-col text-white">
              <span className="font-semibold">{item.user?.name || "Unknown"}</span>
              <span className="text-sm">{item.art.title}</span>
            </div>
          </div>

          {/* Bottom-right: vertical icons */}
          <div className="flex flex-col gap-2 absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={(e) => e.stopPropagation()}
              className="bg-white/10 p-2 rounded-full hover:bg-black/70 text-white"
            >
              <Gem size={20} />
            </button>
            <button
              onClick={(e) => e.stopPropagation()}
              className="bg-white/10 p-2 rounded-full hover:bg-black/70 text-white"
            >
              <MessageSquare size={20} />
            </button>
            <button
              onClick={(e) => e.stopPropagation()}
              className="bg-white/10 p-2 rounded-full hover:bg-black/70 text-white"
            >
              <Star size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Zoom modal */}
      {isZoomOpen && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setIsZoomOpen(false)}
        >
          <img
            src={item.art.previewUrl}
            alt={item.art.title}
            className="max-h-full max-w-full object-contain"
          />
        </div>
      )}
    </>
  );
};

export default ArtCard;
