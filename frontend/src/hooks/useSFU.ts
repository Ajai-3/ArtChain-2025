import { useState, useCallback } from 'react';

// Mock SFU Service interface
export interface SFUParticipant {
  id: string;
  stream: MediaStream | null; // In real app, this would be a remote stream
  isMuted: boolean;
  isVideoOff: boolean;
}

export const useSFU = () => {
  const [participants, setParticipants] = useState<SFUParticipant[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  const joinRoom = useCallback(async (roomId: string, userId: string, localStream: MediaStream) => {
    console.log(`Joining SFU room: ${roomId} as ${userId} with stream ${localStream.id}`);
    setIsConnected(true);
    
    // Mock adding some participants after a delay
    setTimeout(() => {
      setParticipants([
        { id: 'user-1', stream: null, isMuted: false, isVideoOff: false },
        { id: 'user-2', stream: null, isMuted: true, isVideoOff: false },
      ]);
    }, 1000);
  }, []);

  const leaveRoom = useCallback(() => {
    console.log("Leaving SFU room");
    setIsConnected(false);
    setParticipants([]);
  }, []);

  const toggleMic = useCallback((userId: string) => {
      // Send signal to SFU
      console.log("Toggling mic for", userId);
  }, []);

  const toggleCamera = useCallback((userId: string) => {
      // Send signal to SFU
      console.log("Toggling camera for", userId);
  }, []);

  return {
    joinRoom,
    leaveRoom,
    participants,
    isConnected,
    toggleMic,
    toggleCamera
  };
};
