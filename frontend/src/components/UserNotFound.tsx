import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { ROUTES } from '../constants/routes';
import { UserX } from 'lucide-react';

const UserNotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] w-full flex items-center justify-center relative overflow-hidden bg-background text-foreground p-6">
      
      {/* --- ARTISTIC BACKGROUND ELEMENTS --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -right-10 top-1/4 w-64 h-64 bg-primary/5 rounded-full blur-[100px] animate-pulse-slow" />
        <div className="absolute left-10 bottom-1/4 w-48 h-48 bg-primary/10 rounded-full blur-[80px] animate-pulse-slower" />
        
        {/* Floating geometric icons */}
        <div className="hidden lg:block absolute left-1/4 top-20 w-12 h-12 opacity-10 animate-float">
          <div className="w-full h-full border border-primary rounded-sm rotate-12" />
        </div>
      </div>

      <div className="relative z-10 max-w-sm w-full flex flex-col items-center space-y-6 animate-in fade-in zoom-in-95 duration-500">
        
        {/* Empty User Avatar State */}
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center border-2 border-dashed border-muted-foreground/30">
            <UserX className="w-10 h-10 text-muted-foreground/60" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-background rounded-full flex items-center justify-center border border-border">
             <span className="text-lg">❓</span>
          </div>
        </div>

        <div className="text-center space-y-3">
          <h2 className="text-2xl font-bold tracking-tight">
            User not found
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            The profile you are looking for might have been deleted, or the username is incorrect.
          </p>
        </div>

        <div className="flex flex-col w-full gap-3 pt-4">
          <Button 
            onClick={() => navigate(ROUTES.HOME)}
            variant="default"
            className="w-full py-6 rounded-xl font-semibold shadow-md shadow-primary/10 hover:scale-[1.02] transition-transform"
          >
            Explore Artworks
          </Button>
          
          <Button 
            onClick={() => window.history.back()}
            variant="outline"
            className="w-full py-6 rounded-xl font-semibold border-primary/20 hover:bg-primary/5"
          >
            Go Back
          </Button>
        </div>
      </div>

      {/* --- ANIMATION STYLES --- */}
      <style>{`
        @keyframes pulseSlow {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.2; transform: scale(1.15); }
        }
        @keyframes pulseSlower {
          0%, 100% { opacity: 0.05; }
          50% { opacity: 0.15; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(12deg); }
          50% { transform: translateY(-15px) rotate(20deg); }
        }
        .animate-pulse-slow { animation: pulseSlow 7s ease-in-out infinite; }
        .animate-pulse-slower { animation: pulseSlower 12s ease-in-out infinite; }
        .animate-float { animation: float 5s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default UserNotFound;