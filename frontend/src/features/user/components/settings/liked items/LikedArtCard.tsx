import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { MessageSquare, User, View, MoreVertical } from "lucide-react";
import { Badge } from "../../../../../components/ui/badge";
import { useLikePost } from "../../../hooks/art/useLikePost";
import { useUnlikePost } from "../../../hooks/art/useUnlikePost";
import { useFavoritePost } from "../../../hooks/art/useFavoritePost";
import { useUnfavoritePost } from "../../../hooks/art/useUnfavoritePost";
import { ArtCardLikeButton } from "../../art/ArtCardLikeButton"; // Ensure this path is correct
import { ArtCardFavoriteButton } from "../../art/ArtCardFavoriteButton"; // Ensure this path is correct
import { ROUTES } from "../../../../../constants/routes";
import type { RootState } from "../../../../../redux/store";

export const LikedArtCard: React.FC<{ item: any }> = ({ item }) => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.user);

  const likePost = useLikePost();
  const unlikePost = useUnlikePost();
  const favoritePost = useFavoritePost();
  const unfavoritePost = useUnfavoritePost();

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user || !isAuthenticated) {
      navigate(ROUTES.LOGIN);
      return;
    }

    const args = { postId: item.art.id, artname: item.art.artName };
    if (item.isLiked) {
      unlikePost.mutate(args);
    } else {
      likePost.mutate(args);
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user || !isAuthenticated) {
      navigate(ROUTES.LOGIN);
      return;
    }

    const args = { postId: item.art.id, artname: item.art.artName };
    if (item.isFavorited) {
      unfavoritePost.mutate(args);
    } else {
      favoritePost.mutate(args);
    }
  };

  return (
    <div 
      className="group relative rounded-2xl overflow-hidden bg-zinc-900 border border-white/5 shadow-lg cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
      onClick={() => navigate(ROUTES.ART_PAGE(item.user.username, item.art.artName))}
    >
      {/* Art Image */}
      <img
        src={item.art.imageUrl}
        alt={item.art.title}
        className="w-full h-auto object-cover transition-all duration-500 group-hover:brightness-50"
      />

      {/* Sale Indicator (Green Pulse) */}
      {item.art.isForSale && (
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <div className="relative w-3 h-3">
            <span className="absolute inset-0 bg-green-500 rounded-full animate-pulse opacity-70"></span>
            <span className="absolute inset-0 bg-green-500 rounded-full border border-white"></span>
          </div>
        </div>
      )}

      {/* Top Right Actions */}
      <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="text-white bg-white/10 p-1.5 rounded-full hover:bg-black/70">
          <View size={18} />
        </button>
      </div>

      {/* Overlay: User Info & Action Bar */}
      <div className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-black/90 via-transparent to-transparent">
        
        {/* User Info Section */}
        <div 
          className="flex items-center gap-2 mb-4 cursor-pointer max-w-[80%]"
          onClick={(e) => {
            e.stopPropagation();
            navigate(ROUTES.PROFILE(item.user.username));
          }}
        >
          {item.user?.profileImage ? (
            <img src={item.user.profileImage} className="w-8 h-8 rounded-full border border-white/20" alt="" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center text-white text-[10px] font-bold">
              {item.user?.name?.charAt(0) || <User size={12}/>}
            </div>
          )}
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-semibold text-white truncate">{item.user?.name}</span>
            <span className="text-[10px] text-zinc-300 truncate">{item.art.title}</span>
          </div>
        </div>

        {/* Action Bar: Matching ArtCard Style */}
        <div className="flex items-center justify-between border-t border-white/10 pt-3">
          <div className="flex gap-4 items-center">
            {/* Proper Like Button Component */}
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
              <span className="text-sm font-medium">{item.commentCount}</span>
              <MessageSquare size={20} />
            </button>
          </div>

          {/* Proper Favorite Button Component */}
          <ArtCardFavoriteButton
            isFavorited={item.isFavorited}
            favoriteCount={item.favoriteCount}
            onClick={handleFavoriteClick}
            size={20}
          />
        </div>
      </div>
    </div>
  );
};