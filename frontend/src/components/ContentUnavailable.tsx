import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';

const ContentUnavailable: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full p-6 text-center animate-in fade-in duration-500">
      <div className="max-w-md space-y-6">
        {/* Main Header - Fixed text like the IG style */}
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          Sorry, this page isn't available.
        </h2>

        {/* Subtext with the link embedded */}
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          The link you followed may be broken, or the page may have been removed.{" "}
          <button
            onClick={() => navigate(ROUTES.HOME)}
            className="font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            Go back to ArtChain.
          </button>
        </p>
      </div>
    </div>
  );
};

export default ContentUnavailable;