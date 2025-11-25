import React, { useState } from "react";
import type { ArtWithUser } from "../../hooks/art/useGetAllArt";
import { View, User, MessageSquare, MoreVertical } from "lucide-react";
import { ContentOptionsModal } from "../report/ContentOptionsModal";
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
  const user = useSelector((state: RootState) => state.user);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
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
        artname: item.art.artName,
      });
    } else {
      likePost.mutate({
        postId: item.art.id,
        artname: item.art.artName,
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
        className="relative w-full h-full overflow-hidden shadow-lg group cursor-pointer"
        onClick={handleArtClick}
      >
        <img
          src={item?.art?.imageUrl}
          alt={item.art.title}
          className="w-full h-full object-cover group-hover:brightness-50 transition-all duration-300"
        />

        <div className="absolute inset-0 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-2">
          <div className="flex justify-between">
            {item?.art?.isForSale && (
              <div className="relative w-4 h-4">
                <span className="absolute inset-0 bg-green-500 rounded-full animate-pulse opacity-70"></span>
                <span className="absolute inset-0 bg-green-500 rounded-full border-2 border-white"></span>
              </div>
            )}

            <div></div>
            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsZoomOpen(true);
                }}
                className="text-white bg-white/10 p-1 rounded-full hover:bg-black/70"
              >
                <View />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOptionsOpen(true);
                }}
                className="text-white bg-white/10 p-1 rounded-full hover:bg-black/70"
              >
                <MoreVertical size={24} />
              </button>
            </div>
          </div>

          <div
            className="absolute bottom-3 left-2 flex items-center gap-1 cursor-pointer max-w-[70%]"
            onClick={(e) => {
              e.stopPropagation();
              handleProfileClick();
            }}
          >
            {item.user?.profileImage ? (
              <img
                src={item.user.profileImage}
                alt={item.user.name || "Profile"}
                className="w-9 h-9 rounded-full border border-zinc-300 dark:border-zinc-600 flex-shrink-0"
              />
            ) : item.user?.name ? (
              <div className="w-9 h-9 rounded-full bg-zinc-600 dark:bg-zinc-700 flex items-center justify-center text-white text-xl flex-shrink-0">
                {item.user.name.charAt(0).toUpperCase()}
              </div>
            ) : (
              <div className="w-9 h-9 rounded-full bg-zinc-600 dark:bg-zinc-700 flex items-center justify-center text-white flex-shrink-0">
                <User className="w-5 h-5" />
              </div>
            )}

            <div className="flex flex-col overflow-hidden">
              <span className="font-medium text-sm text-white truncate">
                {item.user?.name || "Unknown"}
              </span>
              <span className="text-xs text-white truncate">
                {item.art.title}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-4 absolute bottom-3 right-2">
            <ArtCardLikeButton
              isLiked={item.isLiked}
              likedCount={item.likeCount}
              onClick={handleLikeClick}
              size={20}
            />
            <button
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 text-white"
            >
              <span className="text-sm min-w-[20px] text-right">
                {item.commentCount}
              </span>
              <MessageSquare size={20} />
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

      {isZoomOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-20"
          onClick={() => setIsZoomOpen(false)}
        >
          <img
            src={item.art.imageUrl}
            alt={item.art.title}
            onClick={(e) => e.stopPropagation()}
            className="max-w-full max-h-full object-contain rounded shadow-lg"
          />
        </div>
      )}

      <ContentOptionsModal
        isOpen={isOptionsOpen}
        onClose={() => setIsOptionsOpen(false)}
        targetId={item.art.id}
        targetType="art"
      />
    </>
  );
};

export default ArtCard;
