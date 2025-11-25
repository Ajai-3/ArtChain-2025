import React from "react";
import {
  Star,
  MessageSquare,
  ImageDown,
  ZoomIn,
  MoreVertical,
} from "lucide-react";
import { LikeButton } from "../LikeButton";
import { formatNumber } from "../../../../../libs/formatNumber";
import FavoriteUsersModal from "../FavoriteUsersModal";
import LikeUsersModal from "../LikeUsersModal";
import { ContentOptionsModal } from "../../report/ContentOptionsModal";

interface ArtActionsProps {
  art: {
    id: string;
    artName: string;
    isForSale: boolean;
    downloadingDisabled: boolean;
    price?: { artcoins?: number };
  };
  stats: {
    isLiked: boolean;
    likeCount: number;
    isFavorited: boolean;
    favoriteCount: number;
    commentCount: number;
  };
  user: {
    isAuthenticated: boolean;
  };
  handlers: {
    onLike: () => void;
    onFavorite: () => void;
    onShowLikes: () => void;
    onShowFavorites: () => void;
    onZoom: () => void;
    onCloseLikes: () => void;
    onCloseFavorites: () => void;
    onReport: () => void;
    onCloseReport: () => void;
  };
  modals: {
    showLikes: boolean;
    showFavorites: boolean;
    showReport: boolean;
  };
}

const ArtActions: React.FC<ArtActionsProps> = ({
  art,
  stats,
  user,
  handlers,
  modals,
}) => {
  return (
    <div className="flex flex-wrap justify-between sm:justify-between items-center w-full mt-3 gap-2 sm:gap-4 sm:px-20">
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Favorites */}
        <div className="flex items-center gap-1">
          <span
            className="cursor-pointer block sm:hidden"
            onClick={handlers.onShowFavorites}
          >
            {formatNumber(stats.favoriteCount || 0)}
          </span>
          <Star
            size={22}
            className={`transition-transform duration-300 cursor-pointer ${
              stats.isFavorited
                ? "text-yellow-500 fill-yellow-500"
                : "text-white/60 hover:text-yellow-500"
            }`}
            onClick={handlers.onFavorite}
          />
          <span
            className="hidden sm:inline cursor-pointer hover:text-yellow-400 transition-colors"
            onClick={handlers.onShowFavorites}
          >
            {formatNumber(stats.favoriteCount || 0)} Favorites
          </span>
        </div>

        {user.isAuthenticated && (
          <FavoriteUsersModal
            postId={art.id}
            isOpen={modals.showFavorites}
            onClose={handlers.onCloseFavorites}
          />
        )}

        {/* Comments */}
        <div className="flex items-center gap-1 cursor-pointer hover:text-green-400 transition-colors">
          <span className="block sm:hidden">
            {formatNumber(stats.commentCount || 0)}
          </span>
          <MessageSquare size={22} />
          <span className="hidden sm:inline">
            {formatNumber(stats.commentCount || 0)} Comments
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1">
        {/* Likes */}
        <span
          className="cursor-pointer block sm:hidden"
          onClick={handlers.onShowLikes}
        >
          {formatNumber(stats.likeCount || 0)}
        </span>
        <LikeButton
          isLiked={stats.isLiked}
          likeCount={stats.likeCount || 0}
          onClick={handlers.onLike}
        />
        <div className="flex items-center gap-2 cursor-pointer hover:text-pink-500 transition-colors">
          <span className="hidden sm:inline" onClick={handlers.onShowLikes}>
            {formatNumber(stats.likeCount || 0)} Likes
          </span>
        </div>

        {user.isAuthenticated && (
          <LikeUsersModal
            postId={art.id}
            isOpen={modals.showLikes}
            onClose={handlers.onCloseLikes}
          />
        )}

        {/* Buy Button */}
        {art.isForSale && art.price?.artcoins && (
          <div className="bg-main-color/20 hover:bg-main-color/40 py-1 px-3 text-main-color rounded-full cursor-pointer text-sm font-medium transition-colors">
            Buy {art.price.artcoins} AC
          </div>
        )}

        {/* Download */}
        {!art.downloadingDisabled && (
          <ImageDown className="cursor-pointer hover:text-blue-400 transition-colors" />
        )}

        {/* Zoom */}
        <button
          onClick={handlers.onZoom}
          className="bg-main-color/20 hover:bg-main-color/40 p-2 rounded-full flex items-center justify-center transition-colors"
        >
          <ZoomIn size={20} className="dark:text-gray-300" />
        </button>

        {/* More */}
        <button
          onClick={() => handlers.onReport()}
          className="hover:text-gray-400 transition-colors"
        >
          <MoreVertical size={22} />
        </button>
      </div>

      <ContentOptionsModal
        isOpen={modals.showReport}
        onClose={handlers.onCloseReport}
        targetId={art.id}
        targetType="art"
      />
    </div>
  );
};

export default ArtActions;
