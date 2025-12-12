import React from "react";
import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ArtInfoProps {
  art: {
    title: string;
    createdAt: string;
    hashtags: string[];
    description?: string;
  };
  artist: {
    username: string;
    name: string;
    profileImage?: string;
  };
  formattedDate: string;
}

const ArtInfo: React.FC<ArtInfoProps> = ({ art, artist, formattedDate }) => {
  const navigate = useNavigate();

  return (
    <div className="w-full flex flex-col gap-4 mt-3 sm:px-20">
      {/* Artist & Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full gap-3">
        <div className="flex gap-3 items-center">
          {artist?.profileImage ? (
            <img
              src={artist.profileImage}
              alt={artist.username}
              className="w-10 h-10 rounded-full object-cover border border-zinc-700"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-zinc-600 dark:bg-zinc-800 flex items-center justify-center text-white">
              {artist?.name?.charAt(0).toUpperCase() || (
                <User className="w-4 h-4" />
              )}
            </div>
          )}
          <div>
            <h1 className="text-lg font-bold text-zinc-100">{art.title}</h1>
            <p className="text-sm font-medium text-zinc-400">
              by{" "}
              <span
                className="text-zinc-300 font-semibold cursor-pointer hover:text-main-color transition-colors"
                onClick={() => navigate(`/${artist?.username}`)}
              >
                {artist?.username}
              </span>
            </p>
          </div>
        </div>

        <div className="text-zinc-500 font-medium text-xs">
          {formattedDate}
        </div>
      </div>

      {/* Tags */}
      {art.hashtags?.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {art.hashtags.map((tag) => (
            <span
              key={tag}
              className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-2.5 py-1 rounded-full cursor-pointer text-xs transition-colors border border-zinc-700"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Description */}
      <div className="text-zinc-400 leading-relaxed">
        <h2 className="text-base font-semibold mb-1.5 text-zinc-200">Description</h2>
        <p className="whitespace-pre-wrap text-sm">{art.description || "No description available."}</p>
      </div>
    </div>
  );
};

export default ArtInfo;
