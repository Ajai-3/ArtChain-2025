import React from 'react';
import { User, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
    role?: string;
    isVerified?: boolean;
  };
  formattedDate: string;
  purchaser?: {
    name: string;
    username: string;
    profileImage?: string;
    role?: string;
    isVerified?: boolean;
  } | null;
}

const ArtInfo: React.FC<ArtInfoProps> = ({
  art,
  artist,
  formattedDate,
  purchaser,
}) => {
  const navigate = useNavigate();

  return (
    <div className='w-full flex flex-col gap-4 mt-3 sm:px-20'>
      {/* Artist & Title */}
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center w-full gap-3'>
        <div className='flex gap-3 items-center'>
          {artist?.profileImage ? (
            <img
              src={artist.profileImage}
              alt={artist.username}
              className='w-10 h-10 rounded-full object-cover border border-zinc-700'
            />
          ) : (
            <div className='w-10 h-10 rounded-full bg-zinc-600 dark:bg-zinc-800 flex items-center justify-center text-white'>
              {artist?.name?.charAt(0).toUpperCase() || (
                <User className='w-4 h-4' />
              )}
            </div>
          )}
          <div>
            <h1 className='text-lg font-bold text-zinc-100'>{art.title}</h1>
            <div className='flex items-center gap-1 mt-1'>
              <p className='text-sm font-medium text-zinc-400'>
                by{' '}
                <span
                  className='text-zinc-300 font-semibold cursor-pointer hover:text-main-color transition-colors'
                  onClick={() => navigate(`/${artist?.username}`)}
                >
                  {artist?.username}
                </span>
              </p>
              {artist?.isVerified && artist?.role === 'artist' && (
                <Shield
                  className='w-[1em] h-[1em] text-main-color-dark flex-shrink-0 text-sm'
                  strokeWidth={2}
                  fill='currentColor'
                />
              )}
            </div>
          </div>
        </div>

        <div className='text-zinc-500 font-medium text-xs'>{formattedDate}</div>
      </div>

      {/* Purchaser Info - Only if sold */}
      {purchaser && (
        <div className='group flex items-center gap-3 p-1.5 pr-4 bg-zinc-900/40 hover:bg-zinc-800/60 rounded-full border border-zinc-800 transition-all duration-300 w-fit'>
          {/* Avatar Section */}
          <div
            className='relative cursor-pointer'
            onClick={() => navigate(`/${purchaser.username}`)}
          >
            {purchaser.profileImage ? (
              <img
                src={purchaser.profileImage}
                alt={purchaser.username}
                className='w-10 h-10 rounded-full object-cover border border-zinc-700 group-hover:border-purple-500/50 transition-colors'
              />
            ) : (
              <div className='w-10 h-10 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center text-[10px] text-zinc-300 border border-zinc-700'>
                {purchaser.username.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* Text Section */}
          <div className='flex flex-col'>
            <div className='flex items-center gap-1.5'>
              <span className='text-[10px] uppercase tracking-wider text-zinc-500 font-bold'>
                Sold to
              </span>
              <span className='w-1 h-1 rounded-full bg-zinc-700' />
              <div className="flex items-center gap-1">
                <span
                  className='text-xs font-semibold text-zinc-200 cursor-pointer hover:text-white'
                  onClick={() => navigate(`/${purchaser.username}`)}
                >
                  {purchaser.name}
                </span>
                {purchaser.isVerified && purchaser.role === 'artist' && (
                  <Shield
                    className='w-[1em] h-[1em] text-main-color-dark flex-shrink-0 text-xs'
                    strokeWidth={2}
                    fill='currentColor'
                  />
                )}
              </div>
            </div>
            <span className='text-[10px] text-zinc-500 font-medium'>
              @{purchaser.username}
            </span>
          </div>
        </div>
      )}

      {/* Tags */}
      {art.hashtags?.length > 0 && (
        <div className='flex flex-wrap gap-1.5'>
          {art.hashtags.map((tag) => (
            <span
              key={tag}
              className='bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-2.5 py-1 rounded-full cursor-pointer text-xs transition-colors border border-zinc-700'
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Description */}
      <div className='text-zinc-400 leading-relaxed'>
        <h2 className='text-base font-semibold mb-1.5 text-zinc-200'>
          Description
        </h2>
        <p className='whitespace-pre-wrap text-sm'>
          {art.description || 'No description available.'}
        </p>
      </div>
    </div>
  );
};

export default ArtInfo;
