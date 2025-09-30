import React, { useState } from "react";
import type { ArtWithUser } from "../../hooks/art/useGetAllArt";
import { View, User, Star, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLikePost } from "../../hooks/art/useLikePost";
import { useUnlikePost } from "../../hooks/art/useUnlikePost";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../redux/store";
import { ArtCardLikeButton } from "./ArtCardLikeButton";
import { useFavoritePost } from "../../hooks/art/useFavoritePost";
import { useUnfavoritePost } from "../../hooks/art/useUnfavoritePost";
import { ArtCardFavoriteButton } from "./ArtCardFavoriteButton";

interface ArtCardProps {
  item: ArtWithUser;
  lastArtRef?: (node: HTMLDivElement | null) => void;
}

const ArtCard: React.FC<ArtCardProps> = ({ item, lastArtRef }) => {
  const user = useSelector((state: RootState) => state.user)
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const navigate = useNavigate();

  const likePost = useLikePost();
  const unlikePost = useUnlikePost();
   const favoritePost = useFavoritePost();
  const unfavoritePost = useUnfavoritePost();

  const handleArtClick = () => {
    navigate(`/${item?.user?.username}/art/${item.art.artName}`);
  };

  const handleProfileClick = () => {
    navigate(`/${item?.user?.username}`);
  };

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!user.user || !user.isAuthenticated) {
      navigate("/login");
      return;
    }

    if (item.isLiked) {
      unlikePost.mutate({ 
        postId: item.art.id, 
        artname: item.art.artName 
      });
    } else {
      likePost.mutate({ 
        postId: item.art.id, 
        artname: item.art.artName 
      });
    }
  };

   const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user.user || !user.isAuthenticated) {
      navigate("/login");
      return;
    }
    if (item.isFavorited) {
      unfavoritePost.mutate({ postId: item.art.id, artname: item.art.artName });
    } else {
      favoritePost.mutate({ postId: item.art.id, artname: item.art.artName });
    }
  };

  return (
    <>
      <div
        ref={lastArtRef ?? null}
        className="relative w-auto h-72 overflow-hidden shadow-lg group cursor-pointer"
        onClick={handleArtClick} 
      >
        <img
          src={item?.art?.imageUrl}
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
            className="flex items-center gap-2 absolute bottom-3 left-3 cursor-pointer"
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
          <div className="flex flex-col gap-2 absolute bottom-3 right-3">
            <ArtCardLikeButton
              isLiked={item.isLiked}
              likedCount={item.likeCount}
              onClick={handleLikeClick}
              size={20}
            />
            <button
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 bg-white/10 p-2 rounded-full hover:bg-black/70 text-white"
            >
              <MessageSquare size={20} />
              <span className="text-sm min-w-[20px] text-right">{item.commentCount}</span>
            </button>
             <ArtCardFavoriteButton
              isFavorited={item.isFavorited}
              favoriteCount={item.favoriteCount}
              onClick={handleFavoriteClick}
              size={20}
            />
          </div>
        </div>
      </div>

      {/* Zoom modal */}
      {isZoomOpen && (
        <div
          className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setIsZoomOpen(false)}
        >
          <img
            src={item.art.imageUrl}
            alt={item.art.title}
            className="max-h-full max-w-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
};

export default ArtCard;