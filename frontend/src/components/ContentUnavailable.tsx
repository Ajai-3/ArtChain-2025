import React from 'react';
import { ROUTES } from '../constants/routes';
import { useNavigate } from 'react-router-dom';

const ContentUnavailable: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full p-6 text-center animate-in fade-in duration-500">
      <div className="max-w-md space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          Sorry, this page isn't available.
        </h2>

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