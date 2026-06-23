import React from 'react';
import { useAuthInitialization } from '../../hooks/useAuthInitialization';

interface AuthInitializerProps {
  children: React.ReactNode;
}

export const AuthInitializer: React.FC<AuthInitializerProps> = ({
  children,
}) => {
  const { loading } = useAuthInitialization();

  if (loading) {
    return (
      <div className='fixed inset-0 bg-background flex flex-col items-center justify-center z-50'>
        <h1 className='text-4xl sm:text-5xl md:text-6xl font-bold font-kaushan text-main-color tracking-wider mb-20 animate-pulse'>
          ArtChain
        </h1>

        <div className='absolute bottom-12 flex flex-col items-center gap-2'>
          <div className='text-xs text-muted-foreground tracking-[0.2em] font-medium text-gray-400'>
            from
          </div>
          <div className='flex items-center gap-2 font-semibold tracking-widest text-lg bg-gradient-to-r from-blue-600 to-red-600 bg-clip-text text-transparent'>
            Liora.ai
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
