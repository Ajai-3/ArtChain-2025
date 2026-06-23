import { createContext, useContext } from 'react';
import type { VideoCallContextType } from '../context/VideoCallContext';


export const VideoCallContext = createContext<VideoCallContextType | null>(null);

export const useVideoCall = () => {
  const context = useContext(VideoCallContext);
  if (!context) {
    throw new Error('useVideoCall must be used within a VideoCallProvider');
  }
  return context;
};